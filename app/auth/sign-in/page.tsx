import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { AuthShell } from "../_shell";
import { getStrings } from "@/app/_lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getStrings();
  return { title: s.auth.signInMetaTitle };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ check?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const s = await getStrings();
  const notice =
    sp.check === "email"
      ? s.auth.signInNoticeCheckEmail
      : sp.error === "auth"
      ? s.auth.signInNoticeAuthError
      : undefined;

  return (
    <AuthShell
      title={s.auth.signInPageTitle}
      subtitle={s.auth.signInSubtitle}
      notice={notice}
      strings={s.auth}
    >
      <AuthForm mode="sign-in" strings={s.auth} />
    </AuthShell>
  );
}
