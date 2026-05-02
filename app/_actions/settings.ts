"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "../_lib/supabase/server";
import { createServiceClient } from "../_lib/supabase/service";
import { isLocale, type Locale } from "../_lib/i18n";
import { recordAudit } from "../_lib/audit";
import { withReqId } from "../_lib/log";

export type SettingsState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLOR_RE = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

export async function updateOrgAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const orgId = String(formData.get("orgId") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const localeRaw = formData.get("locale");
  const brandColor = String(formData.get("brandColor") ?? "").trim();
  const signature = String(formData.get("signature") ?? "").trim();
  const payoutEmail = String(formData.get("payoutEmail") ?? "").trim();

  if (!orgId) return { status: "error", error: "Organization not found." };
  if (!displayName)
    return { status: "error", error: "Business name is required." };
  if (!isLocale(localeRaw))
    return { status: "error", error: "Choose a default language." };
  if (brandColor && !COLOR_RE.test(brandColor))
    return {
      status: "error",
      error: "Brand color must be a hex like #FF6A1A.",
    };
  if (payoutEmail && !EMAIL_RE.test(payoutEmail))
    return { status: "error", error: "Payout email looks off." };

  const locale: Locale = localeRaw;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", error: "Not authenticated." };

  // Snapshot before for audit diff.
  const { data: before } = await supabase
    .from("organizations")
    .select("display_name, locale, brand, payout_email")
    .eq("id", orgId)
    .maybeSingle();

  const brand = {
    color: brandColor || null,
    signature: signature || null,
  };

  const { error } = await supabase.rpc("update_my_organization", {
    p_org_id: orgId,
    p_display_name: displayName,
    p_locale: locale,
    p_brand: brand,
    p_payout_email: payoutEmail,
  });

  if (error) return { status: "error", error: error.message };

  await recordAudit({
    orgId,
    action: "org.update",
    targetType: "organization",
    targetId: orgId,
    before,
    after: {
      display_name: displayName,
      locale,
      brand,
      payout_email: payoutEmail || null,
    },
  });

  revalidatePath("/", "layout");
  return { status: "saved" };
}

export async function deleteAccountAction(): Promise<void> {
  const supabase = await createClient();
  const h = await headers();
  const log = withReqId(h.get("x-request-id"));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  // Snapshot the user's orgs for audit before delete_my_data wipes them.
  const { data: orgs } = await supabase
    .from("org_members")
    .select("org_id, organizations(display_name)")
    .eq("user_id", user.id);

  for (const m of orgs ?? []) {
    const orgRaw = m.organizations as
      | { display_name: string }
      | { display_name: string }[]
      | null;
    const orgName = Array.isArray(orgRaw)
      ? orgRaw[0]?.display_name
      : orgRaw?.display_name;
    await recordAudit({
      orgId: m.org_id as string,
      action: "org.delete",
      targetType: "organization",
      targetId: m.org_id as string,
      before: { display_name: orgName },
    });
  }

  const { error: rpcErr } = await supabase.rpc("delete_my_data");
  if (rpcErr) {
    log.error({ kind: "auth.delete.rpc_failed", err: rpcErr.message }, "delete_my_data failed");
  }

  const service = createServiceClient();
  const { error: adminErr } = await service.auth.admin.deleteUser(user.id);
  if (adminErr) {
    log.error({ kind: "auth.delete.admin_failed", err: adminErr.message }, "auth admin delete failed");
  }

  log.info({ kind: "auth.delete.ok", user_id: user.id }, "account deleted");
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
