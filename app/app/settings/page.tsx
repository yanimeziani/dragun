import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { signOut } from "@/app/_actions/auth";
import { openBillingPortalAction } from "@/app/_actions/billing";
import { getLocale, getStrings, type Locale } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { SettingsForm } from "@/app/_components/settings-form";
import { DragunLogo } from "@/app/_components/logo";

export const metadata: Metadata = {
  title: "Dragun · Settings",
};

type Org = {
  id: string;
  display_name: string;
  locale: Locale;
  brand: { color?: string | null; signature?: string | null } | null;
  payout_email: string | null;
};

const COPY = {
  fr: {
    title: "Paramètres",
    subtitle:
      "Personnalisez ce que vos clients voient dans les courriels, textos et appels.",
    businessName: "Nom de l'entreprise",
    defaultLocale: "Langue par défaut des communications",
    brandColor: "Couleur de marque",
    brandColorHint:
      "Hex format (#FF6A1A). Utilisée pour les boutons de paiement et l'en-tête des courriels.",
    signature: "Signature des messages",
    signaturePlaceholder: "Mounir et l'équipe",
    payoutEmail: "Adresse pour les versements",
    payoutEmailHint:
      "Pour la première cohorte, le règlement se fait manuellement par Interac à cette adresse.",
    save: "Enregistrer",
    saved: "Enregistré.",
    dangerZone: "Zone sensible",
    dangerHint:
      "Supprimer le compte efface définitivement votre organisation, tous vos cas, débiteurs, événements et paiements. Conformément à la Loi 25 et au RGPD, l'effacement est immédiat. Cette action est irréversible.",
    deleteAccount: "Supprimer le compte",
    backLabel: "← Tableau de bord",
    billingTitle: "Facturation",
    billingPlanLabel: "Forfait actuel",
    billingStatusLabel: "Statut",
    billingRenewLabel: "Prochaine facturation",
    billingFeeLabel: "Commission sur le récupéré",
    billingActivationSuccess:
      "Forfait activé. Bienvenue dans la suite payante.",
    billingPlanNames: {
      starter: "Starter · Gratuit",
      sprint: "Sprint · 49 $/sem",
      pro_monthly: "PRO Mensuel · 149 $/mois",
      pro_annual: "PRO Annuel · 1 490 $/an",
      enterprise: "Entreprise · sur mesure",
    },
    billingStatusLabels: {
      active: "Actif",
      trialing: "Essai",
      past_due: "Paiement en retard",
      paused: "En pause",
      unpaid: "Impayé",
      canceled: "Annulé",
      inactive: "Inactif",
    },
    billingRenewSoon: "Annulé · ne renouvelle pas",
    billingNoSub: "—",
    billingUpgrade: "Voir les forfaits",
    billingPortal: "Gérer la facturation",
  },
  en: {
    title: "Settings",
    subtitle:
      "Customize what your customers see in emails, texts, and calls.",
    businessName: "Business name",
    defaultLocale: "Default language for customer communications",
    brandColor: "Brand color",
    brandColorHint:
      "Hex format (#FF6A1A). Used on pay buttons and email headers.",
    signature: "Message signature",
    signaturePlaceholder: "Sam and the team",
    payoutEmail: "Payout email",
    payoutEmailHint:
      "For our first cohort, settlement is handled manually by Interac to this address.",
    save: "Save",
    saved: "Saved.",
    dangerZone: "Danger zone",
    dangerHint:
      "Deleting your account permanently wipes your organization, every case, debtor, event, and payment. Per Law 25 and the GDPR, deletion is immediate. This cannot be undone.",
    deleteAccount: "Delete account",
    backLabel: "← Dashboard",
    billingTitle: "Billing",
    billingPlanLabel: "Current plan",
    billingStatusLabel: "Status",
    billingRenewLabel: "Next bill",
    billingFeeLabel: "Commission on recovered",
    billingActivationSuccess:
      "Plan activated. Welcome to the paid suite.",
    billingPlanNames: {
      starter: "Starter · Free",
      sprint: "Sprint · $49/wk",
      pro_monthly: "PRO Monthly · $149/mo",
      pro_annual: "PRO Annual · $1,490/yr",
      enterprise: "Enterprise · custom",
    },
    billingStatusLabels: {
      active: "Active",
      trialing: "Trialing",
      past_due: "Past due",
      paused: "Paused",
      unpaid: "Unpaid",
      canceled: "Canceled",
      inactive: "Inactive",
    },
    billingRenewSoon: "Canceled · won't renew",
    billingNoSub: "—",
    billingUpgrade: "See plans",
    billingPortal: "Manage billing",
  },
} as const;

type BillingStatus = {
  plan: "starter" | "sprint" | "pro_monthly" | "pro_annual" | "enterprise";
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "paused"
    | "unpaid"
    | "canceled"
    | "inactive";
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  fee_bps: number;
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Layout enforces auth, but pages render in parallel with layouts in Next 16,
  // so we must re-check here to avoid null-deref before the layout's redirect lands.
  if (!user) redirect("/auth/sign-in");

  const { data: orgRowsRaw } = await supabase
    .from("organizations")
    .select("id, display_name, locale, brand, payout_email")
    .limit(1);
  const org = (orgRowsRaw?.[0] as Org | undefined) ?? null;

  let billing: BillingStatus | null = null;
  if (org) {
    const { data: billingData } = await supabase.rpc("get_billing_status", {
      p_org_id: org.id,
    });
    const row = Array.isArray(billingData) ? billingData[0] : billingData;
    if (row) billing = row as BillingStatus;
  }

  const locale = await getLocale();
  const strings = await getStrings();
  const c = COPY[locale];
  const sp = await searchParams;
  const dateFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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

      <section className="mx-auto max-w-[680px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone">
          {c.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          {c.subtitle}
        </p>

        {sp.billing === "success" ? (
          <p className="mt-8 border border-moss/60 bg-moss/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-moss">
            {c.billingActivationSuccess}
          </p>
        ) : null}

        {billing ? (
          <div className="mt-12 border border-line bg-ink-1/40 p-6 sm:p-7">
            <h2 className="font-display text-2xl text-bone">
              {c.billingTitle}
            </h2>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                  {c.billingPlanLabel}
                </dt>
                <dd className="mt-1 font-display text-lg text-bone">
                  {c.billingPlanNames[billing.plan]}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                  {c.billingStatusLabel}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-2">
                  {c.billingStatusLabels[billing.status] ?? billing.status}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                  {c.billingRenewLabel}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-2">
                  {billing.cancel_at_period_end
                    ? c.billingRenewSoon
                    : billing.current_period_end
                      ? dateFmt.format(new Date(billing.current_period_end))
                      : c.billingNoSub}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                  {c.billingFeeLabel}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-2">
                  {(billing.fee_bps / 100).toFixed(0)} %
                </dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-bone/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
              >
                {c.billingUpgrade} <span>→</span>
              </Link>
              {billing.plan !== "starter" && billing.plan !== "enterprise" ? (
                <form action={openBillingPortalAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-ember px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-bone transition-colors"
                  >
                    {c.billingPortal} <span>→</span>
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ) : null}

        {org && (
          <div className="mt-12">
            <SettingsForm org={org} copy={c} />
          </div>
        )}

        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/app/settings/activity"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-2 hover:text-bone"
          >
            {locale === "fr" ? "Journal d'activité" : "Activity log"} <span>→</span>
          </Link>
        </div>

        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
          {user.email}
        </p>
      </section>
    </main>
  );
}
