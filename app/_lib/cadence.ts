import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "./resend";
import { sendSms, placeCall, escapeXml } from "./twilio";

type Channel = "email" | "sms" | "call";
type Locale = "fr" | "en";

type Step = {
  templateId: string;
  channel: Channel;
  dayOffset: number;
  hourOffset: number;
  minuteOffset?: number;
};

const STEPS: Step[] = [
  { templateId: "email-day-0",  channel: "email", dayOffset: 0,  hourOffset: 9 },
  { templateId: "email-day-3",  channel: "email", dayOffset: 3,  hourOffset: 9 },
  { templateId: "sms-day-5",    channel: "sms",   dayOffset: 5,  hourOffset: 14 },
  { templateId: "email-day-7",  channel: "email", dayOffset: 7,  hourOffset: 9 },
  { templateId: "sms-day-10",   channel: "sms",   dayOffset: 10, hourOffset: 14 },
  { templateId: "call-day-12",  channel: "call",  dayOffset: 12, hourOffset: 13 },
  { templateId: "sms-day-12",   channel: "sms",   dayOffset: 12, hourOffset: 13, minuteOffset: 5 },
];

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://dragun.app"
  );
}

export async function scheduleCampaign(
  client: SupabaseClient,
  caseId: string,
  openedAt: Date,
): Promise<void> {
  const rows = STEPS.map((step) => {
    const at = new Date(openedAt);
    at.setUTCDate(at.getUTCDate() + step.dayOffset);
    at.setUTCHours(step.hourOffset, step.minuteOffset ?? 0, 0, 0);
    return {
      case_id: caseId,
      template_id: step.templateId,
      channel: step.channel,
      scheduled_at: at.toISOString(),
      status: "scheduled" as const,
    };
  });
  const { error } = await client.from("campaign_events").insert(rows);
  if (error) throw error;
}

export async function cancelCampaign(
  client: SupabaseClient,
  caseId: string,
): Promise<void> {
  const { error } = await client
    .from("campaign_events")
    .update({ status: "cancelled" })
    .eq("case_id", caseId)
    .eq("status", "scheduled");
  if (error) throw error;
}

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) =>
    vars[key] !== undefined ? vars[key] : `{{${key}}}`,
  );
}

function fmtMoney(cents: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

function buildVars(
  caseRow: {
    amount_cents: number;
    currency: string;
    description: string | null;
    paylink_slug: string;
  },
  org: { display_name: string; brand: { signature?: string | null } | null },
  debtor: { full_name: string; email: string | null; phone_e164: string | null },
  locale: Locale,
): Record<string, string> {
  const firstName = debtor.full_name.split(/\s+/)[0] ?? debtor.full_name;
  return {
    "org.display_name": org.display_name,
    "org.signature": org.brand?.signature ?? org.display_name,
    "debtor.full_name": debtor.full_name,
    "debtor.first_name": firstName,
    "case.amount_display": fmtMoney(caseRow.amount_cents, caseRow.currency, locale),
    "case.description": caseRow.description ?? "",
    "case.paylink_url": `${siteOrigin()}/p/${caseRow.paylink_slug}`,
  };
}

function bodyToHtml(body: string): string {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 1em 0;line-height:1.55">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `<div style="font-family:system-ui,sans-serif;color:#111;max-width:600px">${paragraphs}</div>`;
}

export async function fireEvent(
  client: SupabaseClient,
  eventId: string,
): Promise<void> {
  const { data: event, error: e1 } = await client
    .from("campaign_events")
    .select("id, case_id, template_id, channel, status")
    .eq("id", eventId)
    .single();
  if (e1) throw e1;
  if (!event || event.status !== "scheduled") return;

  const { data: caseRow, error: e2 } = await client
    .from("cases")
    .select(
      "id, org_id, amount_cents, currency, description, paylink_slug, status",
    )
    .eq("id", event.case_id)
    .single();
  if (e2) throw e2;
  if (!caseRow || caseRow.status !== "open") {
    await client
      .from("campaign_events")
      .update({ status: "cancelled", fired_at: new Date().toISOString() })
      .eq("id", eventId);
    return;
  }

  const { data: org, error: e3 } = await client
    .from("organizations")
    .select("id, display_name, locale, brand")
    .eq("id", caseRow.org_id)
    .single();
  if (e3) throw e3;

  const { data: debtor } = await client
    .from("debtors")
    .select("full_name, email, phone_e164, locale")
    .eq("case_id", caseRow.id)
    .limit(1)
    .maybeSingle();

  if (!debtor) {
    await markFailed(client, eventId, "no debtor for case");
    return;
  }

  const locale: Locale = (debtor.locale ?? org.locale) as Locale;

  const { data: tpl, error: e5 } = await client
    .from("message_templates")
    .select("id, locale, channel, subject, body")
    .eq("id", event.template_id)
    .eq("locale", locale)
    .single();
  if (e5) throw e5;
  if (!tpl) {
    await markFailed(client, eventId, `template ${event.template_id}/${locale} missing`);
    return;
  }

  const vars = buildVars(caseRow, org, debtor, locale);
  const subject = tpl.subject ? render(tpl.subject, vars) : "";
  const body = render(tpl.body, vars);

  let providerId: string | null = null;
  let status = "sent";
  try {
    if (event.channel === "email") {
      if (!debtor.email) throw new Error("no debtor email");
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ?? "Dragun <no-reply@dragun.app>";
      const r = await sendEmail({
        to: debtor.email,
        from: fromEmail,
        subject,
        html: bodyToHtml(body),
        text: body,
      });
      providerId = r.id;
    } else if (event.channel === "sms") {
      if (!debtor.phone_e164) throw new Error("no debtor phone");
      const fromNumber = process.env.TWILIO_FROM_NUMBER;
      if (!fromNumber) throw new Error("TWILIO_FROM_NUMBER not set");
      const r = await sendSms({
        to: debtor.phone_e164,
        from: fromNumber,
        body,
      });
      providerId = r.sid;
      status = r.status;
    } else if (event.channel === "call") {
      if (!debtor.phone_e164) throw new Error("no debtor phone");
      const fromNumber = process.env.TWILIO_FROM_NUMBER;
      if (!fromNumber) throw new Error("TWILIO_FROM_NUMBER not set");
      const language = locale === "fr" ? "fr-CA" : "en-CA";
      const twiml = `<Response><Say voice="alice" language="${language}">${escapeXml(body)}</Say></Response>`;
      const r = await placeCall({
        to: debtor.phone_e164,
        from: fromNumber,
        twiml,
      });
      providerId = r.sid;
      status = r.status;
    }
  } catch (err) {
    await markFailed(client, eventId, String(err));
    return;
  }

  await client
    .from("campaign_events")
    .update({
      status,
      fired_at: new Date().toISOString(),
      provider_id: providerId,
      payload: { subject, body },
    })
    .eq("id", eventId);
}

async function markFailed(
  client: SupabaseClient,
  eventId: string,
  reason: string,
): Promise<void> {
  await client
    .from("campaign_events")
    .update({
      status: "failed",
      fired_at: new Date().toISOString(),
      payload: { error: reason },
    })
    .eq("id", eventId);
}

export async function markOverdueCasesAsHandoff(
  client: SupabaseClient,
): Promise<number> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - 14);
  const { data, error } = await client
    .from("cases")
    .update({ status: "handoff" })
    .eq("status", "open")
    .lt("opened_at", cutoff.toISOString())
    .select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

export async function tickDueEvents(
  client: SupabaseClient,
  limit = 50,
): Promise<{ fired: number; failed: number }> {
  const { data: due, error } = await client
    .from("campaign_events")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .limit(limit);
  if (error) throw error;

  let fired = 0;
  let failed = 0;
  for (const row of due ?? []) {
    try {
      await fireEvent(client, row.id);
      fired++;
    } catch {
      failed++;
    }
  }
  return { fired, failed };
}
