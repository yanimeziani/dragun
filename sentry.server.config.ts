// Sentry server-side init.
// DSN-conditional: if SENTRY_DSN is unset (e.g. local dev with no account),
// Sentry is fully inert — no network calls, no overhead. Set the DSN in
// Vercel envs once the project is created (see docs/soc2-manops.md §0.2).

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.1,
    environment: process.env.VERCEL_ENV ?? "development",
    beforeSend(event) {
      // Belt-and-braces PII scrubbing — Sentry has its own scrubbers but we
      // mirror the Pino allow-list so the same fields can never leak.
      if (event.request?.cookies) event.request.cookies = { redacted: "true" };
      if (event.request?.headers) {
        for (const k of Object.keys(event.request.headers)) {
          if (/auth|cookie|signature/i.test(k)) {
            (event.request.headers as Record<string, string>)[k] = "[redacted]";
          }
        }
      }
      return event;
    },
  });
}
