import type { Metadata } from "next";
import { Demo } from "./_demo";

export const metadata: Metadata = {
  title: "Dragun — Live demo",
  description:
    "Walk through a 14-day Dragun campaign across email, SMS and voice — from both the operator and the debtor's side, in real time.",
};

export default function DemoPage() {
  return <Demo />;
}
