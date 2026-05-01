import type { Metadata } from "next";
import { Demo } from "./_demo";
import { getClient } from "../_data/clients";

export const metadata: Metadata = {
  title: "Dragun — Live demo",
  description:
    "Walk through a 14-day Dragun reminder rhythm across email, SMS and voice — from both the owner and the customer's side, in real time.",
};

type SearchParams = Promise<{ client?: string | string[] }>;

export default async function DemoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const slugRaw = params.client;
  const slug = Array.isArray(slugRaw) ? slugRaw[0] : slugRaw;
  const fixture = getClient(slug);
  return <Demo fixture={fixture} />;
}
