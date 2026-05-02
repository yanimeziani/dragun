"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateOrgAction,
  deleteAccountAction,
  type SettingsState,
} from "../_actions/settings";
import type { Locale } from "../_lib/i18n";

const initial: SettingsState = { status: "idle" };

const inputCx =
  "w-full bg-transparent border-b border-line py-3 text-bone placeholder:text-bone-3/70 outline-none transition-colors focus:border-ember";
const labelCx =
  "font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone-3";

function SaveBtn({ label }: { label: string }) {
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

function DeleteBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (
          !confirm(
            "This permanently deletes your account, your organization, every case, debtor, and event. This cannot be undone. Continue?",
          )
        ) {
          e.preventDefault();
        }
      }}
      className="inline-flex items-center gap-2 border border-ember/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ember hover:bg-ember hover:text-ink disabled:opacity-60 transition-colors"
    >
      {pending ? "…" : label}
    </button>
  );
}

type Copy = {
  businessName: string;
  defaultLocale: string;
  brandColor: string;
  brandColorHint: string;
  signature: string;
  signaturePlaceholder: string;
  payoutEmail: string;
  payoutEmailHint: string;
  save: string;
  saved: string;
  dangerZone: string;
  dangerHint: string;
  deleteAccount: string;
};

export function SettingsForm({
  org,
  copy,
}: {
  org: {
    id: string;
    display_name: string;
    locale: Locale;
    brand: { color?: string | null; signature?: string | null } | null;
    payout_email: string | null;
  };
  copy: Copy;
}) {
  const [state, dispatch] = useActionState(updateOrgAction, initial);

  return (
    <div className="space-y-16">
      <form action={dispatch} className="space-y-6">
        <input type="hidden" name="orgId" value={org.id} />

        <label className="block">
          <span className={labelCx}>{copy.businessName}</span>
          <input
            name="displayName"
            required
            defaultValue={org.display_name}
            className={inputCx}
          />
        </label>

        <fieldset className="space-y-3">
          <legend className={labelCx}>{copy.defaultLocale}</legend>
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
                  defaultChecked={l === org.locale}
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
          <span className={labelCx}>{copy.brandColor}</span>
          <input
            name="brandColor"
            type="text"
            defaultValue={org.brand?.color ?? ""}
            placeholder="#FF6A1A"
            pattern="^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$"
            className={inputCx}
          />
          <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
            {copy.brandColorHint}
          </span>
        </label>

        <label className="block">
          <span className={labelCx}>{copy.signature}</span>
          <input
            name="signature"
            type="text"
            defaultValue={org.brand?.signature ?? ""}
            placeholder={copy.signaturePlaceholder}
            className={inputCx}
          />
        </label>

        <label className="block">
          <span className={labelCx}>{copy.payoutEmail}</span>
          <input
            name="payoutEmail"
            type="email"
            defaultValue={org.payout_email ?? ""}
            placeholder="payouts@yourbusiness.com"
            className={inputCx}
          />
          <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
            {copy.payoutEmailHint}
          </span>
        </label>

        {state.status === "error" && (
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-ember">
            {state.error}
          </p>
        )}
        {state.status === "saved" && (
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-moss">
            {copy.saved}
          </p>
        )}

        <div className="pt-4">
          <SaveBtn label={copy.save} />
        </div>
      </form>

      <div className="border-t border-line pt-10">
        <div className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-ember">
          {copy.dangerZone}
        </div>
        <p className="mt-3 max-w-[58ch] text-bone-2 text-sm leading-relaxed">
          {copy.dangerHint}
        </p>
        <form action={deleteAccountAction} className="mt-5">
          <DeleteBtn label={copy.deleteAccount} />
        </form>
      </div>
    </div>
  );
}
