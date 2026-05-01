"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCaseAction, type CreateCaseState } from "../_actions/case";
import type { Locale, Strings } from "../_lib/i18n";

const initial: CreateCaseState = { status: "idle" };

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

export function CaseForm({
  strings,
  defaultLocale,
}: {
  strings: Strings;
  defaultLocale: Locale;
}) {
  const [state, dispatch] = useActionState(createCaseAction, initial);
  const s = strings.caseForm;
  const sErr = strings.errors;

  return (
    <form action={dispatch} className="space-y-6">
      <label className="block">
        <span className={labelCx}>{s.debtorName}</span>
        <input
          name="debtorName"
          required
          autoComplete="off"
          placeholder="Jean-François Tremblay"
          className={inputCx}
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-6">
        <label className="block">
          <span className={labelCx}>{s.debtorEmail}</span>
          <input
            type="email"
            name="debtorEmail"
            autoComplete="off"
            placeholder="member@email.com"
            className={inputCx}
          />
        </label>
        <label className="block">
          <span className={labelCx}>{s.debtorPhone}</span>
          <input
            type="tel"
            name="debtorPhone"
            autoComplete="off"
            placeholder="+14185551234"
            pattern="^\+[1-9]\d{6,14}$"
            className={inputCx}
          />
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className={labelCx}>{s.debtorLocale}</legend>
        <div className="flex gap-3 pt-1">
          {(["fr", "en"] as const).map((l) => (
            <label
              key={l}
              className="flex items-center gap-2 border border-line px-4 py-2 text-bone-2 has-[:checked]:border-ember has-[:checked]:text-ember cursor-pointer"
            >
              <input
                type="radio"
                name="debtorLocale"
                value={l}
                defaultChecked={l === defaultLocale}
                className="accent-ember"
              />
              <span className="font-mono text-[11.5px] uppercase tracking-[0.22em]">
                {l === "fr" ? "FR · Français" : "EN · English"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-[1fr_auto] gap-4 sm:gap-6">
        <label className="block">
          <span className={labelCx}>{s.amount}</span>
          <input
            type="number"
            name="amount"
            required
            step="0.01"
            min="0.01"
            placeholder="89.00"
            className={`${inputCx} num`}
          />
        </label>
        <label className="block">
          <span className={labelCx}>{s.currency}</span>
          <select
            name="currency"
            defaultValue="CAD"
            className={`${inputCx} sm:min-w-[120px]`}
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelCx}>{s.description}</span>
        <input
          name="description"
          placeholder={s.descriptionPlaceholder}
          className={inputCx}
        />
      </label>

      <label className="block">
        <span className={labelCx}>{s.ref}</span>
        <input
          name="ref"
          placeholder={s.refPlaceholder}
          className={inputCx}
        />
      </label>

      <label className="flex items-center gap-3 pt-2 cursor-pointer">
        <input
          type="checkbox"
          name="sendNow"
          defaultChecked
          className="accent-ember h-4 w-4"
        />
        <span className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-2">
          {s.sendNow}
        </span>
      </label>

      {state.status === "error" && (
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-ember">
          {state.error}
        </p>
      )}

      <div className="pt-4">
        <Submit label={s.submit} />
      </div>

      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3 leading-relaxed">
        {sErr.invalidPhone}
      </p>
    </form>
  );
}
