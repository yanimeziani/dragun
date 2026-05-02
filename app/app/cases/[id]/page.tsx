import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { signOut } from "@/app/_actions/auth";
import { cancelCaseAction, markPaidAction } from "@/app/_actions/case";
import { getLocale, getStrings, type Locale } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { DragunLogo } from "@/app/_components/logo";

export const metadata: Metadata = {
  title: "Dragun · Case",
};

type CaseDetail = {
  id: string;
  ref: string;
  amount_cents: number;
  currency: string;
  description: string | null;
  paylink_slug: string;
  status: "open" | "paid" | "closed" | "handoff";
  opened_at: string;
  closed_at: string | null;
  org_id: string;
};

type Debtor = {
  full_name: string;
  email: string | null;
  phone_e164: string | null;
  locale: Locale | null;
  unsubscribed_at: string | null;
};

type Event = {
  id: string;
  template_id: string;
  channel: "email" | "sms" | "call";
  scheduled_at: string;
  fired_at: string | null;
  status: string;
  provider_id: string | null;
};

function fmtMoney(cents: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

function fmtDateTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

function statusPillCx(status: CaseDetail["status"]): string {
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
  status: CaseDetail["status"],
  s: { statusOpen: string; statusPaid: string; statusClosed: string; statusHandoff: string },
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

const channelLabel: Record<Event["channel"], { fr: string; en: string }> = {
  email: { fr: "COURRIEL", en: "EMAIL" },
  sms: { fr: "TEXTO", en: "SMS" },
  call: { fr: "APPEL", en: "VOICE" },
};

const eventStatusLabel: Record<string, { fr: string; en: string }> = {
  scheduled: { fr: "Prévu", en: "Scheduled" },
  sent: { fr: "Envoyé", en: "Sent" },
  delivered: { fr: "Livré", en: "Delivered" },
  opened: { fr: "Ouvert", en: "Opened" },
  failed: { fr: "Échec", en: "Failed" },
  cancelled: { fr: "Annulé", en: "Cancelled" },
};

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const locale = await getLocale();
  const strings = await getStrings();
  const s = strings.dashboard;

  const { data: caseRow } = await supabase
    .from("cases")
    .select(
      "id, ref, amount_cents, currency, description, paylink_slug, status, opened_at, closed_at, org_id",
    )
    .eq("id", id)
    .maybeSingle();

  if (!caseRow) notFound();
  const c = caseRow as CaseDetail;

  const { data: debtorRows } = await supabase
    .from("debtors")
    .select("full_name, email, phone_e164, locale, unsubscribed_at")
    .eq("case_id", c.id)
    .limit(1);
  const debtor = (debtorRows?.[0] as Debtor | undefined) ?? null;

  const { data: eventsRaw } = await supabase
    .from("campaign_events")
    .select("id, template_id, channel, scheduled_at, fired_at, status, provider_id")
    .eq("case_id", c.id)
    .order("scheduled_at", { ascending: true });
  const events = (eventsRaw ?? []) as Event[];

  const paylinkUrl = `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://dragun.app"}/p/${c.paylink_slug}`;

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
              href="/app"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              ← {strings.dashboard.title}
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

      <section className="mx-auto max-w-[1100px] px-4 sm:px-6 py-10 sm:py-14">
        {/* Case header */}
        <div className="border border-line bg-ink-1/30 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
                {c.ref}
                {c.description ? ` · ${c.description}` : ""}
              </div>
              <div className="mt-2 font-display text-3xl sm:text-4xl text-bone break-words">
                {debtor?.full_name ?? "—"}
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
                {debtor?.email ?? ""}
                {debtor?.email && debtor?.phone_e164 ? " · " : ""}
                {debtor?.phone_e164 ?? ""}
              </div>
              {debtor?.unsubscribed_at && (
                <div className="mt-3 inline-flex items-center gap-2 border border-ember/40 bg-ember/5 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ember">
                  <span>●</span>
                  {locale === "fr"
                    ? `Désabonné · ${fmtDateTime(debtor.unsubscribed_at, locale)}`
                    : `Unsubscribed · ${fmtDateTime(debtor.unsubscribed_at, locale)}`}
                </div>
              )}
            </div>
            <span
              className={`inline-flex border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] ${statusPillCx(c.status)}`}
            >
              {statusLabel(c.status, s)}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-line pt-6">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {strings.caseForm.amount}
              </div>
              <div className="num mt-1 font-display text-2xl text-bone">
                {fmtMoney(c.amount_cents, c.currency, locale)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {locale === "fr" ? "Ouvert" : "Opened"}
              </div>
              <div className="mt-1 font-mono text-bone">
                {fmtDateTime(c.opened_at, locale)}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-2 min-w-0">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {locale === "fr" ? "Lien de paiement" : "Pay link"}
              </div>
              <a
                href={paylinkUrl}
                target="_blank"
                className="mt-1 block font-mono text-bone text-sm hover:text-ember break-all"
              >
                {paylinkUrl}
              </a>
            </div>
          </div>

          {c.status === "open" && (
            <div className="mt-6 border-t border-line pt-6 flex flex-wrap gap-3">
              <form action={markPaidAction}>
                <input type="hidden" name="caseId" value={c.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-ember px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-bone transition-colors"
                >
                  {locale === "fr" ? "Marquer payé" : "Mark paid"}
                </button>
              </form>
              <form action={cancelCaseAction}>
                <input type="hidden" name="caseId" value={c.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3 hover:text-bone hover:border-bone transition-colors"
                >
                  {locale === "fr" ? "Annuler la campagne" : "Cancel campaign"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Timeline */}
        <h2 className="mt-12 font-display text-2xl text-bone">
          {locale === "fr" ? "Calendrier" : "Schedule"}
        </h2>
        <ol className="mt-5 border border-line bg-ink-1/20 divide-y divide-line">
          {events.length === 0 && (
            <li className="px-5 py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {locale === "fr"
                ? "Aucun événement planifié."
                : "No scheduled events."}
            </li>
          )}
          {events.map((e) => {
            const fired = !!e.fired_at;
            return (
              <li
                key={e.id}
                className="grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-4 items-center"
              >
                <span
                  className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${
                    e.channel === "email"
                      ? "text-bone"
                      : e.channel === "sms"
                        ? "text-bone-2"
                        : "text-ember"
                  }`}
                >
                  {channelLabel[e.channel][locale]}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone">
                    {e.template_id}
                  </div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
                    {fmtDateTime(e.scheduled_at, locale)}
                    {fired ? ` · ${fmtDateTime(e.fired_at!, locale)}` : ""}
                  </div>
                </div>
                <span
                  className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${
                    e.status === "sent" || e.status === "delivered"
                      ? "text-moss"
                      : e.status === "failed"
                        ? "text-ember"
                        : e.status === "cancelled"
                          ? "text-bone-3"
                          : "text-bone-2"
                  }`}
                >
                  {eventStatusLabel[e.status]?.[locale] ?? e.status}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
