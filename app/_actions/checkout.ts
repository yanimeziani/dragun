"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "../_lib/supabase/server";
import { createCheckoutSession } from "../_lib/stripe";

async function siteOrigin(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "https://dragun.app";
}

export async function startCheckoutAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) redirect("/");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_paylink_case", {
    p_slug: slug,
  });
  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    redirect(`/p/${slug}?err=notfound`);
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (row.status !== "open") {
    redirect(`/p/${slug}?err=closed`);
  }

  const origin = await siteOrigin();
  const session = await createCheckoutSession({
    amountCents: row.amount_cents,
    currency: row.currency,
    description: row.description ?? row.org_display_name,
    caseId: row.case_id,
    paylinkSlug: slug,
    locale: row.debtor_locale === "en" ? "en" : "fr",
    origin,
  });

  redirect(session.url);
}
