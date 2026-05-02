import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { AuthShell } from "../_shell";
import { getStrings } from "@/app/_lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getStrings();
  return { title: s.auth.signUpMetaTitle };
}

export default async function SignUpPage() {
  const s = await getStrings();
  return (
    <AuthShell
      title={s.auth.signUpPageTitle}
      subtitle={s.auth.signUpSubtitle}
      strings={s.auth}
    >
      <AuthForm mode="sign-up" strings={s.auth} />
    </AuthShell>
  );
}
