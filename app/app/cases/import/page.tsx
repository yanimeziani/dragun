import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/_actions/auth";
import { getLocale, getStrings } from "@/app/_lib/i18n";
import { LocaleToggle } from "@/app/_components/locale-toggle";
import { ImportForm } from "@/app/_components/import-form";

export const metadata: Metadata = {
  title: "Dragun · Import",
};

const SAMPLE_CSV = `name,email,phone,amount,currency,description,locale
Jean-François Tremblay,jf@example.com,+14185551234,89.00,CAD,Cotisation avril,fr
Alex Carter,alex@example.com,+14165550100,89.00,USD,March membership,en
Sophie Lévesque,sophie@example.com,+14185551235,120.00,CAD,Forfait trimestriel,fr
`;

const COPY = {
  fr: {
    title: "Importer vos cas en lot",
    subtitle:
      "Téléversez un fichier CSV avec votre liste de membres en retard. Une campagne de 14 jours démarre automatiquement pour chaque ligne valide.",
    columns: "Colonnes",
    columnsList:
      "name (requis), email, phone (E.164), amount (requis, > 0), currency (CAD par défaut), description, locale (fr / en)",
    sampleLabel: "Télécharger un exemple CSV",
    fileLabel: "Fichier CSV",
    submitLabel: "Importer",
    noFileError: "Choisissez un fichier CSV.",
    doneCreatedLabel: "Cas créés",
    doneFailedLabel: "Lignes ignorées",
    errorListLabel: "Lignes ignorées et raisons",
    rowLabel: "Ligne",
    backLabel: "← Tableau de bord",
  },
  en: {
    title: "Import cases in bulk",
    subtitle:
      "Upload a CSV with your delinquent customers. A 14-day campaign starts automatically for every valid row.",
    columns: "Columns",
    columnsList:
      "name (required), email, phone (E.164), amount (required, > 0), currency (defaults to CAD), description, locale (fr / en)",
    sampleLabel: "Download sample CSV",
    fileLabel: "CSV file",
    submitLabel: "Import",
    noFileError: "Choose a CSV file.",
    doneCreatedLabel: "Cases created",
    doneFailedLabel: "Rows skipped",
    errorListLabel: "Skipped rows and reasons",
    rowLabel: "Row",
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

      <section className="mx-auto max-w-[760px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-tight text-bone">
          {c.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          {c.subtitle}
        </p>

        <div className="mt-8 border border-line bg-ink-1/30 p-5 sm:p-6">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
            {c.columns}
          </div>
          <p className="mt-2 text-sm text-bone-2 leading-relaxed">
            {c.columnsList}
          </p>
          <a
            href={sampleHref}
            download="dragun-sample.csv"
            className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ember hover:text-bone border-b border-ember hover:border-bone pb-px"
          >
            {c.sampleLabel} ↓
          </a>
        </div>

        <div className="mt-12">
          <ImportForm
            submitLabel={c.submitLabel}
            fileLabel={c.fileLabel}
            noFileError={c.noFileError}
            doneCreatedLabel={c.doneCreatedLabel}
            doneFailedLabel={c.doneFailedLabel}
            errorListLabel={c.errorListLabel}
            rowLabel={c.rowLabel}
          />
        </div>
      </section>
    </main>
  );
}
