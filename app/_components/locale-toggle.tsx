import { setLocaleAction } from "../_actions/locale";
import { getLocale, getStringsFor, type Locale } from "../_lib/i18n";

export async function LocaleToggle({ className }: { className?: string }) {
  const current = await getLocale();
  const next: Locale = current === "fr" ? "en" : "fr";
  const otherStrings = getStringsFor(next);

  return (
    <form action={setLocaleAction} className={className}>
      <input type="hidden" name="locale" value={next} />
      <button
        type="submit"
        className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3 hover:text-bone transition-colors border-b border-line hover:border-bone pb-px"
        aria-label={`Switch to ${otherStrings.locale.label}`}
      >
        {otherStrings.locale.short}
      </button>
    </form>
  );
}
