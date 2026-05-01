"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../_lib/supabase/server";
import { createServiceClient } from "../_lib/supabase/service";
import { isLocale, type Locale } from "../_lib/i18n";

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
      error: "Brand color must be a hex like #E36A2C.",
    };
  if (payoutEmail && !EMAIL_RE.test(payoutEmail))
    return { status: "error", error: "Payout email looks off." };

  const locale: Locale = localeRaw;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", error: "Not authenticated." };

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

  revalidatePath("/", "layout");
  return { status: "saved" };
}

export async function deleteAccountAction(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { error: rpcErr } = await supabase.rpc("delete_my_data");
  if (rpcErr) {
    console.error("[deleteAccount] delete_my_data:", rpcErr);
  }

  const service = createServiceClient();
  const { error: adminErr } = await service.auth.admin.deleteUser(user.id);
  if (adminErr) {
    console.error("[deleteAccount] auth.admin.deleteUser:", adminErr);
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
