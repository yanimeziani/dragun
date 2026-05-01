import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/_actions/auth";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { ImportForm } from "@/app/_components/import-form";

export const metadata: Metadata = {
  title: "Dragun · Import",
};

const SAMPLE_CSV = `Name,Email,Phone,Amount,Currency,Description,Locale
Jean-François Tremblay,jf@example.com,+14185551234,89.00,CAD,Cotisation avril,fr
Alex Carter,alex@example.com,(416) 555-0100,89.00,USD,March membership,en
Sophie Lévesque,sophie@example.com,418-555-1235,"120,00",CAD,Forfait trimestriel,fr
Michel Lavoie,,4185559876,$45.50,,Drop-in fee,fr
"O'Brien, Patrick",patrick@obrien.ca,+14385559090,210.00,CAD,"April + May (combined)",en
`;

const COPY = {
  fr: {
    title: "Importer vos clients en lot",
    subtitle:
      "Téléversez un CSV de votre liste de clients en retard. Aperçu d’abord, importation ensuite. Une campagne de 14 jours démarre automatiquement pour chaque ligne valide.",
    columnsTitle: "Colonnes acceptées",
    columnsBlurb:
      "Requis : nom et montant. Optionnel : courriel, téléphone, devise, description, langue. L’en-tête peut utiliser plusieurs alias (Customer, Debtor, Full Name, Téléphone, Mobile, Solde, Montant, Devise, Locale, Langue…).",
    samplesTitle: "Conversion automatique",
    samplesBlurb:
      "Les numéros nord-américains sans préfixe (10 chiffres ou 1+10) sont normalisés en E.164. Les montants acceptent « 89.00 », « 89,00 », « 89,00 $ », « $89.00 ». Symboles de devise et espaces ignorés.",
    sampleLabel: "Télécharger un exemple CSV",
    fileLabel: "Fichier CSV",
    previewLabel: "Aperçu",
    importLabel: "Importer",
    noFileError: "Choisissez un fichier CSV.",
    totalLabel: "Total",
    validLabel: "Valides",
    invalidLabel: "Rejetées",
    rowLabel: "Ligne",
    doneCreatedLabel: "Cas créés",
    doneFailedLabel: "Lignes rejetées",
    errorListLabel: "Lignes rejetées et raisons",
    validHeading: "Aperçu des lignes valides",
    invalidHeading: "Lignes rejetées",
    reuploadHint:
      "Aucune insertion. Pour importer vraiment, cliquez « Importer » ci-dessus avec le même fichier.",
    backLabel: "← Tableau de bord",
  },
  en: {
    title: "Import customers in bulk",
    subtitle:
      "Upload a CSV of your delinquent customers. Preview first, import second. A 14-day campaign starts automatically for every valid row.",
    columnsTitle: "Accepted columns",
    columnsBlurb:
      "Required: name and amount. Optional: email, phone, currency, description, locale. The header can use any of the common aliases (Customer, Debtor, Full Name, Phone, Mobile, Balance, Total, Currency, Locale, Language…).",
    samplesTitle: "Automatic conversion",
    samplesBlurb:
      "North-American phone numbers without a prefix (10-digit or 1+10) are normalized to E.164. Amounts accept “89.00”, “89,00”, “89,00 $”, “$89.00”. Currency symbols and spaces are stripped.",
    sampleLabel: "Download sample CSV",
    fileLabel: "CSV file",
    previewLabel: "Preview",
    importLabel: "Import",
    noFileError: "Choose a CSV file.",
    totalLabel: "Total",
    validLabel: "Valid",
    invalidLabel: "Rejected",
    rowLabel: "Row",
    doneCreatedLabel: "Cases created",
    doneFailedLabel: "Rows rejected",
    errorListLabel: "Rejected rows and reasons",
    validHeading: "Valid rows preview",
    invalidHeading: "Rejected rows",
    reuploadHint:
      "No rows inserted. To actually import, click “Import” above with the same file.",
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

export default async function ImportCasesPage() {
  const locale = await getLocale();
  const strings = await getStrings();
  const c = COPY[locale];
  const sampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_CSV)}`;

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

      <section className="mx-auto max-w-[860px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone">
          {c.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          {c.subtitle}
        </p>

        <div className="mt-8 grid gap-px bg-line border border-line md:grid-cols-2">
          <div className="bg-ink p-5 sm:p-6">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
              {c.columnsTitle}
            </div>
            <p className="mt-3 text-sm text-bone-2 leading-relaxed">
              {c.columnsBlurb}
            </p>
          </div>
          <div className="bg-ink p-5 sm:p-6">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
              {c.samplesTitle}
            </div>
            <p className="mt-3 text-sm text-bone-2 leading-relaxed">
              {c.samplesBlurb}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={sampleHref}
            download="dragun-sample.csv"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ember hover:text-bone border-b border-ember hover:border-bone pb-px"
          >
            {c.sampleLabel} ↓
          </a>
        </div>

        <div className="mt-12">
          <ImportForm copy={c} />
        </div>
      </section>
    </main>
  );
}
