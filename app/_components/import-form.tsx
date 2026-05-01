"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importCasesAction, type ImportState } from "../_actions/import";

const initial: ImportState = { status: "idle" };

function Submit({
  label,
  action,
  variant = "primary",
}: {
  label: string;
  action: "preview" | "import";
  variant?: "primary" | "ghost";
}) {
  const { pending } = useFormStatus();
  const cls =
    variant === "primary"
      ? "bg-ember text-ink hover:bg-bone disabled:opacity-60"
      : "border border-line text-bone-2 hover:border-bone hover:text-bone disabled:opacity-60";
  return (
    <button
      type="submit"
      name="action"
      value={action}
      disabled={pending}
      className={`group inline-flex items-center justify-center gap-3 px-5 sm:px-7 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] transition-colors ${cls}`}
    >
      {pending ? "…" : label}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

type Copy = {
  fileLabel: string;
  previewLabel: string;
  importLabel: string;
  noFileError: string;
  totalLabel: string;
  validLabel: string;
  invalidLabel: string;
  rowLabel: string;
  doneCreatedLabel: string;
  doneFailedLabel: string;
  errorListLabel: string;
  validHeading: string;
  invalidHeading: string;
  reuploadHint: string;
};

export function ImportForm({ copy }: { copy: Copy }) {
  const [state, dispatch] = useActionState(importCasesAction, initial);

  return (
    <div className="space-y-8">
      <form action={dispatch} className="space-y-6">
        <label className="block">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone-3">
            {copy.fileLabel}
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
            {state.error || copy.noFileError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Submit label={copy.previewLabel} action="preview" variant="ghost" />
          <Submit label={copy.importLabel} action="import" variant="primary" />
        </div>
      </form>

      {state.status === "preview" && (
        <div className="border border-line bg-ink-1/30 p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {copy.totalLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-bone">
                {state.total}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {copy.validLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-moss">
                {state.valid}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {copy.invalidLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-ember">
                {state.invalid}
              </div>
            </div>
          </div>

          {state.rows.some((r) => r.ok) && (
            <div className="border-t border-line pt-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-moss">
                {copy.validHeading}
              </div>
              <div className="mt-3 overflow-x-auto thin-scroll">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
                      <th className="px-2 py-2">{copy.rowLabel}</th>
                      <th className="px-2 py-2">Name</th>
                      <th className="px-2 py-2">Email</th>
                      <th className="px-2 py-2">Phone</th>
                      <th className="px-2 py-2 text-right">Amount</th>
                      <th className="px-2 py-2">Locale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.rows
                      .filter((r) => r.ok)
                      .slice(0, 12)
                      .map((r, i) => (
                        <tr key={i} className="border-b border-line-soft">
                          <td className="num px-2 py-2 font-mono text-[12px] text-bone-3">
                            {r.row}
                          </td>
                          <td className="px-2 py-2 text-bone">{r.name}</td>
                          <td className="px-2 py-2 text-bone-2">
                            {r.email ?? "—"}
                          </td>
                          <td className="px-2 py-2 text-bone-2 font-mono text-[12px]">
                            {r.phone ?? "—"}
                          </td>
                          <td className="num px-2 py-2 text-right text-bone">
                            {r.amount?.toFixed(2)} {r.currency}
                          </td>
                          <td className="px-2 py-2 text-bone-3 font-mono text-[12px] uppercase">
                            {r.locale ?? "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {state.invalid > 0 && (
            <div className="border-t border-line pt-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ember">
                {copy.invalidHeading}
              </div>
              <ul className="mt-3 space-y-1 text-bone-2 text-sm">
                {state.rows
                  .filter((r) => !r.ok)
                  .slice(0, 30)
                  .map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-bone-3 shrink-0">
                        {copy.rowLabel} {r.row}
                      </span>
                      <span>{r.reason}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <p className="border-t border-line pt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3 leading-relaxed">
            {copy.reuploadHint}
          </p>
        </div>
      )}

      {state.status === "done" && (
        <div className="border border-line bg-ink-1/30 p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {copy.doneCreatedLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-moss">
                {state.created}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {copy.doneFailedLabel}
              </div>
              <div className="num mt-1 font-display text-3xl text-ember">
                {state.failed}
              </div>
            </div>
          </div>

          {state.errors.length > 0 && (
            <div className="border-t border-line pt-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                {copy.errorListLabel}
              </div>
              <ul className="mt-3 space-y-1 text-bone-2 text-sm">
                {state.errors.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-bone-3 shrink-0">
                      {copy.rowLabel} {e.row}
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
