import type { Metadata } from "next";
import { createClient } from "@/app/_lib/supabase/server";

export const metadata: Metadata = {
  title: "Dragun · Thanks",
};

const COPY = {
  fr: {
    title: "Paiement reçu. Merci !",
    sub: "Votre reçu a été envoyé par courriel.",
    poweredBy: "Recouvrement assuré par Dragun",
  },
  en: {
    title: "Payment received. Thank you!",
    sub: "Your receipt was sent by email.",
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

export default async function PaylinkThanksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_paylink_case", { p_slug: slug });
  const row = Array.isArray(data) ? data[0] : data;
  const locale: "fr" | "en" =
    row?.debtor_locale === "en" || row?.debtor_locale === "fr"
      ? row.debtor_locale
      : row?.org_locale ?? "fr";
  const c = COPY[locale];
  const orgName = row?.org_display_name ?? "Dragun";

  return (
    <main className="min-h-screen bg-ink overflow-x-hidden flex items-center">
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-12 w-full">
        <div className="flex items-center gap-3 text-bone">
          <Mark className="h-6 w-6" />
          <span className="font-display text-xl tracking-tight">{orgName}</span>
        </div>

        <h1 className="mt-16 font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[1.04] tracking-tight text-bone break-words">
          {c.title}
        </h1>
        <p className="mt-5 text-bone-2 text-base sm:text-lg leading-[1.55]">
          {c.sub}
        </p>

        <p className="mt-16 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
          {c.poweredBy}
        </p>
      </div>
    </main>
  );
}
