import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { startCheckoutAction } from "@/app/_actions/checkout";
import { DragunMark } from "@/app/_components/logo";

export const metadata: Metadata = {
  title: "Dragun · Pay",
};

type PaylinkRow = {
  case_id: string;
  org_display_name: string;
  org_brand: { color?: string | null; signature?: string | null } | null;
  org_locale: "fr" | "en";
  amount_cents: number;
  currency: string;
  description: string | null;
  debtor_full_name: string | null;
  debtor_locale: "fr" | "en";
  status: "open" | "paid" | "closed" | "handoff";
};

const COPY = {
  fr: {
    payNow: "Payer maintenant",
    amountDue: "Montant à régler",
    secured: "Paiement sécurisé · Stripe",
    poweredBy: "Recouvrement assuré par Dragun",
    closed: "Cette facture est déjà réglée. Merci !",
    notFound: "Lien introuvable.",
    error: "Lien expiré ou invalide.",
  },
  en: {
    payNow: "Pay now",
    amountDue: "Amount due",
    secured: "Secured by Stripe",
    poweredBy: "Recovery powered by Dragun",
    closed: "This invoice is already settled. Thank you!",
    notFound: "Pay link not found.",
    error: "Pay link expired or invalid.",
  },
} as const;

function fmtMoney(cents: number, currency: string, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}


export default async function PaylinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ err?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_paylink_case", {
    p_slug: slug,
  });

  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    notFound();
  }
  const row = (Array.isArray(data) ? data[0] : data) as PaylinkRow;
  const locale: "fr" | "en" =
    row.debtor_locale === "en" || row.debtor_locale === "fr"
      ? row.debtor_locale
      : row.org_locale ?? "fr";
  const c = COPY[locale];

  const showError = sp.err
    ? sp.err === "closed"
      ? c.closed
      : sp.err === "notfound"
        ? c.notFound
        : c.error
    : null;

  const isClosed = row.status !== "open";
  const accentColor = row.org_brand?.color || null;

  return (
    <main className="min-h-screen bg-ink overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col px-4 sm:px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-bone">
            <DragunMark className="h-6 w-6" alt="" />
            <span className="font-display text-xl tracking-tight">
              {row.org_display_name}
            </span>
          </div>
        </header>

        <section className="mt-16 sm:mt-24">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
            {c.amountDue}
          </p>
          <div className="mt-4 font-display text-[clamp(3.4rem,12vw,7rem)] leading-none tracking-tight text-bone num">
            {fmtMoney(row.amount_cents, row.currency, locale)}
          </div>
          {row.description && (
            <p className="mt-4 text-bone-2 text-base sm:text-lg">
              {row.description}
            </p>
          )}
          {row.debtor_full_name && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {row.debtor_full_name}
            </p>
          )}
        </section>

        {showError && (
          <p className="mt-8 border border-ember/40 bg-ember/5 px-4 py-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-ember">
            {showError}
          </p>
        )}

        {!isClosed && (
          <form action={startCheckoutAction} className="mt-12">
            <input type="hidden" name="slug" value={slug} />
            <button
              type="submit"
              style={
                accentColor
                  ? { backgroundColor: accentColor, borderColor: accentColor }
                  : undefined
              }
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-ember px-6 py-4 sm:py-5 font-mono text-sm uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone"
            >
              {c.payNow} · {fmtMoney(row.amount_cents, row.currency, locale)}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>
        )}

        <footer className="mt-auto pt-16 flex flex-col gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
          <span>{c.secured}</span>
          <span>{c.poweredBy}</span>
        </footer>
      </div>
    </main>
  );
}
