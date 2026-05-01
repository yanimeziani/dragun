import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { AuthShell } from "../_shell";

export const metadata: Metadata = {
  title: "Claim a seat · Dragun",
};

export default function SignUpPage() {
  return (
    <AuthShell title="Claim a seat." subtitle="Public alpha · 50 seats">
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
