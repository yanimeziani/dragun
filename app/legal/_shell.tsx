import Link from "next/link";
import { LocaleToggle } from "../_components/locale-toggle";
import { DragunLogo } from "../_components/logo";
import type { LegalDoc } from "./_content/types";
import type { Strings } from "../_lib/i18n";

export function LegalShell({
  doc,
  strings,
}: {
  doc: LegalDoc;
  strings: Strings;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="text-bone">
            <DragunLogo className="h-5 w-5" wordmarkClassName="text-lg sm:text-xl" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleToggle />
            <Link
              href="/"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              ← {strings.nav.home}
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-[760px] px-4 sm:px-6 py-12 sm:py-16">
        <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.24em] text-bone-3">
          {doc.effectiveDate}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone break-words">
          {doc.title}
        </h1>
        <p className="mt-6 text-bone-2 text-base leading-relaxed">
          {doc.preamble}
        </p>

        <div className="mt-12 space-y-12">
          {doc.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl text-bone tracking-tight">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-3 text-bone-2 leading-relaxed">
                {section.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-line pt-6 flex flex-wrap items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
          <Link href="/legal/privacy" className="hover:text-bone">
            {strings.legal.privacy}
          </Link>
          <Link href="/legal/terms" className="hover:text-bone">
            {strings.legal.terms}
          </Link>
          <Link href="/legal/disclosures" className="hover:text-bone">
            {strings.legal.disclosures}
          </Link>
          <Link href="/legal/security" className="hover:text-bone">
            {strings.legal.security}
          </Link>
          <Link href="/" className="ml-auto hover:text-bone">
            ← {strings.nav.home}
          </Link>
        </footer>
      </article>
    </main>
  );
}
