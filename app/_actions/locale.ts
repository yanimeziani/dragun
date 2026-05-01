"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLocale, LOCALE_COOKIE } from "../_lib/i18n";

export async function setLocaleAction(formData: FormData): Promise<void> {
  const v = formData.get("locale");
  if (!isLocale(v)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, v, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
