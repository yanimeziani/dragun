import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { signOut } from "@/app/_actions/auth";
import { getLocale, getStrings, type Locale } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { SettingsForm } from "@/app/_components/settings-form";

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
      "Hex format (#E36A2C). Utilisée pour les boutons de paiement et l'en-tête des courriels.",
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
  },
  en: {
    title: "Settings",
    subtitle:
      "Customize what your customers see in emails, texts, and calls.",
    businessName: "Business name",
    defaultLocale: "Default language for customer communications",
    brandColor: "Brand color",
    brandColorHint:
      "Hex format (#E36A2C). Used on pay buttons and email headers.",
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
  },
} as const;

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

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth + membership are guaranteed by app/app/layout.tsx, but the org
  // query here uses the canonical RPC for cross-table reads.
  const { data: orgRowsRaw } = await supabase
    .from("organizations")
    .select("id, display_name, locale, brand, payout_email")
    .limit(1);
  const org = (orgRowsRaw?.[0] as Org | undefined) ?? null;

  const locale = await getLocale();
  const strings = await getStrings();
  const c = COPY[locale];

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

        {org && (
          <div className="mt-12">
            <SettingsForm org={org} copy={c} />
          </div>
        )}

        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
          {user!.email}
        </p>
      </section>
    </main>
  );
}
