import { type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { updateSession } from "./app/_lib/supabase/middleware";

// Per-request setup that runs before every page / route handler:
//   1. request-id (echoed on response; readable in RSC via headers())
//   2. CSP nonce on the request, threaded into a per-request Content-Security-
//      Policy-Report-Only header on the response (SOC-2)
//   3. Supabase auth-cookie refresh (existing)
//
// We mutate the request headers in place so server components can read them
// via `headers()` from `next/headers`.

export async function proxy(request: NextRequest) {
  const reqId = request.headers.get("x-request-id") ?? randomUUID();
  const nonce = Buffer.from(randomUUID()).toString("base64");
  request.headers.set("x-request-id", reqId);
  request.headers.set("x-csp-nonce", nonce);

  const response = await updateSession(request);
  response.headers.set("x-request-id", reqId);

  // CSP — Report-Only first; SOC-2 manops §1.2 flips to enforce after a clean
  // observation window. Frame-ancestors blocks clickjacking even in
  // report-only mode (frame-ancestors is one of the few directives that
  // must be in an enforcing header — covered by X-Frame-Options: DENY in
  // next.config.ts as a belt-and-braces fallback).
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self' *.supabase.co api.stripe.com *.ingest.sentry.io *.ingest.us.sentry.io *.ingest.de.sentry.io`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `report-uri /api/csp-report`,
  ].join("; ");
  response.headers.set("Content-Security-Policy-Report-Only", csp);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
