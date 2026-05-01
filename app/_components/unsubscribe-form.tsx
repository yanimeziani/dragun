"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  unsubscribeAction,
  type UnsubscribeState,
} from "../_actions/unsubscribe";

const initial: UnsubscribeState = { status: "idle" };

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

type Copy = {
  confirmHeading: string;
  confirmBody: string;
  confirmCTA: string;
  doneHeading: string;
  doneBody: string;
  alreadyHeading: string;
  alreadyBody: string;
  errorBody: string;
};

export function UnsubscribeForm({
  debtorId,
  copy,
}: {
  debtorId: string;
  copy: Copy;
}) {
  const [state, dispatch] = useActionState(unsubscribeAction, initial);

  if (state.status === "done") {
    return (
      <div className="border border-line bg-ink-1/30 p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-moss">
          {state.alreadyDone ? copy.alreadyHeading : copy.doneHeading}
        </p>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl text-bone">
          {state.debtorName || ""}
        </h2>
        <p className="mt-4 max-w-[58ch] text-bone-2 text-base leading-[1.55]">
          {state.alreadyDone ? copy.alreadyBody : copy.doneBody}
          {state.orgName ? ` — ${state.orgName}` : ""}
        </p>
      </div>
    );
  }

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="debtorId" value={debtorId} />
      <div className="border border-line bg-ink-1/30 p-6 sm:p-8">
        <h2 className="font-display text-2xl sm:text-3xl text-bone">
          {copy.confirmHeading}
        </h2>
        <p className="mt-4 max-w-[58ch] text-bone-2 text-base leading-[1.55]">
          {copy.confirmBody}
        </p>
      </div>
      {state.status === "error" && (
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-ember">
          {state.error || copy.errorBody}
        </p>
      )}
      <Submit label={copy.confirmCTA} />
    </form>
  );
}
