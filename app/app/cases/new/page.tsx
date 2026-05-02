import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { getLocale, getStrings, type Locale } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { CaseForm } from "@/app/_components/case-form";

export const metadata: Metadata = {
  title: "Dragun · New case",
};

function Mark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      className={className}
      aria-hidden
    >
      <path d="M3.5 4.5 H20.5" />
      <path d="M12 4.5 V19.5" />
      <path d="M6 13 L12 19.5 L18 13" />
      <circle cx="12" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function NewCasePage() {
  // Layout enforces auth, but pages render in parallel with layouts in Next 16,
  // so we must re-check here to avoid null-deref before the layout's redirect lands.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: membership } = await supabase
    .from("org_members")
    .select("organizations(locale)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  type OrgRow = { locale: Locale };
  const orgRaw = membership?.organizations as OrgRow | OrgRow[] | null | undefined;
  const orgLocale: Locale =
    (Array.isArray(orgRaw) ? orgRaw[0]?.locale : orgRaw?.locale) ?? "fr";

  const locale = await getLocale();
  const strings = await getStrings();
  const s = strings.caseForm;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line bg-ink-1/40">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <Link href="/app" className="flex items-center gap-2 sm:gap-3 text-bone">
            <Mark className="h-5 w-5" />
            <span className="font-display text-lg sm:text-xl tracking-tight">
              Dragun
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LocaleToggle />
            <Link
              href="/app"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              ← {strings.dashboard.title}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[680px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone">
          {s.title}
        </h1>

        <div className="mt-12">
          <CaseForm strings={strings} defaultLocale={orgLocale ?? locale} />
        </div>
      </section>
    </main>
  );
}
