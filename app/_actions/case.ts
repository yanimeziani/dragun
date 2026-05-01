"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { createClient } from "../_lib/supabase/server";
import { createServiceClient } from "../_lib/supabase/service";
import { scheduleCampaign, fireEvent } from "../_lib/cadence";
import { isLocale } from "../_lib/i18n";

export type CreateCaseState =
  | { status: "idle" }
  | { status: "error"; error: string };

const E164_RE = /^\+[1-9]\d{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function paylinkSlug(): string {
  return randomBytes(6).toString("base64url");
}

function autoRef(): string {
  const t = Date.now().toString(36).toUpperCase();
  return `DR-${t.slice(-6)}`;
}

export async function createCaseAction(
  _prev: CreateCaseState,
  formData: FormData,
): Promise<CreateCaseState> {
  const debtorName = String(formData.get("debtorName") ?? "").trim();
  const debtorEmail = String(formData.get("debtorEmail") ?? "").trim();
  const debtorPhone = String(formData.get("debtorPhone") ?? "").trim();
  const debtorLocaleRaw = formData.get("debtorLocale");
  const amountStr = String(formData.get("amount") ?? "").trim();
  const currency = String(formData.get("currency") ?? "CAD").trim();
  const description = String(formData.get("description") ?? "").trim();
  const refRaw = String(formData.get("ref") ?? "").trim();
  const sendNow = formData.get("sendNow") === "on";

  if (!debtorName) {
    return { status: "error", error: "Debtor name is required." };
  }
  if (debtorEmail && !EMAIL_RE.test(debtorEmail)) {
    return { status: "error", error: "Email looks off." };
  }
  if (debtorPhone && !E164_RE.test(debtorPhone)) {
    return {
      status: "error",
      error: "Phone must be in E.164 format (e.g. +14185551234).",
    };
  }
  const amount = Number(amountStr.replace(",", "."));
  if (!isFinite(amount) || amount <= 0) {
    return { status: "error", error: "Amount must be greater than zero." };
  }
  if (!["CAD", "USD", "EUR"].includes(currency)) {
    return { status: "error", error: "Unsupported currency." };
  }
  const debtorLocale = isLocale(debtorLocaleRaw) ? debtorLocaleRaw : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", error: "Not authenticated." };
  }

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) {
    return { status: "error", error: "Organization not found." };
  }

  const ref = refRaw || autoRef();
  const slug = paylinkSlug();

  const { data: caseRow, error: e1 } = await supabase
    .from("cases")
    .insert({
      org_id: membership.org_id,
      ref,
      amount_cents: Math.round(amount * 100),
      currency,
      description: description || null,
      paylink_slug: slug,
    })
    .select("id, opened_at")
    .single();
  if (e1 || !caseRow) {
    return { status: "error", error: e1?.message ?? "Could not create case." };
  }

  const { error: e2 } = await supabase.from("debtors").insert({
    case_id: caseRow.id,
    full_name: debtorName,
    email: debtorEmail || null,
    phone_e164: debtorPhone || null,
    locale: debtorLocale,
  });
  if (e2) {
    return { status: "error", error: e2.message };
  }

  try {
    await scheduleCampaign(supabase, caseRow.id, new Date(caseRow.opened_at));
  } catch (err) {
    return { status: "error", error: `Schedule failed: ${String(err)}` };
  }

  if (sendNow) {
    const { data: dayZero } = await supabase
      .from("campaign_events")
      .select("id")
      .eq("case_id", caseRow.id)
      .eq("template_id", "email-day-0")
      .limit(1)
      .maybeSingle();
    if (dayZero) {
      const service = createServiceClient();
      try {
        await fireEvent(service, dayZero.id);
      } catch (err) {
        // Non-fatal: case + cadence are committed; the cron will retry.
        console.error("[createCase] send-now failed:", err);
      }
    }
  }

  revalidatePath("/app");
  redirect("/app");
}
