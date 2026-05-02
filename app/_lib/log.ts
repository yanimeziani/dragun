// Structured server-side logger.
// Outputs JSON to stdout; Vercel runtime logs ingest, then a Logflare drain
// (configured outside the codebase, see docs/soc2-manops.md §0.3) ships them
// to a 90-day retention store. PII is scrubbed before serialization so
// debtor email/phone never lands in long-term storage.

import pino from "pino";

const PII_KEYS = new Set([
  "email",
  "phone",
  "phone_e164",
  "password",
  "token",
  "secret",
  "apiKey",
  "api_key",
  "Authorization",
  "authorization",
  "stripe-signature",
  "x-twilio-signature",
  "svix-signature",
  "body", // SMS / email body — likely contains debtor name + amount
  "subject",
  "payload", // campaign_events.payload column
]);

function scrub(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(scrub);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = PII_KEYS.has(k) ? "[redacted]" : scrub(v);
    }
    return out;
  }
  return value;
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { svc: "dragun-web" },
  formatters: {
    log(obj) {
      return scrub(obj) as Record<string, unknown>;
    },
  },
  redact: {
    paths: Array.from(PII_KEYS).flatMap((k) => [
      k,
      `*.${k}`,
      `*.*.${k}`,
    ]),
    censor: "[redacted]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function withReqId(reqId: string | null | undefined) {
  return logger.child({ request_id: reqId ?? "none" });
}

export type Logger = typeof logger;
