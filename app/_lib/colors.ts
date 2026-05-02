// Dragun brand tokens · single source of truth for JS-side rendering
// (next/og images, file-based <Icon />, server-error fallback, email HTML).
// CSS-side tokens live in app/globals.css and MUST mirror these values.
//
// Principle:
//   text = calm authority      (warm off-white, never pure white)
//   icon = controlled action   (orange is the only signal allowed to scream)
//
// Keep ≈ 90 % neutral, 10 % orange — beyond that it stops feeling like a
// system and starts feeling like marketing.

export const tokens = {
  // ─ Surfaces (dark) ─────────────────────────────────────
  ink: "#0E0E0E",
  ink1: "#131315",
  ink2: "#1A1A1D",
  ink3: "#232328",

  // ─ Text on dark ────────────────────────────────────────
  bone: "#F5F2EA", // primary
  bone2: "#B8B2A7", // secondary
  bone3: "#6E6A64", // muted / metadata

  // ─ Accent (orange — the only "signal" colour) ──────────
  ember: "#FF6A1A", // brand mark, primary CTAs, highlights
  emberHot: "#FF7A2A", // hover / active
  ember2: "#C96A2A", // subtle / desaturated icon usage
  ember3: "#4A2613", // deep undertone (background washes only)
  emberOnLight: "#E85A10", // accent on light backgrounds

  // ─ Calm utility ────────────────────────────────────────
  moss: "#2c3a32",
  moss2: "#1a221c",
} as const;

// Email-specific palette. Mail clients have patchy CSS-variable support;
// these get inlined as raw hex into the HTML cadence templates.
export const emailTokens = {
  bg: "#F7F5F0", // warm paper background
  card: "#FFFFFF", // card surface
  text: tokens.ink, // dark text on light background (per spec)
  muted: tokens.bone3, // matches "#6E6A64" muted gray
  rule: "#E5E3DC", // light hairline rule
  accent: tokens.ember, // pay-link button / brand mark
} as const;

export type Tokens = typeof tokens;
export type EmailTokens = typeof emailTokens;
