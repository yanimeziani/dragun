"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  signInWithPassword,
  signUpWithPassword,
  type AuthState,
} from "../_actions/auth";
import { GoogleButton } from "./google-button";

const initial: AuthState = { status: "idle" };

const inputCx =
  "w-full bg-transparent border-b border-line py-3 text-bone placeholder:text-bone-3/70 outline-none transition-colors focus:border-ember";
const labelCx =
  "font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone-3";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center justify-center gap-3 bg-ember px-5 sm:px-7 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone disabled:opacity-60"
    >
      {pending ? "One moment…" : label}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const action = mode === "sign-up" ? signUpWithPassword : signInWithPassword;
  const [state, dispatch] = useActionState(action, initial);
  const altHref = mode === "sign-up" ? "/auth/sign-in" : "/auth/sign-up";
  const altLabel =
    mode === "sign-up" ? "Already have an account? Sign in" : "New here? Create an account";

  return (
    <div className="space-y-6">
      <GoogleButton>
        {mode === "sign-up" ? "Sign up with Google" : "Sign in with Google"}
      </GoogleButton>

      <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-bone-3">
        <span className="h-px flex-1 bg-line" />
        or with email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={dispatch} className="space-y-6">
        {mode === "sign-up" && (
          <label className="block">
            <span className={labelCx}>Name</span>
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className={inputCx}
            />
          </label>
        )}
        <label className="block">
          <span className={labelCx}>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@yourbusiness.com"
            className={inputCx}
          />
        </label>
        <label className="block">
          <span className={labelCx}>Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete={
              mode === "sign-up" ? "new-password" : "current-password"
            }
            placeholder="At least 8 characters"
            className={inputCx}
          />
        </label>

        {state.status === "error" && (
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-ember">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Submit label={mode === "sign-up" ? "Create my account" : "Sign in"} />
          <Link
            href={altHref}
            className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
          >
            {altLabel}
          </Link>
        </div>
      </form>
    </div>
  );
}
