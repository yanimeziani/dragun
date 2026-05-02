"use client";

import { useTransition } from "react";
import { signInWithGoogle } from "../_actions/auth";

export function GoogleButton({
  label = "Continue with Google",
  loadingLabel = "Opening Google…",
  variant = "primary",
}: {
  label?: string;
  loadingLabel?: string;
  variant?: "primary" | "ghost";
}) {
  const [pending, start] = useTransition();

  const cls =
    variant === "primary"
      ? "bg-bone text-ink hover:bg-ember"
      : "border border-bone/40 text-bone hover:border-ember hover:text-ember";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await signInWithGoogle();
          if (r?.status === "error") {
            alert(r.error);
          }
        })
      }
      className={`group inline-flex items-center justify-center gap-3 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] transition-colors disabled:opacity-60 ${cls}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden
        className="shrink-0"
      >
        <path
          fill="#EA4335"
          d="M9 3.6c1.5 0 2.8.5 3.9 1.5l2.9-2.9C13.9 0.7 11.6 0 9 0 5.5 0 2.5 2 1 4.9l3.4 2.6C5.2 5.3 6.9 3.6 9 3.6z"
        />
        <path
          fill="#4285F4"
          d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.7l3.4 2.6c2-1.8 3.2-4.5 3.2-7z"
        />
        <path
          fill="#FBBC05"
          d="M4.4 10.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7L1 4.7C.4 6 0 7.4 0 9s.4 3 1 4.3l3.4-2.6z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.5 0 4.6-.8 6.1-2.2l-3.4-2.6c-.9.6-2.1 1-2.7 1-2.1 0-3.8-1.4-4.6-3.4L1 13.4C2.5 16.2 5.5 18 9 18z"
        />
      </svg>
      <span>{pending ? loadingLabel : label}</span>
    </button>
  );
}
