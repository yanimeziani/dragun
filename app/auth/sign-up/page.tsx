import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { AuthShell } from "../_shell";

export const metadata: Metadata = {
  title: "Create account · Dragun",
};

export default function SignUpPage() {
  return (
    <AuthShell title="Create your account." subtitle="Free to start · 5 % on recovered">
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
