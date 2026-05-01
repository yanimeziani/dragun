"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createOrganizationAction,
  type CreateOrgState,
} from "../_actions/org";
import type { Locale, Strings } from "../_lib/i18n";

const initial: CreateOrgState = { status: "idle" };

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
      {pending ? "…" : label}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

export function OnboardingForm({
  strings,
  defaultLocale,
}: {
  strings: Strings;
  defaultLocale: Locale;
}) {
  const [state, dispatch] = useActionState(createOrganizationAction, initial);
  const s = strings.onboarding;

  return (
    <form action={dispatch} className="space-y-6">
      <label className="block">
        <span className={labelCx}>{s.businessName}</span>
        <input
          name="businessName"
          required
          autoComplete="organization"
          placeholder={s.businessNamePlaceholder}
          className={inputCx}
        />
      </label>

      <fieldset className="space-y-3">
        <legend className={labelCx}>{s.defaultLocale}</legend>
        <div className="flex gap-3 pt-1">
          {(["fr", "en"] as const).map((l) => (
            <label
              key={l}
              className="flex items-center gap-2 border border-line px-4 py-2 text-bone-2 has-[:checked]:border-ember has-[:checked]:text-ember cursor-pointer"
            >
              <input
                type="radio"
                name="locale"
                value={l}
                defaultChecked={l === defaultLocale}
                className="accent-ember"
                required
              />
              <span className="font-mono text-[11.5px] uppercase tracking-[0.22em]">
                {l === "fr" ? "FR · Français" : "EN · English"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className={labelCx}>{s.brandColor}</span>
        <input
          name="brandColor"
          type="text"
          placeholder="#E36A2C"
          className={inputCx}
        />
      </label>

      <label className="block">
        <span className={labelCx}>{s.signature}</span>
        <input
          name="signature"
          type="text"
          placeholder={s.signaturePlaceholder}
          className={inputCx}
        />
      </label>

      {state.status === "error" && (
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-ember">
          {state.error}
        </p>
      )}

      <div className="pt-2">
        <Submit label={s.submit} />
      </div>
    </form>
  );
}
