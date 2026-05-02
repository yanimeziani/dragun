# SOC 2 Hardening — Manual Operations

These are the steps **only you can do** — they require account creation,
admin scope, payment cards, or human attestation. The automated work
in [`soc2-hardening-spec.md`](./soc2-hardening-spec.md) lands the code; this
doc is what makes the code operational.

Order is roughly "fastest payoff → highest delegation cost". Tick boxes as
you go and capture screenshots for SOC 2 evidence.

---

## 0. Before launch — must be done

### 0.0 Apply pending migrations

**Why:** Two new migrations need to land on the hosted project.

- `supabase/migrations/20260503000000_audit_events.sql` — audit_events table + RPCs (SOC-5)
- `supabase/migrations/20260503010000_db_linter_fixes.sql` — Supabase advisor remediation (search_path on touch_updated_at, anon revoke on authenticated-only RPCs, internal-only helpers)

Either order works.

**Path A — `db push` (preferred when network co-operates):**

```bash
cd /path/to/dragun
npx supabase db push
# enter your Supabase project password when prompted
```

If this hits `failed to receive message: timeout` (port 5432 egress blocked, project paused, or pooler flaky), use Path B.

**Path B — Dashboard SQL editor (network-independent):**

```bash
# WSL → Windows clipboard
cat supabase/migrations/20260503000000_audit_events.sql | clip.exe
# paste at https://supabase.com/dashboard/project/{ref}/sql/new and run
cat supabase/migrations/20260503010000_db_linter_fixes.sql | clip.exe
# paste and run
```

Verify after:

```sql
-- audit_events table exists with RLS
select count(*) from public.audit_events;
select policyname from pg_policies where tablename='audit_events';

-- linter fixes landed
select pg_get_functiondef('public.touch_updated_at'::regproc) ilike '%search_path%' as fixed;
-- re-run the dashboard linter; only the two accepted-risk warnings should remain
```

### 0.1 GitHub branch protection on `main`

**Why:** SOC-4 ships the CI workflow, but only repo admin can enforce branch protection. Required for CC8 (change management).

- [ ] GitHub → repo → **Settings → Branches → Add branch ruleset** for `main`
  - [ ] Require a pull request before merging
  - [ ] Require status check `ci` to pass (will appear once SOC-4 CI runs once)
  - [ ] Require linear history
  - [ ] Block force push
  - [ ] Block deletion
  - [ ] (Optional, founder-mode) Allow administrators to bypass — record overrides as audit evidence
- [ ] Screenshot the rule list → save to `docs/evidence/2026-Q2/branch-protection.png` (create the dir if needed)

### 0.2 Sentry project + DSN

**Why:** SOC-3 ships Sentry config that is DSN-conditional — code is inert until you provide the DSN.

- [ ] sentry.io → create project `dragun-web` (Next.js)
- [ ] Copy DSN → `NEXT_PUBLIC_SENTRY_DSN` (browser) and `SENTRY_DSN` (server) — same value
- [ ] In Sentry → Settings → Data Scrubbing → enable defaults; add custom rules to scrub `phone_e164`, `phone`, `payload`, `body`, `subject`
- [ ] Settings → Alerts → create rule "any unhandled exception in production" → email `security@dragun.app`
- [ ] Vercel → project envs → add `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` for **Production** and **Preview**
- [ ] Local dev: add to `.env.development.local` if you want to test (recommended) or skip (logs go nowhere, no error)

### 0.3 Logflare drain on Supabase

**Why:** Supabase log retention is short. SOC 2 CC4 needs ≥90 days for security events.

- [ ] logflare.app → create account → create source `dragun-supabase`
- [ ] Logflare → Sources → click source → copy the `source_id` and your `api_key`
- [ ] Supabase dashboard → Project → Logs → **Log Drains** → Add drain → choose Logflare → paste creds
- [ ] Set drain filter: include `auth`, `api`, `db`, `realtime` log streams
- [ ] (Optional) Vercel runtime logs → Vercel project → **Settings → Log Drains** → Add drain → Logflare → reuse creds
- [ ] Vercel envs (only needed if you ship logs from app code, not just Vercel infra): `LOGFLARE_API_KEY`, `LOGFLARE_SOURCE_ID`

### 0.4 Supabase auth hardening

**Why:** Supabase project defaults are looser than what we expose in our action layer; tighten at the source.

- [ ] Supabase → Project → Authentication → **Policies**
  - [ ] Set minimum password length to **12**
  - [ ] Enable **Leaked Password Protection** (HIBP)
  - [ ] (If MFA is on the roadmap) Enable **TOTP** — code already supports re-enrollment via Supabase JS SDK
- [ ] Authentication → **Email** → set rate limits: 5 sign-ins / 60s / IP, 3 sign-ups / hour / IP (matches what SOC-3 will enforce app-side)
- [ ] Authentication → **URL Configuration** → confirm `https://dragun.app/auth/callback` is the only allowed redirect

### 0.5 Vercel envs to add (one-time)

After SOC-3 ships its scaffolding, add to **Production** and **Preview** scopes:

| Var | Value | Required? |
|---|---|---|
| `SENTRY_DSN` | from 0.2 | recommended |
| `NEXT_PUBLIC_SENTRY_DSN` | from 0.2 | recommended |
| `LOGFLARE_API_KEY` | from 0.3 | optional (only if app-side log shipping) |
| `LOGFLARE_SOURCE_ID` | from 0.3 | optional |
| `LOG_LEVEL` | `info` (prod), `debug` (preview) | optional, defaults to `info` |

### 0.6 Vercel plan check

**Why:** Vercel Hobby caps log retention at 1 day and limits cron entries. SOC-3 + SOC-5 fit on Hobby (single cron, log drain via Logflare not Vercel-native), but enterprise prospects will ask.

- [ ] If the project is on Hobby and you have a paid customer in sight, upgrade to **Pro** (~$20/mo)
- [ ] After upgrade: Vercel → Settings → DPA → request signed DPA → save to `docs/evidence/dpas/vercel.pdf`
- [ ] Vercel → Settings → Firewall → enable basic rules (block known bad bots, rate-limit `/auth/*` paths)

---

## 1. Within two weeks of launch

### 1.1 HSTS preload submission

**Why:** SOC-2 ships the HSTS header with `preload` directive. Submission gets you onto Chromium's preload list (no first-connection downgrade window).

- [ ] Wait until HSTS has been live in production for ≥14 days (auditable via web archive)
- [ ] Verify locally: `curl -sI https://dragun.app | grep Strict-Transport` shows `max-age=63072000; includeSubDomains; preload`
- [ ] Submit `dragun.app` at https://hstspreload.org/
- [ ] Save confirmation email → `docs/evidence/2026-Q2/hsts-preload.eml`

### 1.2 Flip CSP from Report-Only → enforce

**Why:** SOC-2 ships CSP as `Content-Security-Policy-Report-Only`. After a week of clean (or expected-only) reports, flip it to enforce so we actually get the XSS protection.

- [ ] Review CSP reports in Sentry / Logflare for ≥7 days
- [ ] Identify any "real" violations (vs. framework noise) and either:
  - whitelist the source in the CSP, OR
  - fix the inline / unnonced script
- [ ] In `proxy.ts`, change header name from `Content-Security-Policy-Report-Only` → `Content-Security-Policy`
- [ ] Deploy, monitor, ready to roll back via Vercel rollback if anything blocks

### 1.3 Subprocessor DPAs

**Why:** SOC-6 ships the subprocessor register. Signed DPAs are the evidence behind it.

- [ ] **Supabase** — Settings → Legal → request DPA → sign → save PDF
- [ ] **Vercel** — Settings → DPA (Pro+) → sign → save PDF
- [ ] **Stripe** — Dashboard → Settings → Compliance & Documents → DPA → already signed by default, download
- [ ] **Resend** — Dashboard → Settings → Legal → request DPA → sign → save PDF
- [ ] **Twilio** — Console → Voice/Messaging → DPA → request → sign → save PDF
- [ ] **Sentry** — Settings → Legal & Compliance → DPA → download → sign
- [ ] **Logflare** — Settings → Legal → DPA → request

Save all in `docs/evidence/dpas/{vendor}.pdf` (gitignored if confidential).

### 1.4 Twilio production registration (10DLC / A2P)

**Why:** Marketing claim "10DLC registered" is currently softened to "in review" via SOC-1. Truth-up the copy when registration completes.

- [ ] Twilio Console → Messaging → A2P 10DLC → register Brand
- [ ] Register Campaign (use case: account notifications + customer service)
- [ ] Wait for carrier approval (1–4 weeks typical)
- [ ] On approval: edit `app/page.tsx` `compliance.items` 10DLC entry → flip tag back to `"Enregistré"` / `"Registered"`
- [ ] Save approval letter → `docs/evidence/2026-Q3/twilio-a2p-approval.pdf`

### 1.5 Engage SOC 2 Type I auditor

**Why:** Marketing claim "Type I in process" is currently softened to "Planned" via SOC-1. Engage an auditor to make it true.

- [ ] Get quotes from at least 2 auditors (Drata, Vanta, Strike Graph, Prescient, A-LIGN, Schellman)
- [ ] Sign engagement letter
- [ ] Auditor will issue a control matrix template — load into `docs/soc2-controls.md`
- [ ] Update `app/page.tsx` `compliance.items` SOC2 entry → tag `"En cours"` / `"In progress"` with auditor name footnote
- [ ] Begin observation period

---

## 2. Quarterly recurring

### 2.1 Key rotation

Set calendar reminders for the **first Monday of each quarter**:

- [ ] Rotate Stripe restricted-key (used by webhook only); test before deleting old
- [ ] Rotate Resend API key
- [ ] Rotate Twilio auth token
- [ ] Rotate Supabase service role key (only the secret one, NOT the publishable / anon)
- [ ] Rotate `CRON_SECRET`
- [ ] Sentry & Logflare auth tokens
- [ ] Document each rotation in `docs/evidence/{YYYY-QN}/key-rotations.md` with timestamps

### 2.2 Access review

**Why:** SOC 2 CC6 — quarterly access review of `org_members` and any GitHub / Vercel / Supabase team members.

- [ ] Run `select role, email from org_members m join auth.users u on u.id=m.user_id;` (or via the Activity page once SOC-5 is live)
- [ ] GitHub → Org / repo collaborators → review
- [ ] Vercel → Team members → review
- [ ] Supabase → Project members → review
- [ ] Remove anyone no longer needing access; document in `docs/evidence/{YYYY-QN}/access-review.md`

### 2.3 Vendor reassessment

- [ ] Re-read `docs/subprocessors.md` (lands in SOC-6)
- [ ] Confirm each vendor's SOC 2 / ISO link still resolves
- [ ] Re-read DPAs for any change clauses
- [ ] Update "last reviewed" date in subprocessors.md

### 2.4 DR / restore drill

**Why:** SOC 2 A1 (if availability is in scope later) and CC7 (operations).

- [ ] Trigger a Supabase point-in-time-recovery to a test branch
- [ ] Verify a known case + payment record restored intact
- [ ] Time the restore (target RTO < 4h)
- [ ] Document in `docs/evidence/{YYYY-QN}/dr-drill.md`

---

## 3. Annual

### 3.1 Policy refresh

- [ ] Re-read `docs/incident-response.md` — does the contact tree still match reality?
- [ ] Re-read privacy policy & terms — bump `last_revised` if anything material changed
- [ ] Re-read `docs/subprocessors.md` — anyone added or dropped?
- [ ] Sign off in `docs/evidence/{YYYY}/policy-review.md`

### 3.2 Penetration test

- [ ] Engage external pentest firm (NCC Group, Bishop Fox, Cure53, or smaller alternative)
- [ ] Scope: web app + API + auth flows
- [ ] Save report → `docs/evidence/{YYYY}/pentest.pdf`
- [ ] Triage findings into stories.md within 2 weeks of report

### 3.3 SOC 2 audit renewal

- [ ] If on Type I → assess whether to upgrade to Type II
- [ ] If on Type II → engage same auditor for renewal (typical 3-month lead time)

---

## 4. As-needed

### 4.1 Onboarding a new employee or contractor

- [ ] Sign acceptable use + confidentiality agreement before access
- [ ] Provision principle-of-least-privilege:
  - GitHub: write access on the repo, no admin
  - Vercel: developer role on the project
  - Supabase: project member, not owner
  - Sentry / Logflare: contributor
- [ ] Add to `docs/evidence/{YYYY-QN}/onboarding-{name}.md`
- [ ] Schedule 30-day access review

### 4.2 Offboarding

- [ ] Revoke GitHub access (remove from repo, rotate any keys they had access to)
- [ ] Revoke Vercel, Supabase, Sentry, Logflare seats
- [ ] If they had a Stripe role, remove
- [ ] Delete their `org_members` rows in any test orgs they own
- [ ] Document the offboarding within 24h in evidence dir

### 4.3 Incident detected

Follow `docs/incident-response.md` (lands in SOC-6). Do not improvise.

---

## Quick command reference

```bash
# Apply migrations to the linked hosted project
npx supabase db push

# Manual log drain test (after 0.3)
curl -X POST "https://api.logflare.app/logs/json?source=$LOGFLARE_SOURCE_ID" \
  -H "X-API-KEY: $LOGFLARE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"manops smoke test","metadata":{"manops":"0.3"}}'

# Verify HSTS + COOP + CORP after SOC-2 deploys
curl -sI https://dragun.app | grep -E 'Strict-Transport|Cross-Origin|Content-Security'

# Check audit log row exists after a settings change (SOC-5)
psql "$DATABASE_URL" -c "select action, target_type, created_at from public.audit_events order by created_at desc limit 5;"
```

---

## Crosswalk — what each manops item closes

| ManOps item | Closes |
|---|---|
| 0.1 Branch protection | CC3, CC8 |
| 0.2 Sentry DSN | CC4, CC7 |
| 0.3 Logflare drain | CC4, CC8 |
| 0.4 Supabase auth hardening | CC6 |
| 0.5 Vercel envs | (enables 0.2 + 0.3) |
| 0.6 Vercel Pro + DPA | CC9 |
| 1.1 HSTS preload | CC5 |
| 1.2 CSP enforce | CC5 |
| 1.3 DPAs | CC9 |
| 1.4 Twilio prod | CC2 (truth-up marketing), CC7 |
| 1.5 Auditor engagement | CC5 |
| 2.1 Key rotation | CC6 |
| 2.2 Access review | CC6 |
| 2.3 Vendor reassessment | CC9 |
| 2.4 DR drill | CC7 |
| 3.1 Policy refresh | CC1, CC2 |
| 3.2 Pentest | CC4, CC7 |
| 3.3 Audit renewal | CC5 |
| 4.* Personnel | CC1, CC6 |
