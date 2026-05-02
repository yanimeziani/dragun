import type { Metadata } from "next";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { securityDoc } from "../_content/security";
import { LegalShell } from "../_shell";

export const metadata: Metadata = {
  title: "Dragun — Security / Sécurité",
};

export default async function SecurityPage() {
  const locale = await getLocale();
  const strings = await getStrings();
  return <LegalShell doc={securityDoc[locale]} strings={strings} />;
}
