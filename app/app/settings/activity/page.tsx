import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { signOut } from "@/app/_actions/auth";
import { getLocale, getStrings, type Locale } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { DragunLogo } from "@/app/_components/logo";

export const metadata: Metadata = {
  title: "Dragun · Activity",
};

const COPY = {
  fr: {
    title: "Journal d'activité",
    subtitle:
      "Toutes les actions administratives sur votre organisation, conservées douze mois.",
    backLabel: "← Paramètres",
    empty: "Aucune activité enregistrée pour l'instant.",
    columns: {
      action: "Action",
      target: "Cible",
      actor: "Auteur",
      when: "Quand",
    },
  },
  en: {
    title: "Activity log",
    subtitle:
      "Every administrative action on your organization, retained for twelve months.",
    backLabel: "← Settings",
    empty: "No activity recorded yet.",
    columns: {
      action: "Action",
      target: "Target",
      actor: "Actor",
      when: "When",
    },
  },
} as const;

type AuditRow = {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  actor_user_id: string | null;
  request_id: string | null;
  created_at: string;
};

function fmt(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const locale = await getLocale();
  const strings = await getStrings();
  const c = COPY[locale];

  const { data: rowsRaw } = await supabase
    .from("audit_events")
    .select("id, action, target_type, target_id, actor_user_id, request_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (rowsRaw ?? []) as AuditRow[];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line bg-ink-1/40">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <Link href="/app" className="text-bone">
            <DragunLogo className="h-5 w-5" wordmarkClassName="text-lg sm:text-xl" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleToggle />
            <Link
              href="/app/settings"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              {c.backLabel}
            </Link>
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

      <section className="mx-auto max-w-[1100px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone">
          {c.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          {c.subtitle}
        </p>

        {rows.length === 0 ? (
          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
            {c.empty}
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-line border-y border-line">
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1.5fr_1fr_1fr] items-baseline gap-3 px-1 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-bone-2"
              >
                <span className="text-bone">{r.action}</span>
                <span className="hidden sm:inline truncate text-bone-3">
                  {r.target_type}
                  {r.target_id ? ` · ${r.target_id.slice(0, 8)}` : ""}
                </span>
                <span className="hidden sm:inline truncate text-bone-3">
                  {r.actor_user_id ? r.actor_user_id.slice(0, 8) : "system"}
                </span>
                <span className="text-right text-bone-3">{fmt(r.created_at, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
