"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "../_lib/supabase/server";
import {
  createSubscriptionCheckoutSession,
  createBillingPortalSession,
} from "../_lib/stripe";
import { isPaidPlan, priceIdFor } from "../_lib/plans";
import { getLocale } from "../_lib/i18n";

async function siteOrigin(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "https://dragun.app";
}

export async function startBillingCheckoutAction(
  formData: FormData,
): Promise<void> {
  const planRaw = String(formData.get("plan") ?? "");
  if (!isPaidPlan(planRaw)) redirect("/pricing");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/auth/sign-in?next=${encodeURIComponent("/pricing")}`);
  }

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  // No org yet — onboarding first, then they can come back to /pricing.
  if (!membership) redirect("/welcome?next=/pricing");

  const orgId = membership.org_id as string;

  const { data: org } = await supabase
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", orgId)
    .maybeSingle();

  const origin = await siteOrigin();
  const locale = await getLocale();

  const session = await createSubscriptionCheckoutSession({
    priceId: priceIdFor(planRaw),
    orgId,
    plan: planRaw,
    origin,
    locale,
    customerEmail: user.email ?? undefined,
    existingCustomerId: org?.stripe_customer_id ?? undefined,
  });

  redirect(session.url);
}

export async function openBillingPortalAction(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect("/app/settings");

  const { data: org } = await supabase
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", membership.org_id)
    .maybeSingle();

  // Starter org with no Stripe customer yet — send to pricing to upgrade.
  if (!org?.stripe_customer_id) redirect("/pricing");

  const origin = await siteOrigin();
  const session = await createBillingPortalSession({
    customerId: org.stripe_customer_id,
    origin,
  });

  redirect(session.url);
}
