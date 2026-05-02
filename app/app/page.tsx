import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../_lib/supabase/server";
import { signOut } from "../_actions/auth";
import { getLocale, getStrings, type Locale, type Strings } from "../_lib/i18n";
import { LocaleToggle } from "../_components/locale-toggle";
import { DragunLogo } from "../_components/logo";

export const metadata: Metadata = {
  title: "Dragun · Dashboard",
};

type Org = {
  id: string;
  display_name: string;
  locale: Locale;
};

type CaseRow = {
  id: string;
  ref: string;
  amount_cents: number;
  currency: string;
  status: "open" | "paid" | "closed" | "handoff";
  opened_at: string;
  description: string | null;
  debtors: { full_name: string }[] | null;
};

type PaymentRow = {
  net_to_org_cents: number;
  currency: string;
  status: string;
};

function fmtMoney(cents: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

function daysSince(iso: string): number {
  const now = Date.now();
  const t = new Date(iso).getTime();
  return Math.max(0, Math.floor((now - t) / (1000 * 60 * 60 * 24)));
}

function statusPillCx(status: CaseRow["status"]): string {
  switch (status) {
    case "open":
      return "border-ember/60 text-ember";
    case "paid":
      return "bg-ember text-ink border-ember";
    case "closed":
      return "bg-moss text-bone border-moss";
    case "handoff":
      return "border-bone text-bone";
  }
}

function statusLabel(
  status: CaseRow["status"],
  s: Strings["dashboard"],
): string {
  switch (status) {
    case "open":
      return s.statusOpen;
    case "paid":
      return s.statusPaid;
    case "closed":
      return s.statusClosed;
    case "handoff":
      return s.statusHandoff;
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const strings = await getStrings();
  const s = strings.dashboard;

  // Layout enforces auth, but pages render in parallel with layouts in Next 16,
  // so we must re-check here to avoid null-deref before the layout's redirect lands.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, organizations(id, display_name, locale)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const orgRaw = membership?.organizations as Org | Org[] | null | undefined;
  const org: Org | null = Array.isArray(orgRaw)
    ? (orgRaw[0] ?? null)
    : (orgRaw ?? null);

  const { data: cases } = await supabase
    .from("cases")
    .select(
      "id, ref, amount_cents, currency, status, opened_at, description, debtors(full_name)",
    )
    .order("opened_at", { ascending: false });

  const { data: payments } = await supabase
    .from("payments")
    .select("net_to_org_cents, currency, status")
    .eq("status", "succeeded");

  const caseRows = (cases ?? []) as CaseRow[];
  const paymentRows = (payments ?? []) as PaymentRow[];

  const openCount = caseRows.filter((c) => c.status === "open").length;
  const overdueCount = caseRows.filter(
    (c) => c.status === "open" && daysSince(c.opened_at) > 14,
  ).length;
  const defaultCurrency = org?.locale === "fr" ? "CAD" : "CAD";
  const recoveredCents = paymentRows.reduce(
    (acc, p) => acc + p.net_to_org_cents,
    0,
  );

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line bg-ink-1/40">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <Link href="/" className="text-bone">
            <DragunLogo
              className="h-5 w-5"
              wordmarkClassName="text-lg sm:text-xl"
              tagline={org ? `· ${org.display_name}` : undefined}
              taglineClassName="hidden sm:inline ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3"
            />
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleToggle />
            <Link
              href="/app/settings"
              className="hidden sm:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              {locale === "fr" ? "Paramètres" : "Settings"}
            </Link>
            <Link
              href="/app/cases/import"
              className="hidden sm:inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-2 hover:border-bone hover:text-bone transition-colors"
            >
              {locale === "fr" ? "Importer" : "Import"}
            </Link>
            <Link
              href="/app/cases/new"
              className="hidden sm:inline-flex items-center gap-2 border border-bone/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone hover:border-ember hover:text-ember transition-colors"
            >
              {s.addCase}
              <span>→</span>
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

      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone">
            {s.title}
          </h1>
          <Link
            href="/app/cases/new"
            className="sm:hidden inline-flex items-center gap-2 border border-bone/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone hover:border-ember hover:text-ember transition-colors"
          >
            {s.addCase} →
          </Link>
        </div>

        {/* KPI strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 border border-line">
          <div className="px-5 py-5 border-r border-line">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {s.kpiOpen}
            </div>
            <div className="num mt-2 font-display text-3xl text-bone">
              {openCount}
            </div>
          </div>
          <div className="px-5 py-5 sm:border-r border-line">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {s.kpiRecovered}
            </div>
            <div className="num mt-2 font-display text-3xl text-bone">
              {fmtMoney(recoveredCents, defaultCurrency, locale)}
            </div>
          </div>
          <div className="px-5 py-5 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-line">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {s.kpiOverdue}
            </div>
            <div className="num mt-2 font-display text-3xl text-ember">
              {overdueCount}
            </div>
          </div>
        </div>

        {/* Case list */}
        {caseRows.length === 0 ? (
          <div className="mt-12 border border-line bg-ink-1/20 px-6 sm:px-10 py-12 sm:py-16">
            <p className="font-display text-2xl sm:text-3xl text-bone">
              {s.emptyTitle}
            </p>
            <p className="mt-3 max-w-[52ch] text-bone-2 leading-[1.55]">
              {s.emptySubtitle}
            </p>
            <ol className="mt-8 space-y-3 max-w-[60ch] font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-2 list-none">
              <li className="flex gap-4">
                <span className="text-ember shrink-0">01</span>
                <span>
                  {locale === "fr"
                    ? "Ajoutez un membre, ou téléversez votre liste en CSV."
                    : "Add a customer, or upload your list as a CSV."}
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-ember shrink-0">02</span>
                <span>
                  {locale === "fr"
                    ? "Dragun envoie courriels, textos et un appel sur 14 jours, dans votre voix."
                    : "Dragun sends emails, SMS and a voice call across 14 days, in your voice."}
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-ember shrink-0">03</span>
                <span>
                  {locale === "fr"
                    ? "Le débiteur tape sur le lien et paie. Vous recevez 95 % automatiquement."
                    : "Your customer taps the link and pays. You keep 95 % automatically."}
                </span>
              </li>
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/app/cases/new"
                className="inline-flex items-center gap-3 bg-ember px-5 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-ink hover:bg-bone transition-colors"
              >
                {s.addCase}
                <span>→</span>
              </Link>
              <Link
                href="/app/cases/import"
                className="inline-flex items-center gap-3 border border-line px-5 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-bone-2 hover:border-bone hover:text-bone transition-colors"
              >
                {locale === "fr" ? "Importer un CSV" : "Import a CSV"}
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-line border-y border-line">
            {caseRows.map((c) => {
              const debtor = c.debtors?.[0]?.full_name ?? "—";
              const days = daysSince(c.opened_at);
              return (
                <li key={c.id}>
                  <Link
                    href={`/app/cases/${c.id}`}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1.5fr_1fr_auto] items-center gap-4 px-1 py-5 hover:bg-ink-1/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-display text-lg sm:text-xl text-bone truncate">
                        {debtor}
                      </div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
                        {c.ref}
                        {c.description ? ` · ${c.description}` : ""}
                      </div>
                    </div>
                    <div className="hidden sm:block num font-display text-xl text-bone">
                      {fmtMoney(c.amount_cents, c.currency, locale)}
                    </div>
                    <div className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
                      {days}{locale === "fr" ? " j" : "d"}
                    </div>
                    <span
                      className={`inline-flex border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] ${statusPillCx(c.status)}`}
                    >
                      {statusLabel(c.status, s)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
          {user.email}
        </p>
      </section>
    </main>
  );
}
