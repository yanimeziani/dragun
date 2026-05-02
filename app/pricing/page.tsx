import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "../_components/pricing-section";
import { LocaleToggle } from "../_components/locale-toggle";
import { DragunLogo } from "../_components/logo";
import { createClient } from "../_lib/supabase/server";
import { signOut } from "../_actions/auth";
import { getLocale } from "../_lib/i18n";

export const metadata: Metadata = {
  title: "Dragun · Pricing",
  description:
    "Simple, transparent pricing — start free, pay only on what we recover, scale to PRO when you need it.",
};

const COPY = {
  fr: {
    back: "← Retour",
    signIn: "Connexion",
    signOut: "Déconnexion",
    dashboard: "Tableau de bord",
    cancelled:
      "La commande a été annulée. Vous pouvez réessayer à tout moment.",
  },
  en: {
    back: "← Back",
    signIn: "Sign in",
    signOut: "Sign out",
    dashboard: "Dashboard",
    cancelled: "Checkout was cancelled. You can try again any time.",
  },
} as const;

type Search = { billing?: string };

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  const c = COPY[locale];
  const sp = await searchParams;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line bg-ink-1/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <Link href="/" className="text-bone">
            <DragunLogo className="h-5 w-5" wordmarkClassName="text-lg sm:text-xl" />
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleToggle />
            <Link
              href="/"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              {c.back}
            </Link>
            {user ? (
              <>
                <Link
                  href="/app"
                  className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-2 hover:text-bone"
                >
                  {c.dashboard}
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
                  >
                    {c.signOut}
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
              >
                {c.signIn}
              </Link>
            )}
          </div>
        </div>
      </header>

      {sp.billing === "cancelled" ? (
        <div className="mx-auto max-w-[1320px] px-6 pt-6">
          <p className="border border-ember/40 bg-ember/5 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
            {c.cancelled}
          </p>
        </div>
      ) : null}

      <PricingSection locale={locale} authed={Boolean(user)} />
    </main>
  );
}
