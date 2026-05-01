import type { Metadata } from "next";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { disclosuresDoc } from "../_content/disclosures";
import { LegalShell } from "../_shell";

export const metadata: Metadata = {
  title: "Dragun — Disclosures / Divulgations",
};

export default async function DisclosuresPage() {
  const locale = await getLocale();
  const strings = await getStrings();
  return <LegalShell doc={disclosuresDoc[locale]} strings={strings} />;
}
