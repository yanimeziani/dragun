# SOC 2 Problem-Solution Grid — Dragun (Front-to-Back)

**Date:** 2026-05-02 · **Companion to:** [`soc2-readiness.md`](./soc2-readiness.md)

This is the actionable view of the readiness audit: every problem we found,
mapped to a concrete solution, sized to a level of effort, and tagged with
the SOC 2 Trust Service Criterion it closes. Organised by layer:

1. **Frontend** — browser, edge, marketing copy
2. **Backend** — Next.js server runtime, server actions, API routes, cron
3. **Database** — Supabase Postgres, RLS, schema
4. **Dependencies** — npm packages
5. **API providers / subprocessors** — Supabase, Stripe, Resend, Twilio, Google OAuth, Vercel

**Severity:** **H** = blocks Type I or risks customer trust at launch · **M** = required before first paid customer · **L** = remediate during operating period.
**Effort:** **S** = ≤1 day · **M** = 1–5 days · **L** = >1 week.

---

## 1. Frontend (browser, edge, marketing copy)

| TSC | Problem | Sev | Solution | Where | Effort |
|---|---|---|---|---|---|
| CC5 | No `Strict-Transport-Security` (HSTS) header. Vercel terminates TLS but a downgrade-MitM on first connection is possible without HSTS preload. | H | Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` to `securityHeaders`. Submit `dragun.app` to hstspreload.org after launch. | `next.config.ts:3-11` | S |
| CC5 | No `Content-Security-Policy`. XSS in any user-rendered string (debtor name, org display name, brand signature) would execute unmitigated. | H | Add a strict CSP: `default-src 'self'; script-src 'self' 'nonce-{nonce}'; img-src 'self' data:; connect-src 'self' *.supabase.co api.stripe.com; frame-ancestors 'none'; base-uri 'self'`. Per-request nonce via Next 16 middleware. | `next.config.ts`, `proxy.ts` | M |
| CC5 | Missing `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`. Default browser policies are weaker than `same-origin`. | M | Add `COOP: same-origin`, `CORP: same-origin` to `securityHeaders`. | `next.config.ts:3-11` | S |
| CC2 | Marketing copy claims "SOC 2 Type I in process" — no auditor engaged. | H | Change FR `"En cours"` and EN `"In progress"` to `"Planifié"` / `"Planned"` until engagement letter is signed. | `app/page.tsx` (search `compliance.items`, both `fr` + `en` blocks) | S |
| CC2 | Marketing copy claims "audit log on every invoice, retained for seven years" — no audit table exists. | H | Either build it (see DB-04) and shorten retention to a number we'll honor, or remove the line. | `app/page.tsx` (CC8a in marketing copy), `docs/architecture.md` | S |
| CC2 | No `security.txt`. Bug-bounty researchers and auditors look here first. | M | Create `public/.well-known/security.txt` with `Contact: mailto:security@dragun.app`, `Expires:`, `Preferred-Languages: en, fr`. | new file | S |
| CC2 | No `/security` page describing our security posture. | L | Add `app/legal/security/page.tsx` linking to `security.txt`, the privacy policy, and (eventually) the SOC 2 report. | new route | S |
| P3 | No cookie banner. The two cookies we set (`dragun_locale`, Supabase auth) are arguably "strictly necessary" + "functional" — disclosure in privacy policy is sufficient under EU/Quebec law for this category, but we should make that disclosure visible at first visit for jurisdictions with stricter posture. | L | Optional: small dismissible footer note linking to privacy policy. | new component | S |
| CC6 | No password-strength meter or breached-password check on sign-up. Users pick `password123` and we let them. | M | Replace the `length < 8` check with `length < 12` + zxcvbn score ≥ 3 + HIBP k-anonymity check (range API, no full hash leaves browser). | `app/_actions/auth.ts:50-51, 84-85`, new client-side meter on `app/_components/auth-form.tsx` | M |
| CC6 | No MFA option surfaced to users. | M | Enable TOTP in Supabase project, add enrollment UI in `/app/settings`. | new section in `app/app/settings/page.tsx` + `_components/mfa-form.tsx` | M |
| CC4 | No client-side error visibility. A broken hydration or thrown server-action error reaches the user as a generic page. | M | Add `@sentry/nextjs` (browser + server). Configure DSN via env, scrub PII from breadcrumbs (debtor email/phone). | `app/instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts` | M |
| P5 | No debtor-facing data-subject access request (DSAR) flow. Debtors can unsubscribe but cannot request a copy or correction of what we hold about them. | M | Add `/u/[debtorId]/data` page returning a JSON export of the debtor's record. Token-protected via the same signed-link approach as unsubscribe. | new route + RPC | M |

## 2. Backend (Next.js runtime, server actions, API routes, cron)

| TSC | Problem | Sev | Solution | Where | Effort |
|---|---|---|---|---|---|
| CC6 | `createServiceClient()` falls back to literal `"missing-env"` string when `SUPABASE_SECRET_KEY` is unset, so the rest of the request silently runs against a broken client. The intent (commit `e54d110`) was to avoid taking the whole site down, but this hides operational failures. | H | Throw on the privileged path (webhooks, cron) — those routes should fail loud — and keep the soft-fail only for the user-facing `createClient()`. Add a unit test asserting the throw. | `app/_lib/supabase/service.ts:1-19` | S |
| CC6 | Cron Bearer comparison `header === \`Bearer ${expected}\`` is not timing-safe. The constant-time deficit is small but trivial to fix. | L | Switch to `crypto.timingSafeEqual(Buffer.from(header), Buffer.from(\`Bearer ${expected}\`))` with length check. | `app/api/cron/cadence/route.ts:10-15` | S |
| CC7 | No rate limiting on auth (`signInWithPassword`, `signUpWithPassword`) or on the `startCheckoutAction` server actions. Credential stuffing is unconstrained beyond Supabase's project-level limits. | H | Add Vercel KV (or Upstash) sliding-window limiter: 5 sign-in attempts/IP/min, 3 sign-up attempts/IP/hour, 10 paylink-checkout starts/IP/min. | new `app/_lib/ratelimit.ts`, wrap actions in `app/_actions/auth.ts`, `app/_actions/checkout.ts`, `app/_actions/billing.ts` | M |
| CC7 | No abuse-detection signal anywhere: failed logins, repeated webhook 401s, cron 401s — all silent. | M | Once Sentry is wired (FE-04), emit `captureMessage("auth.failed", { level: "warning" })` from each guard path. Add a Logflare drain on Supabase. | server actions + API routes | M |
| CC8 | No structured logging. `NextResponse.json` returns the operator's only window into webhook + cron behaviour. | H | Pino (server) → stdout → Vercel runtime logs → Logflare drain. Wrap each handler with a request-id middleware so we can join FE → BE → DB events. | `app/_lib/log.ts`, all `app/api/*/route.ts`, server actions | M |
| CC8 | Stripe webhook handler does an `INSERT` on `payments`; on retry, the unique index on `stripe_payment_intent_id` rejects, but the handler responds 500 instead of 200. Stripe will retry indefinitely. | M | Catch `unique_violation` (Postgres `23505`), short-circuit to `NextResponse.json({ ok: true, deduped: true })`. | `app/api/webhooks/stripe/route.ts:124-140` | S |
| CC8 | Stripe subscription webhook re-derives plan from metadata; if metadata missing, we silently skip with `"no plan in metadata"`. Should at minimum warn-log so we notice. | M | Replace skip with a warn-log + return 200 (don't make Stripe retry, but make the operator visible to the gap). | `app/api/webhooks/stripe/route.ts:178-181` | S |
| CC8 | No staging environment separated from production. Every push to `main` is live. | H | Configure Vercel "Preview" deploys per PR + a separate Supabase project for staging. Block direct push to `main` (see CC8 in CC9-Deps). | Vercel + GitHub repo settings | M |
| CC7 | Twilio `StatusCallback` URL is set when sending but no route is implemented to receive it; if added later, must verify Twilio's `X-Twilio-Signature` HMAC. | M | When wiring delivery tracking, compute `HMAC-SHA1(authToken, url + sortedParams)` and `timingSafeEqual` against header. | future `app/api/webhooks/twilio/route.ts` | S (preventive) |
| CC7 | Resend webhooks for `email.delivered` / `email.bounced` not implemented. Without them we can't honour bounces (auto-suppress) or evidence delivery for SOC 2 monitoring. | M | Add `app/api/webhooks/resend/route.ts`, verify `Svix-Signature`, write to `campaign_events.status`. | new route | M |
| CC9 | Vercel cron is configured (assumed via Vercel dashboard) but `vercel.json` in the repo is not surfaced here; if it lives only in the dashboard, it's not in version control. | M | Move cron schedule into `vercel.json` so it's auditable. | `vercel.json` | S |
| P4 | No retention enforcement cron. Privacy policy says "technical logs ≤ 90 days"; nothing purges old `campaign_events`. | M | New `app/api/cron/retention/route.ts`: delete `campaign_events` older than 90 days; null-out `payload` on events older than 30 days. | new route + `vercel.json` schedule | M |
| P2 | `campaign_events.payload jsonb` stores rendered email/SMS bodies — including the debtor's name. Lives forever unless retention runs. | M | Solved by P4 above + add a `payload_redacted_at` column the retention cron sets. | migration | S |
| P5 | `delete_my_data()` cascades hard. Auditors will ask for proof of deletion; we have nothing left to show. | M | Before delete, write a `data_deletion_log(user_id, org_id, deleted_at, counts jsonb)` record from the SECURITY DEFINER function. Retain for 6 years (matches accounting commitment in privacy policy). | migration | S |

## 3. Database (Supabase Postgres, RLS, schema)

| TSC | Problem | Sev | Solution | Where | Effort |
|---|---|---|---|---|---|
| CC6 | RLS coverage is good. No gap to flag — leaving this row to record the positive finding for the auditor. | — | Maintain. Re-verify every new migration enables RLS with at least one policy. | `supabase/migrations/*` | — |
| CC6 | `subscriptions` table allows member SELECT but has no INSERT/UPDATE policy. By default RLS denies, which is what we want (service role only). Document this intent so a future engineer doesn't add a permissive policy. | L | Add a comment in the migration: `-- writes only via Stripe webhook (service role); no auth policy by design`. | `supabase/migrations/20260502000000_billing_plans.sql:55-65` | S |
| CC8 | No `audit_events` table. Marketing claim contradicted; admin actions (org rename, member invite, plan change, account deletion) leave no trail. | H | New migration: `audit_events(id, org_id, actor_user_id, action text, target_type text, target_id uuid, before jsonb, after jsonb, ip inet, ua text, created_at timestamptz default now())`. RLS: members read own org's events; service role and SECURITY DEFINER functions insert. Wire from each mutating server action. | new migration + server-action wrappers | M |
| CC7 | `debtors.email` and `debtors.phone_e164` stored plaintext. Supabase volume-level encryption is real, but it doesn't protect against a Supabase admin or a leaked dump. | M | Application-layer encryption with a project KMS key for `email_encrypted` + `phone_encrypted` columns; keep `email_hash` (HMAC) for lookup. Defer until Type I unless customer demand drives it sooner — large refactor. | new migration + `app/_lib/crypto.ts` | L |
| P4 | `campaign_events` retention is implicit. | M | See BE-12 (retention cron). | — | — |
| P7 | `debtors` has no constraints on `email` or `phone_e164` format. Bad CSV imports could land malformed values. | M | Add `check (email is null or email ~* '^[^@]+@[^@]+\\.[^@]+$')` and `check (phone_e164 is null or phone_e164 ~ '^\\+[1-9][0-9]{6,14}$')`. Keep Postgres-side validation as a defence in depth, even though `app/_actions/import.ts` validates client-side. | new migration | S |
| CC8 | No row-level versioning on `organizations` updates (display name, brand). Hard to reconstruct "who changed what when". | M | Solved by `audit_events` (DB-03). | — | — |
| CC1 | `org_members.role` is `owner` or `staff` — only one role beyond owner. Auditors look for documented privilege tiers. | L | Either keep two-role model and document it explicitly in `docs/architecture.md`, or add `viewer` (read-only) for the SOC 2 separation-of-duties story. | `supabase/migrations/20260430120000_orgs_cases.sql:25-27`, `docs/` | S |

## 4. Dependencies (npm)

| TSC | Problem | Sev | Solution | Where | Effort |
|---|---|---|---|---|---|
| CC7 | No `npm audit` on CI. No Dependabot. Dependency CVEs ride into prod silently. | H | Add `.github/dependabot.yml` (weekly npm + monthly GitHub Actions). Add a GitHub Actions workflow running `npm audit --audit-level=high`, `tsc --noEmit`, `eslint`. Block merge on failure. | new files | S |
| CC8 | No `engines.node` in `package.json`. WSL/Vercel/local can drift between Node 20 / 22 / 24. | M | Pin `"engines": { "node": ">=20.18 <23" }` (or whatever Vercel currently runs). Add `.nvmrc`. | `package.json`, `.nvmrc` | S |
| CC8 | Branch protection on `main` is not configured (assumed — there's no `.github/` in the repo and runbook mentions push-to-main). | H | GitHub repo settings: require PR + 1 review (waivable for solo founder), require status checks (the new CI), block force-push, block delete. | repo settings (no code) | S |
| CC9 | `@supabase/supabase-js` lives under `devDependencies` but is imported at runtime by `app/_lib/supabase/service.ts`. Builds work because Next bundles it, but a `pnpm install --prod` would break. | L | Move `@supabase/supabase-js` to `dependencies`. | `package.json:22` | S |
| CC7 | No `package.json#overrides` lockdown. If a transitive dependency ships a bad version, we have no escape hatch in-repo. | L | When a CVE forces a sub-dep upgrade, use `overrides` to pin and document in commit message. (No action today; pattern note.) | — | — |
| CC7 | `package-lock.json` is committed (good). No SBOM produced. | L | Add `npm sbom --sbom-format=cyclonedx > sbom.cdx.json` to release process; attach to GitHub Releases. Useful for enterprise procurement reviews after launch. | new release script | S |

## 5. API providers / subprocessors

The data-flow audit. One row per provider — what data leaves us, how the
boundary is secured, what's missing. Pair with `docs/subprocessors.md` (to be
created — see CC9-01 in the readiness doc).

### 5.1 Supabase (Postgres + Auth)

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC9 | No DPA on file in repo, no record of region pinning (US vs EU vs CA). | H | Sign Supabase DPA, save signed copy in a non-public artifact store, reference in `docs/subprocessors.md`. Confirm project region — if customers store debtor data subject to Quebec Law 25, prefer `ca-central-1` or `us-east-1` with appropriate disclosure. | S |
| CC8 | Project ref + URL is in `NEXT_PUBLIC_SUPABASE_URL` (must be public, that's correct). Service-role + publishable keys have no rotation schedule. | M | Document quarterly key-rotation procedure in `docs/runbook.md`. Test once before SOC 2 audit. | S |
| CC4 | No Supabase log drain configured (DB logs, auth logs, edge logs not aggregated anywhere we can audit). | M | Configure Logflare or self-hosted drain. Retain 90 days. | M |
| CC6 | Supabase Auth password policy is project-default (Supabase changed defaults to 6 chars historically; we layer 8 in our action). | M | In Supabase dashboard, enforce min 12 chars + leaked-password protection. Brings server-side enforcement in line with FE-09. | S |
| CC7 | No Supabase project usage of `pgaudit` or row-versioning extensions. | L | Enable `pgaudit` for DDL + role + role-management events. Send to log drain. | S |

### 5.2 Stripe (payments + billing)

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC9 | Stripe is the most sensitive subprocessor. SOC 2 / PCI reports are public on `stripe.com/docs/security`. We need to record we've reviewed them. | M | Add a row in `docs/subprocessors.md`: data scope = payment metadata + customer email; criticality = critical; SOC 2 = Stripe SOC 1/SOC 2 Type II; PCI = Level 1; last reviewed = 2026-Q2. | S |
| CC7 | Webhook signature verified ✓. Replay window = 5 min ✓. Idempotency = unique index on `stripe_payment_intent_id` ✓. The 500-on-duplicate behaviour is the one gap (BE-06). | M | See BE-06. | S |
| CC8 | Subscription webhook trusts `metadata.org_id` and `metadata.plan` — set by us at checkout, so trustworthy. We also fall back to a customer-id lookup. | — | Maintain. Document the trust chain in `docs/architecture.md`. | S |
| CC9 | Stripe API key rotation has no documented schedule. | L | Quarterly rotation; record in `docs/runbook.md`. | S |
| P3 | We pass debtor `description` and amount to Stripe Checkout. Debtor sees a Stripe-hosted page that shows the merchant's brand. Stripe Checkout collects the debtor's email. That email is shared with us via `customer_email` on the session. | — | Disclose in privacy policy (it already names Stripe as a subprocessor). | — |

### 5.3 Resend (email)

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC9 | API key auth via `Bearer` ✓. Outbound only at the moment (no inbound webhook configured). | — | Maintain. | — |
| P3 | We send rendered HTML (debtor name, payment-link URL, merchant signature) to Resend. Resend stores it for delivery + (depending on plan) retention. | M | Disclose in privacy policy ✓ (already there). Add Resend DPA signature + region note to `docs/subprocessors.md`. | S |
| CC7 | DKIM/SPF/DMARC posture is not documented in repo. Marketing copy claims alignment — auditors will ask for the DNS records. | M | Add `docs/email-auth.md` with current TXT records (`v=spf1 include:resend.com -all`, DKIM selector, `v=DMARC1; p=quarantine; rua=...`). Re-verify quarterly. | S |
| CC8 | No bounce/complaint handling — bouncing addresses keep getting attempted reminders. | M | Implement Resend webhook (BE-10). On `email.bounced` or `email.complained`, set `debtors.unsubscribed_at` and cancel scheduled events. | M |
| CC7 | `RESEND_API_KEY` rotation has no schedule. | L | Quarterly. | S |

### 5.4 Twilio (SMS + voice)

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC9 | Basic auth (`SID:TOKEN`) over TLS ✓. Account is currently trial per `docs/runbook.md`. | H | Production registration before launch. 10DLC / A2P numbers must be verified. **Until then, the marketing copy "10DLC / A2P · Registered" is false** — see FE-05 marketing-copy fixes. | M (mostly external — Twilio review) |
| P3 | We send `body` (debtor name + amount + paylink URL + STOP/HELP language) to Twilio. Twilio retains for compliance and (in trial) shows in the Twilio console. | M | Disclose in privacy policy ✓. Add Twilio DPA signature + region note to `docs/subprocessors.md`. | S |
| CC7 | No signature verification on inbound TwiML or status callbacks (the route doesn't exist yet, but the URL is being constructed in `sendSms` / `placeCall` calls). When we add the inbound route, it must verify `X-Twilio-Signature`. | M | Stub a route with signature verification now to prevent later forgetting. See BE-09. | S |
| P6 | Inbound STOP / HELP handling is referenced in marketing ("Inbound STOP / HELP handled" — `app/page.tsx` channels.cards en[1].detail[2]) but no inbound webhook is implemented in the repo. | H | Implement `app/api/webhooks/twilio/inbound/route.ts`: parse `Body`, on STOP set `debtors.unsubscribed_at` for the matching `phone_e164`, cancel scheduled events, reply with TwiML confirmation. | M |
| CC7 | Trial accounts can only call/SMS verified numbers. Pre-launch fine; post-launch this becomes a delivery-failure source if upgrade is incomplete. | M | Pin upgrade as a launch blocker. | — |

### 5.5 Google OAuth

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC6 | Scope is implicit (defaults). We use only the identity claims passed back to Supabase. No long-lived tokens stored on our side beyond Supabase Auth. | — | Document in `docs/architecture.md`: "Google sign-in: profile + email scope only; no offline access; no refresh tokens stored in our DB." | S |
| CC9 | OAuth client secret rotation has no schedule. | L | Quarterly. | S |
| CC2 | OAuth-consent-screen privacy policy URL must point at `dragun.app/legal/privacy` (verify in Google Cloud Console). | M | Verify and screenshot for evidence. | S |

### 5.6 Vercel (hosting + edge)

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC9 | DPA must be signed (Vercel Pro+); region pinning available on Pro+. | M | If running on Hobby, upgrade to Pro before customer onboarding. Sign DPA. Region: prefer `iad1` or `cdg1` per customer base. | S (plan upgrade) |
| CC7 | No WAF rules. Vercel's default DDoS protection covers transit-layer; application-layer abuse is on us. | M | Vercel Firewall (Pro+): block known scanners, add rate-limit rule per path. Or pair with Cloudflare in front. | M |
| CC4 | Vercel runtime logs are 1-day retention on Hobby, 1–30 days on Pro. Insufficient for SOC 2 evidence. | H | Log drain to Logflare / Datadog / S3. Retain 365 days for security events, 90 days for general. | M |
| CC8 | Deploys are tied to `main`. Preview deploys per PR are off (no `vercel.json#git`). | H | Enable Preview deploys; require manual promotion on prod. See BE-08. | S |
| CC7 | Environment-variable encryption: Vercel encrypts at rest; access is per-user via Vercel team membership. | — | Document the team-membership review cadence (quarterly). | S |

### 5.7 Lora font (Google Fonts via `next/font`)

| TSC | Problem | Sev | Solution | Effort |
|---|---|---|---|---|
| CC9 | `next/font/google` self-hosts the font at build time — no runtime connection to fonts.googleapis.com from the user's browser. Privacy posture is good. | — | Note in `docs/subprocessors.md` for completeness: "Lora is fetched at build, served from our origin. Google receives no end-user data at runtime." | S |

---

## Top-of-list, ordered by ROI

If we can only do six things in the next two weeks before the Mounir Rami
investor meeting (2026-05-01 already done — next milestone), do these:

1. **Fix the marketing copy** — drop "Type I in process", "audit log on every invoice", and "10DLC registered" until each is true. (FE-04, FE-05, Twilio-01) — `S`
2. **Add HSTS + COOP/CORP + a baseline CSP** — `next.config.ts` is one file, hardens the entire surface. (FE-01, FE-02, FE-03) — `S–M`
3. **Sentry + Pino + Logflare drain** — gives us CC4 (monitoring) and CC8 (audit trail) in one project. (FE-11, BE-05) — `M`
4. **GitHub Actions CI + branch protection + Dependabot** — closes CC3 (vuln mgmt), CC8 (change mgmt) in a day. (Deps-01, Deps-03) — `S`
5. **`audit_events` table + service-role inserts from mutating server actions** — makes the marketing claim true and gives us evidence of admin activity. (DB-03) — `M`
6. **`docs/subprocessors.md` + `docs/incident-response.md`** — closes CC9 + CC7 paper gaps; required before the first enterprise prospect asks for a security questionnaire. — `M`

Total: ~3 engineering weeks to cross the threshold from "demo-ready" to
"customer-ready" on SOC 2 lines, well before any auditor engagement.

---

## Cross-references

- Companion gap-analysis: [`soc2-readiness.md`](./soc2-readiness.md)
- Skill used: `~/.claude/skills/soc2-compliance/SKILL.md`
- Architecture context: [`architecture.md`](./architecture.md)
- Operational context: [`runbook.md`](./runbook.md)
