import Link from "next/link";
import { startBillingCheckoutAction } from "../_actions/billing";
import type { Locale } from "../_lib/i18n";

type TierFlavor = "starter" | "sprint" | "pro_monthly" | "pro_annual";

type Tier = {
  id: TierFlavor;
  badge: string;
  badgeVariant: "starter" | "sprint" | "pro" | "annual";
  name: string;
  price: string;
  unit: string;
  note: string;
  features: string[];
  cta: string;
  ctaPrimary?: boolean;
  featured?: boolean;
  savings?: string;
};

type Copy = {
  eyebrow: string;
  headline: string;
  sub: string;
  authedNote: string;
  starter: Omit<Tier, "id" | "badgeVariant"> & { hrefUnauth: string; hrefAuth: string };
  sprint: Omit<Tier, "id" | "badgeVariant">;
  pro_monthly: Omit<Tier, "id" | "badgeVariant">;
  pro_annual: Omit<Tier, "id" | "badgeVariant">;
  enterprise: {
    label: string;
    title: string;
    desc: string;
    pills: string[];
    cta: string;
    href: string;
  };
};

const COPY: Record<Locale, Copy> = {
  fr: {
    eyebrow: "Tarifs · VI.",
    headline: "Simple. Transparent. Conçu pour la récupération.",
    sub: "Commencez gratuitement et payez seulement sur ce qu'on récupère. Passez au PRO quand votre encaisse ne peut plus attendre.",
    authedNote:
      "Connecté · le bouton de chaque forfait ouvre directement la caisse Stripe.",
    starter: {
      badge: "Gratuit · pour toujours",
      name: "Starter",
      price: "5 %",
      unit: "sur le récupéré seulement",
      note: "Aucun frais fixe — jamais.",
      features: [
        "Campagne 30 jours · courriel, texto et voix",
        "Factures illimitées",
        "Bilingue FR · EN",
        "Votre registre vous appartient, toujours",
      ],
      cta: "Commencer gratuitement",
      hrefUnauth: "/auth/sign-up",
      hrefAuth: "/app",
    },
    sprint: {
      badge: "Récupération court terme",
      name: "Sprint",
      price: "49 $",
      unit: "/ semaine",
      note: "4 semaines par défaut · annulez à toute semaine.",
      features: [
        "Tout dans Starter",
        "Priorité sur l'agent vocal",
        "Tableau de bord en direct",
        "0 % de commission sur le récupéré",
        "Annulez après n'importe quelle semaine",
      ],
      cta: "Démarrer Sprint",
    },
    pro_monthly: {
      badge: "PRO · Le plus populaire",
      name: "PRO Mensuel",
      price: "149 $",
      unit: "/ mois",
      note: "Annulez à tout moment.",
      features: [
        "Tout dans Sprint",
        "Campagnes actives illimitées",
        "Cadence avancée",
        "Accès au journal d'audit SOC 2",
        "Soutien prioritaire",
        "0 % de commission sur le récupéré",
      ],
      cta: "Passer au PRO",
      ctaPrimary: true,
      featured: true,
    },
    pro_annual: {
      badge: "PRO · Annuel",
      name: "PRO Annuel",
      price: "124 $",
      unit: "/ mois",
      note: "1 490 $ facturés annuellement.",
      savings: "Épargne de 17 %",
      features: [
        "Tout dans PRO Mensuel",
        "Appel d'intégration dédié",
        "Accès anticipé aux nouveaux canaux",
        "Facture annuelle pour la comptabilité",
      ],
      cta: "Meilleur rapport",
    },
    enterprise: {
      label: "Entreprise",
      title: "Sur mesure — selon votre volume",
      desc: "Pour les équipes qui traitent plus de 500 factures par mois, les configurations multi-entités, ou les firmes qui ont besoin de campagnes en marque blanche, de garanties SLA et d'un stratège de récupération dédié.",
      pills: [
        "Marque blanche",
        "SLA personnalisée",
        "Stratège dédié",
        "SSO et audit",
        "Intégrations sur mesure",
        "Tarif au volume",
      ],
      cta: "Parler aux ventes",
      href: "mailto:sales@dragun.app?subject=Dragun%20%E2%80%94%20Entreprise",
    },
  },
  en: {
    eyebrow: "Pricing · VI.",
    headline: "Simple. Transparent. Built for the recovery.",
    sub: "Start free and pay only on what we recover. Scale to PRO when your cash flow can't afford to wait.",
    authedNote:
      "Signed in · each plan button opens Stripe checkout directly.",
    starter: {
      badge: "Free — always",
      name: "Starter",
      price: "5 %",
      unit: "on recovered only",
      note: "No fixed fee — ever.",
      features: [
        "30-day campaign · email, SMS + voice",
        "Unlimited invoices",
        "Bilingual FR · EN",
        "You own your ledger, always",
      ],
      cta: "Start free",
      hrefUnauth: "/auth/sign-up",
      hrefAuth: "/app",
    },
    sprint: {
      badge: "Short-term recovery",
      name: "Sprint",
      price: "$49",
      unit: "/ week",
      note: "4-week default · cancel any week.",
      features: [
        "Everything in Starter",
        "Priority voice agent scheduling",
        "Live recovery dashboard",
        "0 % commission on recovered",
        "Cancel after any week, no penalty",
      ],
      cta: "Start Sprint",
    },
    pro_monthly: {
      badge: "PRO · Most popular",
      name: "PRO Monthly",
      price: "$149",
      unit: "/ month",
      note: "Cancel anytime.",
      features: [
        "Everything in Sprint",
        "Unlimited active campaigns",
        "Advanced cadence control",
        "SOC 2 audit trail access",
        "Priority support",
        "0 % commission on recovered",
      ],
      cta: "Go PRO",
      ctaPrimary: true,
      featured: true,
    },
    pro_annual: {
      badge: "PRO · Annual",
      name: "PRO Annual",
      price: "$124",
      unit: "/ month",
      note: "$1,490 billed annually.",
      savings: "Save 17 %",
      features: [
        "Everything in PRO Monthly",
        "Dedicated onboarding call",
        "Early access to new channels",
        "Annual invoice for accounting",
      ],
      cta: "Best value",
    },
    enterprise: {
      label: "Enterprise",
      title: "Custom — built around your volume",
      desc: "For teams processing 500+ invoices a month, multi-entity setups, or firms that need white-label campaigns, SLA guarantees, and a dedicated recovery strategist.",
      pills: [
        "White-label",
        "Custom SLA",
        "Dedicated strategist",
        "SSO & audit",
        "Custom integrations",
        "Volume pricing",
      ],
      cta: "Talk to sales",
      href: "mailto:sales@dragun.app?subject=Dragun%20%E2%80%94%20Enterprise",
    },
  },
};

function badgeCx(variant: "starter" | "sprint" | "pro" | "annual"): string {
  switch (variant) {
    case "starter":
      return "border-moss/60 text-moss";
    case "sprint":
      return "border-bone-2/60 text-bone-2";
    case "pro":
      return "border-ember/60 text-ember";
    case "annual":
      return "border-moss/60 text-moss";
  }
}

function PlanCard({
  variant,
  copy,
  authed,
}: {
  variant: "starter" | "sprint" | "pro_monthly" | "pro_annual";
  copy: Copy;
  authed: boolean;
}) {
  if (variant === "starter") {
    const t = copy.starter;
    return (
      <article className="flex flex-col gap-4 border border-line bg-ink-1/40 p-6 sm:p-7">
        <span
          className={`inline-flex w-fit border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] ${badgeCx("starter")}`}
        >
          {t.badge}
        </span>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
          {t.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="num font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none text-bone">
            {t.price}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
            {t.unit}
          </span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
          {t.note}
        </p>
        <hr className="border-line" />
        <ul className="space-y-2.5 text-sm text-bone-2">
          {t.features.map((f) => (
            <li key={f} className="flex gap-3">
              <span className="mt-1 h-px w-3 shrink-0 bg-bone-3" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          href={authed ? t.hrefAuth : t.hrefUnauth}
          className="mt-auto inline-flex items-center justify-center gap-2 border border-bone/40 px-4 py-3 font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
        >
          {t.cta} <span>→</span>
        </Link>
      </article>
    );
  }

  const tierKey = variant; // narrowing
  const t = copy[tierKey];
  const featured = "featured" in t && t.featured;
  const ctaPrimary = "ctaPrimary" in t && t.ctaPrimary;
  const savings = "savings" in t ? t.savings : null;
  const badgeVariant: "sprint" | "pro" | "annual" =
    tierKey === "sprint" ? "sprint" : tierKey === "pro_monthly" ? "pro" : "annual";

  return (
    <article
      className={`relative flex flex-col gap-4 p-6 sm:p-7 ${
        featured
          ? "border-2 border-ember bg-ember/5"
          : "border border-line bg-ink-1/40"
      }`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex w-fit border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] ${badgeCx(badgeVariant)}`}
        >
          {t.badge}
        </span>
        {savings ? (
          <span className="inline-flex w-fit border border-moss/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-moss">
            {savings}
          </span>
        ) : null}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
        {t.name}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="num font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none text-bone">
          {t.price}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
          {t.unit}
        </span>
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
        {t.note}
      </p>
      <hr className="border-line" />
      <ul className="space-y-2.5 text-sm text-bone-2">
        {t.features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className="mt-1 h-px w-3 shrink-0 bg-bone-3" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <form action={startBillingCheckoutAction} className="mt-auto">
        <input type="hidden" name="plan" value={tierKey} />
        <button
          type="submit"
          className={
            ctaPrimary
              ? "w-full inline-flex items-center justify-center gap-2 bg-ember px-4 py-3 font-mono text-[11.5px] uppercase tracking-[0.22em] text-ink hover:bg-bone transition-colors"
              : "w-full inline-flex items-center justify-center gap-2 border border-bone/40 px-4 py-3 font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
          }
        >
          {t.cta} <span>→</span>
        </button>
      </form>
    </article>
  );
}

export function PricingSection({
  locale,
  authed,
}: {
  locale: Locale;
  authed: boolean;
}) {
  const c = COPY[locale];
  return (
    <section id="pricing" className="relative border-t border-line">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              {c.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
              {c.headline}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[44ch] text-bone-2 text-sm sm:text-base">
              {c.sub}
            </p>
            {authed ? (
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
                {c.authedNote}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PlanCard variant="starter" copy={c} authed={authed} />
          <PlanCard variant="sprint" copy={c} authed={authed} />
          <PlanCard variant="pro_monthly" copy={c} authed={authed} />
          <PlanCard variant="pro_annual" copy={c} authed={authed} />
        </div>

        <div className="mt-6 grid gap-6 border border-line bg-ink-1/40 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {c.enterprise.label}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-bone">
              {c.enterprise.title}
            </h3>
            <p className="max-w-[60ch] text-bone-2 text-sm sm:text-base leading-[1.55]">
              {c.enterprise.desc}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.enterprise.pills.map((p) => (
                <li
                  key={p}
                  className="border border-line px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-2"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={c.enterprise.href}
            className="inline-flex items-center justify-center gap-2 border border-bone/50 px-5 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors whitespace-nowrap"
          >
            {c.enterprise.cta} <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
