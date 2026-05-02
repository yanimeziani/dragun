# SOC 2 Hardening — Refactor Spec

**Source:** [`soc2-problem-solution.md`](./soc2-problem-solution.md) Top-6 ROI list
**Re-audit:** run `~/.claude/skills/soc2-compliance/SKILL.md` against the
post-implementation tree; see [Re-audit handoff](#re-audit-handoff).
**Migration apply:** every migration story ends with `npx supabase db push`
against the hosted project — not `db:reset`.
**Companion:** stories below are formatted to drop into `docs/stories.md`
under the same H–H1 / Status / Estimate / Acceptance shape used by the
autonomous build loop.

## Scope

In:

1. Marketing copy aligned to reality (no false SOC 2 / 10DLC / audit-log claims)
2. Wire security headers — HSTS, CSP (report-only first), COOP, CORP
3. Observability — Sentry (errors), Pino (server logs), Logflare (drain), request-id correlation
4. CI + branch protection + Dependabot
5. `audit_events` table + service-role inserts from every mutating server action
6. Subprocessor register + incident-response runbook

Out (deliberately deferred to a later spec):

- Application-layer encryption of debtor PII (DB-04 in the grid) — scope is large; defer until either Type I auditor flags it or a customer requires it
- MFA enrollment UI (FE-10) — same reason; ship Supabase TOTP enablement only
- DSAR portal for debtors (FE-12) — defer until first request lands
- Twilio inbound STOP webhook (5.4-04) — separate story (Twilio account upgrade is a prerequisite, see `S1` in `stories.md`)

## Exit criteria (binary)

- [ ] Every claim in `app/page.tsx` `compliance.items` is true OR removed.
- [ ] `curl -I https://dragun.app` shows `Strict-Transport-Security`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, and `Content-Security-Policy-Report-Only` headers.
- [ ] A thrown error in any server action surfaces in Sentry within 60s.
- [ ] A failed merge (eslint, tsc, or `npm audit --audit-level=high`) blocks PR merge to `main`.
- [ ] Renaming an org via the settings UI inserts an `audit_events` row visible to org members.
- [ ] `docs/subprocessors.md` and `docs/incident-response.md` exist, are linked from the privacy policy footer, and pass internal review.

---

# Stories

## SOC-1 — Marketing claims aligned to reality

**Status:** pending
**Estimate:** 1h
**TSC:** CC2, CC8

**Why:** Three claims in the landing-page compliance section are not currently
supportable: SOC 2 Type I "in process" (no auditor), "audit log on every
invoice retained for seven years" (no audit table), "10DLC / A2P registered"
(Twilio still trial). An auditor or a sharp prospect will notice.

**Tasks:**
- In `app/page.tsx`, both `COPY.fr.compliance.items` and `COPY.en.compliance.items`:
  - Replace SOC 2 entry → tag `"Planifié"` / `"Planned"`, body: "Programme aligné AICPA TSC. Engagement d'audit prévu post-lancement. Journal d'audit administratif activé." / English mirror.
  - Replace 10DLC entry → tag `"En traitement"` / `"In review"`, body: clarify Twilio production registration in progress.
  - Soften "Audit log on every invoice" into "Audit log on every administrative action, retained for 12 months" (matches what SOC-5 will deliver).
- Update `app/legal/_content/privacy.ts` retention sub-section so policy and marketing match.
- Verify no other surface still says "Type I in process": `grep -rn "Type I" app/`.

**Acceptance:** `grep -rn "Type I" app/` returns either zero hits or only docs-side references, AND the rendered EN/FR landing pages show the corrected tags + bodies.

---

## SOC-2 — Security headers (HSTS, COOP, CORP, CSP report-only)

**Status:** pending
**Estimate:** 3h
**TSC:** CC5, CC7
**Depends on:** none

**Why:** `next.config.ts` sets four headers but is missing HSTS, COOP, and CORP — and has no CSP at all. Without CSP, any XSS in user-supplied content (debtor name, org display name, brand signature) executes unmitigated.

**Tasks:**

1. Extend `securityHeaders` in `next.config.ts`:
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `Cross-Origin-Opener-Policy: same-origin`
   - `Cross-Origin-Resource-Policy: same-origin`
2. Move CSP to a per-request nonce-driven response header set in `proxy.ts`:
   - Generate a 16-byte nonce per request via `crypto.randomBytes`.
   - Stash on request headers as `x-csp-nonce` so server components can read it.
   - Emit `Content-Security-Policy-Report-Only` (not enforce — Next 16 streaming SSR + React 19 may inline scripts that need allowance) with:
     ```
     default-src 'self';
     script-src 'self' 'nonce-{NONCE}' 'strict-dynamic';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data: blob:;
     font-src 'self' data:;
     connect-src 'self' *.supabase.co api.stripe.com;
     frame-src js.stripe.com;
     frame-ancestors 'none';
     base-uri 'self';
     form-action 'self' checkout.stripe.com billing.stripe.com;
     report-uri /api/csp-report;
     ```
3. Add `app/api/csp-report/route.ts`: accept `application/csp-report`, log via Pino at `warn`, return 204.
4. After SOC-3 lands and one week of report-only data is clean, flip header name to `Content-Security-Policy` in a follow-up story.
5. Submit `dragun.app` to https://hstspreload.org once HSTS has been live for two weeks.

**Acceptance:** `curl -sI https://dragun.app | grep -E 'Strict-Transport|Cross-Origin|Content-Security'` returns all three headers; CSP-report-only violations show up in Sentry/log drain after a deploy; landing page renders normally with no broken inline content.

---

## SOC-3 — Observability stack (Sentry + Pino + Logflare)

**Status:** pending
**Estimate:** 1d
**TSC:** CC4, CC7, CC8
**Depends on:** none (paths under SOC-2 use the logger from this story)

**Why:** Today, server-action errors and webhook failures vanish into Vercel's
short-retention runtime logs with no aggregation, alerting, or correlation.
SOC 2 CC4 (monitoring) and CC8 (audit/change evidence) need both.

**Tasks:**

1. **Pino server logger** (`app/_lib/log.ts`):
   - Single export: `logger` (base) and `withReqId(reqId)` (child).
   - JSON output, level from `LOG_LEVEL` env (`info` default, `debug` in dev).
   - Built-in PII scrubbers: drop keys named `email`, `phone`, `phone_e164`, `password`, `token`, `secret`, `apiKey`, `Authorization`, replace with `"[redacted]"`.
2. **Request-id correlation** (`proxy.ts`):
   - On every request, set `x-request-id` header (use incoming if present, else `crypto.randomUUID()`). Echo on the response.
3. Wire `logger` into:
   - All `app/api/*/route.ts` handlers (request start, request done with status, errors with stack).
   - All server actions in `app/_actions/*.ts` (success + failure paths). Replace any naked `throw` that crosses the boundary with `logger.error(...)` then re-throw.
   - Cron handler at `app/api/cron/cadence/route.ts`: log `fired`, `failed`, `handed_off`.
4. **Sentry** (`@sentry/nextjs` ≥ 8):
   - `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` with DSN from env, `tracesSampleRate: 0.1`, `replaysSessionSampleRate: 0`.
   - `beforeSend` hook running through the same scrubbers as Pino.
   - Tag every event with `request_id` from the request scope.
5. **Logflare drain on Supabase** — connect a Logflare project to the hosted Supabase project; retention 90 days. Document the source name in `docs/subprocessors.md` (SOC-6).
6. **Add envs to Vercel + `.env.development.local`:** `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `LOG_LEVEL`, `LOGFLARE_API_KEY` (if shipping logs from Vercel runtime), `LOGFLARE_SOURCE_ID`.

**Acceptance:**

- `curl -i https://dragun.app/api/cron/cadence` (without auth) → 401 in browser AND a `warn`-level log line with `request_id`, `path`, `status: 401` visible in Logflare within 30s.
- A throw inside `signInWithPassword` reaches Sentry within 60s with no `email` / `password` in the breadcrumb payload (verify via filter).
- `app/api/webhooks/stripe/route.ts` writes a structured log on each event including `event_type`, `org_id` (if known), and `result`.

---

## SOC-4 — CI + branch protection + Dependabot

**Status:** pending
**Estimate:** 3h
**TSC:** CC3, CC7, CC8
**Depends on:** none (orthogonal to other SOC stories)

**Why:** The repo has no `.github/`. Pushes to `main` deploy directly. No
dependency CVE alerts. No automated typecheck/lint/audit gate.

**Tasks:**

1. Add `.github/dependabot.yml`:
   - `npm` ecosystem, weekly schedule, group minor + patch into one PR.
   - `github-actions` ecosystem, monthly schedule.
2. Add `.github/workflows/ci.yml` running on every PR + `main`:
   - `actions/setup-node@v4` reading `.nvmrc`.
   - `npm ci`.
   - `npx tsc --noEmit`.
   - `npx eslint .` (current config; pre-existing `error.tsx` lint error already in the tree should be fixed in this story so the gate is green — see notes below).
   - `npm audit --audit-level=high` (failure blocks merge).
3. Add `.nvmrc` with `20.18` (or whichever version Vercel currently runs).
4. Add `"engines": { "node": ">=20.18 <23" }` to `package.json`.
5. Move `@supabase/supabase-js` from `devDependencies` → `dependencies` (it's imported at runtime by `app/_lib/supabase/service.ts`).
6. Pre-existing lint cleanups so the new gate is green on day one:
   - `app/error.tsx:43` — replace `<a>` with `next/link` (`@next/next/no-html-link-for-pages`).
   - `app/_components/count-up.tsx:31` — restructure to avoid `setState` inside an effect body (move to `useLayoutEffect` with a guard, or compute initial state from props/refs).
7. **GitHub repo settings (manual; capture screenshots as audit evidence):**
   - Branch protection on `main`: require PR + 1 approval (waivable for solo founder via admin override is fine, but record overrides).
   - Require status checks: `ci`.
   - Block force-push and deletion.

**Acceptance:** Opening a PR triggers `ci`, fails if any of the three checks fail, and shows in the PR UI as a required check. `npm ls --omit=dev | grep @supabase/supabase-js` resolves cleanly post-install.

---

## SOC-5 — `audit_events` table + service-role inserts

**Status:** pending
**Estimate:** 1d
**TSC:** CC8 (change mgmt), CC6 (logical access trail)
**Depends on:** SOC-3 (uses `request_id` from the logger)

**Why:** Marketing claims "audit log on every invoice retained for seven years."
No audit table exists. After SOC-1 the marketing claim is softened to "every
administrative action, 12 months" — this story makes that claim true.

**Tasks:**

1. **Migration** `supabase/migrations/{TS}_audit_events.sql`:
   ```
   create table public.audit_events (
     id           uuid primary key default gen_random_uuid(),
     org_id       uuid not null references public.organizations(id) on delete cascade,
     actor_user_id uuid references auth.users(id) on delete set null,
     action       text not null,                -- 'org.update' | 'case.create' | …
     target_type  text not null,                -- 'organization' | 'case' | …
     target_id    uuid,
     before       jsonb,
     after        jsonb,
     request_id   text,
     ip           inet,
     ua           text,
     created_at   timestamptz not null default now()
   );
   create index audit_events_org_id_created_at_idx
     on public.audit_events (org_id, created_at desc);
   alter table public.audit_events enable row level security;
   create policy "audit_events_select_member"
     on public.audit_events for select to authenticated
     using (org_id in (select org_id from public.org_members where user_id = auth.uid()));
   -- writes only via SECURITY DEFINER RPC below; no INSERT/UPDATE/DELETE policy.
   ```
2. **Insert RPC** (SECURITY DEFINER) `record_audit_event(org_id uuid, action text, target_type text, target_id uuid, before jsonb, after jsonb, request_id text, ip inet, ua text)`.
   - Caller must be a member of `org_id` OR running as service role.
   - `actor_user_id` resolved from `auth.uid()`.
3. **Server-side helper** `app/_lib/audit.ts`:
   - `recordAudit({ orgId, action, targetType, targetId, before, after })` — wraps the RPC.
   - Pulls `request_id`, `ip`, `ua` from request headers (`headers()` from `next/headers`).
4. **Wire from every mutating server action:**
   - `app/_actions/org.ts:createOrganizationAction` → `org.create`
   - `app/_actions/settings.ts:updateOrgAction` → `org.update` (with before/after diff)
   - `app/_actions/settings.ts:deleteAccountAction` → `org.delete`
   - `app/_actions/case.ts` (every mutation) → `case.{create|cancel|markPaid}`
   - `app/_actions/import.ts` → `case.import` (per-case)
   - `app/_actions/billing.ts` → `org.plan_changed` (after Stripe webhook upserts subscription, but webhook is service role so call from the webhook itself)
   - `app/api/webhooks/stripe/route.ts` → `payment.received`, `subscription.{created|updated|deleted}`
5. **Retention cron** at `app/api/cron/retention/route.ts`:
   - Delete `audit_events` older than 365 days.
   - Delete `campaign_events` older than 90 days.
   - Null out `campaign_events.payload` for events older than 30 days.
   - Schedule daily 03:00 UTC in `vercel.json`.
6. **Settings UI** — add `/app/settings/activity` page listing the most recent 100 audit events for the active org. Read-only.

**Apply:** `npx supabase db push`, then verify in the linked project SQL editor that the new table + policy + RPC exist, then deploy the code.

**Acceptance:** Renaming the org via `/app/settings` inserts a row with `action='org.update'`, `before` and `after` JSON blobs, and a populated `request_id`. The new `/app/settings/activity` page renders the row for org members but returns nothing for a different org's member (verified by switching auth).

---

## SOC-6 — Subprocessor register + incident-response runbook

**Status:** pending
**Estimate:** 4h
**TSC:** CC2, CC7, CC9
**Depends on:** SOC-3 (incident-response refers to log drain), SOC-5 (refers to audit trail)

**Why:** CC9 (vendor risk) and CC7 (incident response) are the two paper gaps
most likely to be flagged by a Type I auditor's first walkthrough. Cheap to
write, expensive to be missing.

**Tasks:**

1. **`docs/subprocessors.md`** — one section per subprocessor:
   - Supabase, Vercel, Stripe, Resend, Twilio, Google (OAuth), Sentry, Logflare.
   - Each entry: data scope, region, criticality (Critical/High/Medium/Low), DPA link, last-reviewed date (today), SOC 2 / ISO link, contact, key-rotation cadence (quarterly).
   - Cross-link from the privacy policy in `app/legal/_content/privacy.ts` (replace the existing flat vendor list with a "see subprocessor register" pointer).
2. **`docs/incident-response.md`** — sections:
   - Detection sources (Sentry alerts, Logflare alerts, Stripe Radar, Twilio fraud, customer email).
   - Severity matrix (S1 = customer data exposure / outage > 1h ; S2 = degraded service ; S3 = single-customer issue ; S4 = informational).
   - Communication tree: solo founder → primary email + phone; investor / advisor names if applicable.
   - 72h breach-notification template (CAI Quebec + GDPR DPA), pulled from privacy-policy commitments.
   - Containment, eradication, recovery checklist.
   - Post-incident review template (timeline, root cause, blast radius, remediation, follow-ups).
3. **Add `public/.well-known/security.txt`:**
   ```
   Contact: mailto:security@dragun.app
   Expires: 2027-05-02T00:00:00Z
   Preferred-Languages: en, fr
   Canonical: https://dragun.app/.well-known/security.txt
   Policy: https://dragun.app/legal/security
   ```
4. **`app/legal/security/page.tsx`** — minimal page describing security posture, linking to privacy + the security.txt + the (future) SOC 2 report. Reuse `LegalShell`.

**Acceptance:** Both docs are linked from the privacy-policy footer. `curl https://dragun.app/.well-known/security.txt` returns the correct content with `200`. `/legal/security` renders.

---

# Sequencing

```
SOC-4 (CI)      ──┐
SOC-3 (Observ)  ──┼──► SOC-5 (audit_events) ──► SOC-1 (copy fix)
SOC-2 (Headers) ──┘                              SOC-6 (docs)
```

- Land SOC-4, SOC-3, SOC-2 in parallel — they're independent.
- SOC-5 depends on SOC-3 (uses `request_id`) and benefits from SOC-4 catching its migrations in CI.
- SOC-1 + SOC-6 ride last so the docs reference the now-true claims and the live audit trail.

Total wall-clock: ~3 engineering weeks for a single contributor pacing
realistically (i.e., not heroically), or ~5 working days at full focus.

---

# Re-audit handoff

When all six stories are `done`, re-run the SOC 2 skill against the tree.
The grader needs to verify the following observable signals — **list these as
the first prompt to the re-audit agent so it skips re-walking the whole
codebase**.

## What to verify (in order)

1. **Marketing-copy diff:** `grep -rn "Type I" app/ && grep -rn "seven years" app/ && grep -rn "10DLC.*Registered" app/` → all three return zero hits in `.tsx` files.
2. **Headers:** `curl -sI https://dragun.app` includes HSTS, COOP, CORP, and either `Content-Security-Policy` or `Content-Security-Policy-Report-Only`.
3. **CSP report endpoint:** `POST /api/csp-report` returns 204 and the synthetic report appears in Logflare within 60s.
4. **CI:** `.github/workflows/ci.yml` exists, runs on PR, blocks merge on tsc/eslint/audit failure. `dependabot.yml` exists.
5. **Branch protection:** `gh api repos/{owner}/dragun/branches/main/protection` returns a non-empty config (run with the user's gh auth).
6. **Logging:** triggering `/api/cron/cadence` without auth produces a structured warn-level log entry in Logflare with `request_id`, `path`, `status: 401`.
7. **Sentry:** `gh api repos/.../events` (or whatever evidence is available) — minimum, the Sentry project shows at least one event from the dev environment.
8. **`audit_events` table:** `npx supabase db remote --execute "select count(*) from public.audit_events;"` succeeds. RLS policies confirmed via `select * from pg_policies where tablename='audit_events';`.
9. **Audit trail wired:** rename an org via the UI, then read the most recent `audit_events` row — `action='org.update'`, populated `before`/`after`, populated `request_id`.
10. **Retention cron:** `vercel.json` lists the retention cron with daily schedule.
11. **Docs:** `docs/subprocessors.md`, `docs/incident-response.md`, `app/legal/security/page.tsx`, and `public/.well-known/security.txt` exist and contain the items called out above.
12. **Privacy-policy linkage:** privacy policy points to `/legal/security` and `docs/subprocessors.md` (or a published equivalent).

## Re-audit deliverable

The re-audit agent should produce:

- A revised problem-solution grid keeping only items that are still open (most "H" severity rows from this round should be closed; "M" and "L" carry forward).
- A new readiness score using the rubric in the SOC 2 skill (`90-100% Audit Ready` etc.).
- An updated `docs/soc2-readiness.md` (replace, not append — keep the file shape).
- A short verdict on whether engaging a Type I auditor is now plausible.

## To trigger the re-audit

Two paths:

- **On demand:** when the six stories are `done`, ping me and I'll run the audit in this session against the new tree.
- **Scheduled:** I can `/schedule` a one-time agent in 3 weeks to check stories.md statuses and re-audit if all six show `done`. Say the word.
