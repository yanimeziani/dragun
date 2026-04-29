"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadState } from "../_actions/lead";

const initial: LeadState = { status: "idle" };

const inputCx =
  "w-full bg-transparent border-b border-line py-3 text-bone placeholder:text-bone-3/70 outline-none transition-colors focus:border-ember";
const labelCx =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center gap-3 bg-ember px-7 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone disabled:opacity-60"
    >
      {pending ? "Sending…" : "Request alpha access"}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

export function AlphaForm() {
  const [state, action] = useActionState(submitLead, initial);

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="border border-ember/40 bg-ember/5 p-7 text-bone"
      >
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ember">
          Received
        </div>
        <p className="mt-3 font-display text-2xl leading-snug">
          {state.name ? `Thanks, ${state.name}.` : "Thanks."} We&rsquo;ll be in
          touch within a business day.
        </p>
        <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-bone-3">
          Reply directly to that email if you need us sooner.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-7">
      {/* honeypot — hidden from users, fillable by bots */}
      <div className="hidden" aria-hidden>
        <label>
          Company (leave empty)
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
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
          <span className={labelCx}>Business</span>
          <input
            name="business"
            autoComplete="organization"
            placeholder="Your business"
            className={inputCx}
          />
        </label>
        <label className="block">
          <span className={labelCx}>Location</span>
          <input
            name="location"
            placeholder="City, region"
            className={inputCx}
          />
        </label>
      </div>

      <label className="block">
        <span className={labelCx}>What gets aged out, in your shop?</span>
        <textarea
          name="note"
          rows={3}
          placeholder="Memberships, invoices, deposits — tell us in a sentence."
          className={`${inputCx} resize-none`}
        />
      </label>

      {state.status === "error" && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ember">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <SubmitButton />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
          We never share your name. Reply STOP to leave any comms.
        </p>
      </div>
    </form>
  );
}
