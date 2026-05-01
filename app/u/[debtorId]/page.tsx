import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/app/_lib/supabase/service";
import { UnsubscribeForm } from "@/app/_components/unsubscribe-form";

export const metadata: Metadata = {
  title: "Dragun · Unsubscribe",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const COPY = {
  fr: {
    title: "Se désabonner",
    confirmHeading: "Confirmer la désinscription",
    confirmBody:
      "En continuant, plus aucun courriel, texto ou appel automatique ne vous sera envoyé pour cette facture. Vous pouvez toujours payer en utilisant le lien que vous avez reçu, ou contacter directement le commerçant.",
    confirmCTA: "Confirmer",
    doneHeading: "Désinscrit",
    doneBody:
      "Vous ne recevrez plus de rappels automatiques. La désinscription est immédiate.",
    alreadyHeading: "Déjà désinscrit",
    alreadyBody:
      "Cette désinscription est déjà active. Aucun rappel automatique ne sera envoyé.",
    errorBody: "Lien invalide ou expiré.",
    poweredBy: "Recouvrement assuré par Dragun",
  },
  en: {
    title: "Unsubscribe",
    confirmHeading: "Confirm unsubscribe",
    confirmBody:
      "If you continue, no further automatic email, SMS, or call reminders will be sent to you for this invoice. You can still pay using the link in any prior message, or contact the merchant directly.",
    confirmCTA: "Confirm",
    doneHeading: "Unsubscribed",
    doneBody:
      "No further automatic reminders will be sent. Unsubscription is immediate.",
    alreadyHeading: "Already unsubscribed",
    alreadyBody:
      "Unsubscription is already in effect. No automatic reminders will be sent.",
    errorBody: "Invalid or expired link.",
    poweredBy: "Recovery powered by Dragun",
  },
} as const;

function Mark({ className = "h-6 w-6" }: { className?: string }) {
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

type DebtorRow = {
  full_name: string;
  locale: "fr" | "en" | null;
  org_locale: "fr" | "en";
};

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ debtorId: string }>;
}) {
  const { debtorId } = await params;
  if (!UUID_RE.test(debtorId)) notFound();

  const client = createServiceClient();
  const { data, error } = await client
    .from("debtors")
    .select("full_name, locale, cases(organizations(locale))")
    .eq("id", debtorId)
    .limit(1)
    .maybeSingle();

  if (error || !data) notFound();

  type Casee = { organizations: { locale: "fr" | "en" } | { locale: "fr" | "en" }[] | null };
  const caseRaw = (data as { cases: Casee | Casee[] | null }).cases;
  const caseObj = Array.isArray(caseRaw) ? caseRaw[0] : caseRaw;
  const orgRaw = caseObj?.organizations;
  const orgLocale =
    (Array.isArray(orgRaw) ? orgRaw[0]?.locale : orgRaw?.locale) ?? "fr";
  const debtor = data as unknown as DebtorRow;

  const locale: "fr" | "en" =
    debtor.locale === "en" || debtor.locale === "fr"
      ? debtor.locale
      : orgLocale ?? "fr";
  const c = COPY[locale];

  return (
    <main className="min-h-screen bg-ink overflow-x-hidden flex items-start sm:items-center">
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-12 w-full">
        <div className="flex items-center gap-3 text-bone">
          <Mark className="h-6 w-6" />
          <span className="font-display text-xl tracking-tight">Dragun</span>
        </div>

        <h1 className="mt-12 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone break-words">
          {c.title}
        </h1>

        <div className="mt-10">
          <UnsubscribeForm debtorId={debtorId} copy={c} />
        </div>

        <p className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
          {c.poweredBy}
          &nbsp;·&nbsp;
          <Link href="/legal/privacy" className="hover:text-bone">
            {locale === "fr" ? "Confidentialité" : "Privacy"}
          </Link>
        </p>
      </div>
    </main>
  );
}
