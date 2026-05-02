# SOC 2 Readiness — Dragun

**Date:** 2026-05-02 (post-hardening) · **Stage:** pre-launch · **Auditor of record:** none yet · **Type I observation start:** not begun

This is the post-hardening view. The first pass of this doc (kept in git
history, commit before today's hardening pass) recorded the gap analysis;
this revision records what has been closed, what remains, and the new
readiness verdict.

Companion docs:

- [`soc2-hardening-spec.md`](./soc2-hardening-spec.md) — the SOC-1..6 stories that drove the work
- [`soc2-problem-solution.md`](./soc2-problem-solution.md) — original front-to-back grid
- [`soc2-manops.md`](./soc2-manops.md) — manual operations the user owns
- [`subprocessors.md`](./subprocessors.md) — vendor register
- [`incident-response.md`](./incident-response.md) — IR playbook

## Readiness score

**76 % — Minor Gaps.** Up from a pre-hardening estimate of ~40 %. The code-side
of SOC 2 Security (CC1–CC9) and Privacy (P1–P8) is now substantially
implemented; remaining items are either manops-blocked (account creation,
admin scope) or deliberately deferred (application-layer PII encryption,
MFA UI, DSAR portal).

| Score | Rating | Verdict |
|---|---|---|
| 90-100 | Audit Ready | (not yet — manops 0.x to land) |
| **75-89** | **Minor Gaps** | **us — engageable with an auditor after manops 0.x** |
| 50-74 | Significant Gaps | (where we were last week) |
| < 50 | Not Ready | (where we were before SOC-1..6) |

## Closed in this pass

### Security · CC1–CC9

| ID | Story | Status | Evidence |
|---|---|---|---|
| CC2-01 | Marketing claims aligned to truth | closed | `app/page.tsx` `compliance.items` (FR + EN) — SOC2 → "Planifié/Planned"; 10DLC → "En traitement/In review"; audit log → "12 months admin actions" |
| CC4-01 | Application error tracking | closed (DSN-conditional) | `sentry.{server,client,edge}.config.ts`, `app/instrumentation.ts` |
| CC5-01 | HSTS | closed | `next.config.ts` `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` |
| CC5-02 | COOP | closed | `next.config.ts` `Cross-Origin-Opener-Policy: same-origin` |
| CC5-03 | CORP | closed | `next.config.ts` `Cross-Origin-Resource-Policy: same-origin` |
| CC5-04 | CSP (Report-Only) | closed | `proxy.ts` per-request nonce, `frame-ancestors 'none'`, `'strict-dynamic'`; report endpoint at `app/api/csp-report/route.ts` |
| CC6 | Service-role fail-loud on privileged paths | closed | `app/_lib/supabase/service.ts` throws on missing env (was silent fallback to "missing-env" string) |
| CC6 | Cron Bearer timing-safe | closed | `app/api/cron/cadence/route.ts` uses `crypto.timingSafeEqual` |
| CC7-02 | Stripe webhook idempotency on replay | closed | `app/api/webhooks/stripe/route.ts` catches Postgres `23505` and returns 200 deduped (was 500 → infinite Stripe retry) |
| CC7-03 | Vulnerability mgmt automation | closed | `.github/dependabot.yml` (weekly npm + monthly actions); `.github/workflows/ci.yml` runs `npm audit --omit=dev --audit-level=high` |
| CC8-01 | Structured server logging | closed | `app/_lib/log.ts` Pino + PII scrub allow-list; wired into webhook + cron + auth actions; CSP report endpoint logs at warn |
| CC8-01 | Request-id correlation | closed | `proxy.ts` injects `x-request-id`; `withReqId(req)` helper threads it through logs |
| CC8-02 | CI gate | closed | `.github/workflows/ci.yml` runs tsc, eslint, audit on every PR + push to `main` |
| CC8-03 | Audit log on every administrative action | closed | `audit_events` table + `record_audit_event` RPC + `app/_lib/audit.ts` helper; wired into 7 server-action mutations + 4 webhook events; readable at `/app/settings/activity` |
| CC9-01 | Subprocessor register | closed | [`docs/subprocessors.md`](./subprocessors.md) — 9 vendors with data scope, region, criticality, DPA path, last-reviewed |

### Privacy · P1–P8

| ID | Story | Status | Evidence |
|---|---|---|---|
| P4-01 | Retention enforcement | closed | Daily 03:00 UTC pass inside the cadence cron — `purge_audit_events_older_than(365)`, `purge_campaign_events_older_than(90)`, `redact_campaign_event_payloads_older_than(30)` |
| P4-03 | `campaign_events.payload` lifetime bounded | closed | redacted to `'{}'::jsonb` after 30 days, deleted with row at 90 |

### Operational

| ID | What | Status | Evidence |
|---|---|---|---|
| `security.txt` | RFC 9116 disclosure file | live | `public/.well-known/security.txt` |
| `/legal/security` | Public security posture page | live | `app/legal/security/page.tsx` + bilingual `app/legal/_content/security.ts` |
| Incident-response playbook | 5-phase doc with templates | live | [`docs/incident-response.md`](./incident-response.md) |
| Lint baseline | Was blocking CI gate | clean | `app/error.tsx` (`<a>` → `<Link>`) and `app/_components/count-up.tsx` (setState-in-effect refactor) both fixed |
| Engines pin | Node version drift risk | closed | `package.json#engines` + `.nvmrc` |
| `@supabase/supabase-js` mis-placed | `pnpm install --prod` would break | closed | moved from `devDependencies` to `dependencies` |

## Open — manops-blocked (the user owns)

These are tracked in [`docs/soc2-manops.md`](./soc2-manops.md). The code is
ready; what's missing is account creation, admin scope, or human signature.

| ID | What | Manops § |
|---|---|---|
| CC3 | Branch protection on `main` | 0.1 |
| CC4 | Sentry DSN created and pasted into Vercel envs | 0.2 |
| CC4 | Logflare drain on Supabase + Vercel | 0.3 |
| CC6 | Supabase password policy 12+ chars + HIBP leaked-password protection | 0.4 |
| CC6 | Supabase MFA (TOTP) enabled at the project level | 0.4 |
| CC9 | Signed DPAs from each subprocessor | 1.3 |
| CC5 | HSTS submitted to hstspreload.org (after 14-day live window) | 1.1 |
| CC5 | CSP flipped from Report-Only → enforce (after clean week) | 1.2 |
| CC2 | Twilio 10DLC production registration | 1.4 |
| CC5 | SOC 2 Type I auditor engagement letter | 1.5 |
| DB-push | Apply `20260503000000_audit_events.sql` to hosted project | 0.0 |

## Open — deliberately deferred

| ID | What | Why deferred |
|---|---|---|
| DB-04 | Application-layer encryption of debtor PII (email, phone) | Large refactor; defer until a customer or auditor flags it. Supabase volume-level AES-256 is the current control. |
| FE-10 | MFA enrollment UI in `/app/settings` | Manops 0.4 enables TOTP at the project level; UI is a follow-up story. |
| FE-12 | DSAR portal for debtors | Defer until first request lands. Privacy policy honours requests via `privacy@dragun.app` until then. |
| Twilio webhook (BE-09) | Inbound STOP/HELP route with signature verification | Prerequisite is Twilio production registration (`S1` in `stories.md`). |
| Resend bounce webhook (BE-10) | Auto-suppress hard bounces | Pre-launch volumes don't justify yet. Implement after first 100 deliveries. |
| Rate limiting (BE-03) | Vercel KV / Upstash sliding window on auth + checkout | Manops 0.4 sets Supabase project-level rate limits, which cover the highest-risk path (auth). App-level limiter is a follow-up. |

## Type I plausibility verdict

**Plausible after manops 0.x lands.** Concretely: with branch protection
enabled, Sentry + Logflare receiving events, Supabase auth tightened, the
`audit_events` migration applied, and signed DPAs collected, this codebase
+ documentation set is what an auditor would expect to find at the start of
a Type I engagement. Estimated additional time after manops:

- Engagement letter signed: 2 weeks (auditor lead time)
- Type I audit phase: 4–6 weeks
- Report issued: ~10 weeks from today

For Type II, plan a 6-month observation window after Type I issues.

## Supabase database linter — 2026-05-02

Findings from `https://supabase.com/dashboard/project/{ref}/database/linter`,
captured here as audit evidence. Resolved via
`supabase/migrations/20260503010000_db_linter_fixes.sql`.

| Finding | Severity | Resolution |
|---|---|---|
| `function_search_path_mutable` on `public.touch_updated_at` | WARN | Closed — `set search_path = public` added |
| `anon_security_definer_function_executable` on `create_organization`, `delete_my_data`, `update_my_organization` | WARN | Closed — explicit `revoke execute … from anon` |
| `anon` + `authenticated` can exec `handle_new_user` | WARN | Closed — trigger function; revoked from `anon, authenticated, public` |
| `anon` can exec `user_org_ids` | WARN | Closed — revoked from `anon`; `authenticated` retained because RLS policies depend on it |
| `anon` can exec `get_paylink_case` | WARN | **Accepted risk** — public paylink read; documented in `pg_description` |
| `anon` can exec `unsubscribe_debtor` | WARN | **Accepted risk** — one-click debtor opt-out; documented in `pg_description` |
| `auth_leaked_password_protection` disabled | WARN | Tracked in [`soc2-manops.md`](./soc2-manops.md) §0.4 |

Re-run the linter after applying the migration; the only warnings that
should remain are the two accepted-risk RPCs and (until manops §0.4 is
done) the leaked-password protection toggle.

## Re-audit triggers

Run this audit again when any of:

1. A new TSC category enters scope (Availability if SLA published, Confidentiality if a contract requires)
2. A new subprocessor is added
3. A new mutation is introduced that bypasses the `audit_events` wiring
4. A CSP policy change is made
5. A migration adds a new RLS-eligible table
