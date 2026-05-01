"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importCasesAction, type ImportState } from "../_actions/import";

const initial: ImportState = { status: "idle" };

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

export function ImportForm({
  submitLabel,
  fileLabel,
  noFileError,
  doneCreatedLabel,
  doneFailedLabel,
  errorListLabel,
  rowLabel,
}: {
  submitLabel: string;
  fileLabel: string;
  noFileError: string;
  doneCreatedLabel: string;
  doneFailedLabel: string;
  errorListLabel: string;
  rowLabel: string;
}) {
  const [state, dispatch] = useActionState(importCasesAction, initial);

  return (
    <div className="space-y-8">
      <form action={dispatch} encType="multipart/form-data" className="space-y-6">
        <label className="block">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone-3">
            {fileLabel}
          </span>
          <input
            type="file"
            name="csv"
            accept=".csv,text/csv"
            required
            className="mt-3 block w-full text-bone file:mr-4 file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-bone hover:file:border-ember hover:file:text-ember"
          />
        </label>

        {state.status === "error" && (
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-ember">
            {state.error || noFileError}
          </p>
        )}

        <Submit label={submitLabel} />
      </form>

      {state.status === "done" && (
        <div className="border border-line bg-ink-1/30 p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {doneCreatedLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-bone">
                {state.created}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {doneFailedLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-ember">
                {state.failed}
              </div>
            </div>
          </div>

          {state.errors.length > 0 && (
            <div className="border-t border-line pt-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {errorListLabel}
              </div>
              <ul className="mt-3 space-y-1 text-bone-2 text-sm">
                {state.errors.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-bone-3">
                      {rowLabel} {e.row}
                    </span>
                    <span>{e.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
