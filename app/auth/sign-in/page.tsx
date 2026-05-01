import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { AuthShell } from "../_shell";

export const metadata: Metadata = {
  title: "Sign in · Dragun",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ check?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const notice =
    sp.check === "email"
      ? "Check your inbox to confirm your email, then come back here to sign in."
      : sp.error === "auth"
      ? "Sign-in didn't complete. Try again."
      : undefined;

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in"
      notice={notice}
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}
