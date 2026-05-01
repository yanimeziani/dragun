"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../_lib/supabase/server";
import { isLocale, type Locale } from "../_lib/i18n";

export type CreateOrgState =
  | { status: "idle" }
  | { status: "error"; error: string };

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function randomSuffix(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function createOrganizationAction(
  _prev: CreateOrgState,
  formData: FormData,
): Promise<CreateOrgState> {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const localeRaw = formData.get("locale");
  const brandColor = String(formData.get("brandColor") ?? "").trim();
  const signature = String(formData.get("signature") ?? "").trim();

  if (!businessName) {
    return { status: "error", error: "Business name is required." };
  }
  if (!isLocale(localeRaw)) {
    return { status: "error", error: "Choose a default language." };
  }
  const locale: Locale = localeRaw;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", error: "Not authenticated." };
  }

  const baseSlug = slugify(businessName) || "org";
  const slug = `${baseSlug}-${randomSuffix()}`;

  const brand = {
    color: brandColor || null,
    signature: signature || null,
  };

  const { error } = await supabase.rpc("create_organization", {
    p_slug: slug,
    p_display_name: businessName,
    p_locale: locale,
    p_brand: brand,
  });

  if (error) {
    return { status: "error", error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/app");
}
