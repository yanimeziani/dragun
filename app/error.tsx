"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-ink overflow-x-hidden flex items-center">
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-12 w-full">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember">
          Something broke
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.04] tracking-tight text-bone">
          We hit an error.
        </h1>
        <p className="mt-5 max-w-[58ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          The page failed to render. Try again, or go back to the homepage. If
          this keeps happening, write to founders@dragun.app and include the
          reference below.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
            Ref · {error.digest}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-3 bg-ember px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink hover:bg-bone transition-colors"
          >
            Try again →
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-bone/50 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
          >
            ← Home
          </Link>
        </div>
      </div>
    </main>
  );
}
