import Link from "next/link";
import { getLocale } from "./_lib/i18n";
import { DragunLogo } from "./_components/logo";

const COPY = {
  fr: {
    badge: "404",
    title: "Cette page n'existe pas.",
    sub: "Le lien que vous avez suivi est peut-être périmé ou mal copié.",
    homeCta: "← Retour à l'accueil",
    appCta: "Ouvrir le tableau de bord",
  },
  en: {
    badge: "404",
    title: "This page doesn't exist.",
    sub: "The link you followed might be stale or mistyped.",
    homeCta: "← Back to home",
    appCta: "Open dashboard",
  },
} as const;

export default async function NotFound() {
  const locale = await getLocale();
  const c = COPY[locale];
  return (
    <main className="min-h-screen bg-ink overflow-x-hidden flex items-center">
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-12 w-full">
        <Link href="/" className="text-bone">
          <DragunLogo className="h-6 w-6" wordmarkClassName="text-xl" />
        </Link>

        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.24em] text-ember">
          {c.badge}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[1.04] tracking-tight text-bone break-words">
          {c.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          {c.sub}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-ember px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink hover:bg-bone transition-colors"
          >
            {c.homeCta}
          </Link>
          <Link
            href="/app"
            className="group inline-flex items-center gap-3 border border-bone/50 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
          >
            {c.appCta}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
