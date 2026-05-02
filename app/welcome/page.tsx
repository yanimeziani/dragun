import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { signOut } from "@/app/_actions/auth";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { OnboardingForm } from "@/app/_components/onboarding-form";
import { DragunLogo } from "@/app/_components/logo";

export const metadata: Metadata = {
  title: "Welcome · Dragun",
};

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  // If the user already belongs to an organization, skip onboarding.
  const { data: existing } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing) redirect("/app");

  const locale = await getLocale();
  const strings = await getStrings();
  const s = strings.onboarding;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="text-bone">
            <DragunLogo className="h-5 w-5" wordmarkClassName="text-lg sm:text-xl" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleToggle />
            <form action={signOut}>
              <button
                type="submit"
                className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
              >
                {strings.nav.signOut}
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[680px] px-4 sm:px-6 py-12 sm:py-20">
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-ember">
          {strings.dashboard.title}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3.6rem)] leading-[1.04] tracking-tight text-bone break-words">
          {s.title}
        </h1>
        <p className="mt-5 max-w-[52ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          {s.subtitle}
        </p>

        <div className="mt-12">
          <OnboardingForm strings={strings} defaultLocale={locale} />
        </div>

        <p className="mt-12 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
          {user.email}
        </p>
      </section>
    </main>
  );
}
