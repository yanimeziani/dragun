// Dragun · billing plan registry.
// Single source of truth for plan IDs, fee_bps, and the env var that holds
// each plan's Stripe price ID. The pricing UI imports the metadata for
// display copy; the billing actions import priceIdFor().

export type PlanId =
  | "starter"
  | "sprint"
  | "pro_monthly"
  | "pro_annual"
  | "enterprise";

export type PaidPlanId = Extract<PlanId, "sprint" | "pro_monthly" | "pro_annual">;

export const PAID_PLANS: readonly PaidPlanId[] = [
  "sprint",
  "pro_monthly",
  "pro_annual",
] as const;

export function isPaidPlan(value: unknown): value is PaidPlanId {
  return (
    value === "sprint" || value === "pro_monthly" || value === "pro_annual"
  );
}

export const PLAN_FEE_BPS: Record<PlanId, number> = {
  starter: 500,
  sprint: 0,
  pro_monthly: 0,
  pro_annual: 0,
  enterprise: 0,
};

const PRICE_ENV: Record<PaidPlanId, string> = {
  sprint: "STRIPE_PRICE_SPRINT_WEEKLY",
  pro_monthly: "STRIPE_PRICE_PRO_MONTHLY",
  pro_annual: "STRIPE_PRICE_PRO_ANNUAL",
};

export function priceIdFor(plan: PaidPlanId): string {
  const envName = PRICE_ENV[plan];
  const v = process.env[envName];
  if (!v) {
    throw new Error(`${envName} is not set — cannot start ${plan} checkout`);
  }
  return v;
}

export function planFromPriceId(priceId: string): PaidPlanId | null {
  for (const plan of PAID_PLANS) {
    if (process.env[PRICE_ENV[plan]] === priceId) return plan;
  }
  return null;
}
