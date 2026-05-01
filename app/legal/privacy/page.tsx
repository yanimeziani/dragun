import type { Metadata } from "next";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { privacyDoc } from "../_content/privacy";
import { LegalShell } from "../_shell";

export const metadata: Metadata = {
  title: "Dragun — Privacy / Confidentialité",
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const strings = await getStrings();
  return <LegalShell doc={privacyDoc[locale]} strings={strings} />;
}
