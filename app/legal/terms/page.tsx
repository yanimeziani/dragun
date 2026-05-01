import type { Metadata } from "next";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { termsDoc } from "../_content/terms";
import { LegalShell } from "../_shell";

export const metadata: Metadata = {
  title: "Dragun — Terms / Conditions",
};

export default async function TermsPage() {
  const locale = await getLocale();
  const strings = await getStrings();
  return <LegalShell doc={termsDoc[locale]} strings={strings} />;
}
