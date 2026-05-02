import Link from "next/link";
import { LocaleToggle } from "../_components/locale-toggle";
import { DragunLogo } from "../_components/logo";
import type { Strings } from "../_lib/i18n";

export function AuthShell({
  title,
  subtitle,
  notice,
  strings,
  children,
}: {
  title: string;
  subtitle: string;
  notice?: string;
  strings: Strings["auth"];
  children: React.ReactNode;
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
              {strings.shellBackToSite}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1100px] gap-12 px-4 sm:px-6 py-12 sm:py-20 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
            {subtitle}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone break-words">
            {title}
          </h1>
          <p className="mt-5 max-w-[40ch] text-bone-2 text-sm sm:text-base">
            {strings.shellBlurb}
          </p>
          <ul className="mt-8 space-y-3 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-2">
            <li className="flex gap-3">
              <span className="text-ember shrink-0">▲</span>
              {strings.shellBullet1}
            </li>
            <li className="flex gap-3">
              <span className="text-ember shrink-0">▲</span>
              {strings.shellBullet2}
            </li>
            <li className="flex gap-3">
              <span className="text-ember shrink-0">▲</span>
              {strings.shellBullet3}
            </li>
          </ul>
        </section>

        <section className="lg:col-span-7">
          <div className="border border-line bg-ink-1/40 p-6 sm:p-8">
            {notice && (
              <p className="mb-5 border border-ember/40 bg-ember/5 px-4 py-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-ember">
                {notice}
              </p>
            )}
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
