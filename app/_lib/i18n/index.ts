import { cookies } from "next/headers";
import { fr } from "./fr";
import { en } from "./en";
import type { Locale, Strings } from "./types";

export const LOCALES: readonly Locale[] = ["fr", "en"] as const;
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "dragun_locale";

const MAPS: Record<Locale, Strings> = { fr, en };

export type { Locale, Strings };

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

export async function getStrings(): Promise<Strings> {
  const locale = await getLocale();
  return MAPS[locale];
}

export function getStringsFor(locale: Locale): Strings {
  return MAPS[locale];
}
