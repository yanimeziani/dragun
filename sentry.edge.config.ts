// Sentry edge-runtime init (proxy.ts, route handlers with `runtime: 'edge'`).
// DSN-conditional. See sentry.server.config.ts.

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.1,
    environment: process.env.VERCEL_ENV ?? "development",
  });
}
