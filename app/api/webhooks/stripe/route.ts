import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/app/_lib/stripe";
import { createServiceClient } from "@/app/_lib/supabase/service";

export const runtime = "nodejs";

type StripeSession = {
  id: string;
  amount_total?: number | null;
  currency?: string | null;
  payment_intent?: string | null;
  metadata?: Record<string, string | null | undefined> | null;
};

type StripeEvent = {
  id: string;
  type: string;
  data: { object: StripeSession };
};

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not set" },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, sig, secret)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(raw) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "payment_intent.succeeded"
  ) {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object;
  const caseId = session.metadata?.case_id;
  if (!caseId) {
    return NextResponse.json({ ok: true, skipped: "no case_id" });
  }

  const amount = session.amount_total ?? 0;
  const currency = String(session.currency ?? "cad").toUpperCase();
  const piId = session.payment_intent ?? session.id;

  const client = createServiceClient();

  const { data: caseRow } = await client
    .from("cases")
    .select("id, status, organizations(fee_bps)")
    .eq("id", caseId)
    .maybeSingle();
  if (!caseRow) {
    return NextResponse.json({ ok: true, skipped: "case not found" });
  }
  if (caseRow.status !== "open") {
    return NextResponse.json({ ok: true, skipped: "case already closed" });
  }

  type OrgFee = { fee_bps: number };
  const orgRaw = caseRow.organizations as
    | OrgFee
    | OrgFee[]
    | null
    | undefined;
  const feeBps =
    (Array.isArray(orgRaw) ? orgRaw[0]?.fee_bps : orgRaw?.fee_bps) ?? 500;
  const feeCents = Math.round((amount * feeBps) / 10000);
  const netCents = amount - feeCents;

  await client.from("payments").insert({
    case_id: caseId,
    amount_cents: amount,
    currency,
    fee_cents: feeCents,
    net_to_org_cents: netCents,
    stripe_payment_intent_id: piId,
    status: "succeeded",
    paid_at: new Date().toISOString(),
  });

  await client
    .from("campaign_events")
    .update({ status: "cancelled" })
    .eq("case_id", caseId)
    .eq("status", "scheduled");

  await client
    .from("cases")
    .update({ status: "paid", closed_at: new Date().toISOString() })
    .eq("id", caseId);

  return NextResponse.json({ ok: true, case_id: caseId });
}
