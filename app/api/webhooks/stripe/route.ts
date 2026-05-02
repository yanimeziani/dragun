import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/app/_lib/stripe";
import { createServiceClient } from "@/app/_lib/supabase/service";
import { isPaidPlan, PLAN_FEE_BPS, type PaidPlanId } from "@/app/_lib/plans";
import { withReqId, type Logger } from "@/app/_lib/log";
import { recordAudit } from "@/app/_lib/audit";

export const runtime = "nodejs";

type StripeMetadata = Record<string, string | null | undefined> | null;

type StripeCheckoutSession = {
  id: string;
  mode?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_intent?: string | null;
  customer?: string | null;
  subscription?: string | null;
  client_reference_id?: string | null;
  metadata?: StripeMetadata;
};

type StripeSubscription = {
  id: string;
  customer?: string | null;
  status?: string | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  items?: { data?: { price?: { id?: string | null } | null }[] } | null;
  metadata?: StripeMetadata;
};

type StripeEvent =
  | { id: string; type: "checkout.session.completed" | "payment_intent.succeeded"; data: { object: StripeCheckoutSession } }
  | { id: string; type: "customer.subscription.created" | "customer.subscription.updated" | "customer.subscription.deleted"; data: { object: StripeSubscription } }
  | { id: string; type: string; data: { object: unknown } };

const HANDLED_TYPES = new Set([
  "checkout.session.completed",
  "payment_intent.succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const SUBSCRIPTION_PLAN_TO_FEE_BPS = PLAN_FEE_BPS;

function tsToIso(seconds: number | null | undefined): string | null {
  if (!seconds || !Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  const log = withReqId(req.headers.get("x-request-id"));

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    log.error({ kind: "stripe.webhook.misconfig" }, "STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not set" },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, sig, secret)) {
    log.warn({ kind: "stripe.webhook.bad_signature" }, "stripe webhook bad signature");
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(raw) as StripeEvent;
  } catch {
    log.warn({ kind: "stripe.webhook.bad_json" }, "stripe webhook bad json");
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (!HANDLED_TYPES.has(event.type)) {
    log.debug(
      { kind: "stripe.webhook.ignored", event_type: event.type, event_id: event.id },
      "stripe event ignored",
    );
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const client = createServiceClient();

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    return handleSubscriptionEvent(
      client,
      log,
      event.type,
      event.data.object as StripeSubscription,
    );
  }

  const session = event.data.object as StripeCheckoutSession;

  // Subscription-mode checkout: stash the customer id on the org so we can
  // open the billing portal later. The subscription row itself is upserted
  // by the customer.subscription.created event that follows.
  if (
    event.type === "checkout.session.completed" &&
    (session.mode === "subscription" || session.metadata?.org_id)
  ) {
    const orgId =
      session.client_reference_id ?? session.metadata?.org_id ?? null;
    if (orgId && session.customer) {
      await client
        .from("organizations")
        .update({ stripe_customer_id: session.customer })
        .eq("id", orgId);
    }
    log.info(
      { kind: "stripe.subscription.checkout.completed", org_id: orgId },
      "subscription checkout completed",
    );
    return NextResponse.json({ ok: true, org_id: orgId, mode: "subscription" });
  }

  // Paylink case payment (existing behaviour).
  return handleCasePayment(client, log, session);
}

async function handleCasePayment(
  client: ReturnType<typeof createServiceClient>,
  log: Logger,
  session: StripeCheckoutSession,
) {
  const caseId = session.metadata?.case_id;
  if (!caseId) {
    log.debug({ kind: "stripe.payment.skipped", reason: "no case_id" });
    return NextResponse.json({ ok: true, skipped: "no case_id" });
  }

  const amount = session.amount_total ?? 0;
  const currency = String(session.currency ?? "cad").toUpperCase();
  const piId = session.payment_intent ?? session.id;

  const { data: caseRow } = await client
    .from("cases")
    .select("id, status, org_id, organizations(fee_bps)")
    .eq("id", caseId)
    .maybeSingle();
  if (!caseRow) {
    log.warn({ kind: "stripe.payment.skipped", reason: "case_not_found", case_id: caseId });
    return NextResponse.json({ ok: true, skipped: "case not found" });
  }
  if (caseRow.status !== "open") {
    log.info({ kind: "stripe.payment.skipped", reason: "case_closed", case_id: caseId });
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

  // Idempotent insert: payments.stripe_payment_intent_id has a unique index.
  // On retry (Stripe may resend the same event up to ~3 days), we catch the
  // unique-violation and respond 200 so Stripe stops retrying.
  const { error: insertErr } = await client.from("payments").insert({
    case_id: caseId,
    amount_cents: amount,
    currency,
    fee_cents: feeCents,
    net_to_org_cents: netCents,
    stripe_payment_intent_id: piId,
    status: "succeeded",
    paid_at: new Date().toISOString(),
  });
  if (insertErr) {
    if (insertErr.code === "23505") {
      log.info(
        { kind: "stripe.payment.deduped", case_id: caseId, payment_intent_id: piId },
        "duplicate stripe webhook delivery — already recorded",
      );
      return NextResponse.json({ ok: true, deduped: true });
    }
    log.error(
      { kind: "stripe.payment.insert_failed", case_id: caseId, err: insertErr.message },
      "payment insert failed",
    );
    throw insertErr;
  }

  await client
    .from("campaign_events")
    .update({ status: "cancelled" })
    .eq("case_id", caseId)
    .eq("status", "scheduled");

  await client
    .from("cases")
    .update({ status: "paid", closed_at: new Date().toISOString() })
    .eq("id", caseId);

  await recordAudit({
    client,
    orgId: caseRow.org_id as string,
    action: "payment.received",
    targetType: "payment",
    targetId: null,
    after: {
      case_id: caseId,
      amount_cents: amount,
      currency,
      fee_cents: feeCents,
      net_to_org_cents: netCents,
      stripe_payment_intent_id: piId,
    },
  });

  log.info(
    {
      kind: "stripe.payment.succeeded",
      case_id: caseId,
      payment_intent_id: piId,
      amount_cents: amount,
      currency,
    },
    "payment recorded",
  );
  return NextResponse.json({ ok: true, case_id: caseId });
}

async function handleSubscriptionEvent(
  client: ReturnType<typeof createServiceClient>,
  log: Logger,
  type:
    | "customer.subscription.created"
    | "customer.subscription.updated"
    | "customer.subscription.deleted",
  sub: StripeSubscription,
) {
  const planRaw = sub.metadata?.plan;
  const orgIdFromMeta = sub.metadata?.org_id;

  // Resolve org: prefer subscription metadata, fall back to customer lookup.
  let orgId: string | null = orgIdFromMeta ?? null;
  if (!orgId && sub.customer) {
    const { data: orgByCustomer } = await client
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", sub.customer)
      .maybeSingle();
    orgId = orgByCustomer?.id ?? null;
  }
  if (!orgId) {
    log.warn(
      { kind: "stripe.subscription.skipped", reason: "no_org", subscription_id: sub.id },
      "subscription event without resolvable org",
    );
    return NextResponse.json({ ok: true, skipped: "no org for subscription" });
  }

  if (!isPaidPlan(planRaw)) {
    log.warn(
      { kind: "stripe.subscription.skipped", reason: "no_plan_metadata", org_id: orgId, subscription_id: sub.id },
      "subscription event missing plan metadata",
    );
    return NextResponse.json({ ok: true, skipped: "no plan in metadata" });
  }
  const plan: PaidPlanId = planRaw;

  const status = sub.status ?? "incomplete";
  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const periodStart = tsToIso(sub.current_period_start ?? null);
  const periodEnd = tsToIso(sub.current_period_end ?? null);
  const cancelAtPeriodEnd = Boolean(sub.cancel_at_period_end);
  const canceledAt =
    type === "customer.subscription.deleted"
      ? new Date().toISOString()
      : tsToIso(sub.canceled_at ?? null);

  const finalStatus = type === "customer.subscription.deleted" ? "canceled" : status;

  await client
    .from("subscriptions")
    .upsert(
      {
        org_id: orgId,
        plan,
        status: finalStatus,
        stripe_subscription_id: sub.id,
        stripe_price_id: priceId,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
        canceled_at: canceledAt,
      },
      { onConflict: "stripe_subscription_id" },
    );

  // Pin org plan + commission to the live subscription. If the sub is gone
  // or in a non-billable state, drop back to starter.
  const liveStatuses = new Set([
    "trialing",
    "active",
    "past_due",
    "paused",
    "unpaid",
  ]);

  if (liveStatuses.has(finalStatus)) {
    await client
      .from("organizations")
      .update({
        plan,
        fee_bps: SUBSCRIPTION_PLAN_TO_FEE_BPS[plan],
        stripe_customer_id: sub.customer ?? null,
      })
      .eq("id", orgId);
  } else if (type === "customer.subscription.deleted") {
    // Only revert if this was the org's current plan (don't clobber an
    // upgrade-in-progress).
    const { data: orgRow } = await client
      .from("organizations")
      .select("plan")
      .eq("id", orgId)
      .maybeSingle();
    if (orgRow?.plan === plan) {
      await client
        .from("organizations")
        .update({ plan: "starter", fee_bps: PLAN_FEE_BPS.starter })
        .eq("id", orgId);
    }
  }

  const auditAction =
    type === "customer.subscription.created"
      ? "subscription.created"
      : type === "customer.subscription.updated"
        ? "subscription.updated"
        : "subscription.deleted";

  await recordAudit({
    client,
    orgId,
    action: auditAction,
    targetType: "subscription",
    targetId: null,
    after: {
      stripe_subscription_id: sub.id,
      plan,
      status: finalStatus,
      current_period_end: periodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
    },
  });

  log.info(
    {
      kind: "stripe.subscription." + type.replace("customer.subscription.", ""),
      org_id: orgId,
      plan,
      status: finalStatus,
      subscription_id: sub.id,
    },
    "subscription event processed",
  );
  return NextResponse.json({ ok: true, org_id: orgId, plan, status: finalStatus });
}
