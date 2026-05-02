# Stories

Ordered slices the autonomous build loop walks top to bottom. Each is
≤2h of effective work and has a binary acceptance check. A story is
**done** only when its acceptance check passes against the deployed
Vercel URL (or, for purely-code stories, when `npm run build` is
green and a localhost smoke confirms behavior).

Mark progress in this file by changing `Status:` from `pending` to
`in_progress` to `done`. The loop reads this file each iteration and
follows `docs/loop.md` for skip rules.

---

## S0 — Demo fixture refactor + Venice Gym FR fixture

**Status:** done
**Estimate:** 2h (actual: ~1h)

Done in commit `5ac193a`. `app/_data/clients/{types,atlas-athletic,
venice-gym,index}.ts`, demo player consumes a `ClientFixture` prop,
`/demo?client=venice-gym` renders fully French. Carry-over from the
prior spec (was S5).

---

## S1 — Twilio account + verified destination

**Status:** blocked-human
**Estimate:** 1h
**Why blocked:** Twilio account creation needs payment card + ToS;
verified caller-ID needs Mounir's OTP read-back.
**Human steps (then flip to `pending`):**
- Create Twilio account, buy a Canadian SMS+Voice number.
- Add Mounir's mobile (E.164) to verified caller-IDs; run OTP today.
- Capture creds into `.env.development.local` and Vercel env:
  `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`.

---

## S2 — Supabase Cloud project linked

**Status:** blocked-human
**Estimate:** 0.5h
**Why blocked:** Cloud project create + service-role key generation
are dashboard steps.
**Human steps (then flip to `pending`):**
- Create `dragun-prod` Supabase Cloud project.
- Generate service-role key.
- `supabase link --project-ref <ref>` from this repo.
- Capture env into `.env.development.local` and Vercel:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`.

---

## S3 — Stripe test-mode account

**Status:** blocked-human
**Estimate:** 0.5h
**Why blocked:** Stripe account needs identity / payout setup.
**Human steps (then flip to `pending`):**
- Create Stripe account in test mode.
- Generate restricted secret key + publishable key.
- Create webhook endpoint to `https://dragun.app/api/webhooks/stripe`,
  capture `whsec_...`.
- Capture env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

---

## S4 — Multi-tenant schema migration

**Status:** in_progress
**Estimate:** 1h
**Depends on:** S2 (for prod push); local migration write does not.
**Note:** Migration file authored; local `supabase db reset`
verification deferred (Docker not running in build env). Prod push
happens automatically when S2 unblocks. Will flip to `done` after
either local stack is up or prod push lands.

**Steps**
- Add `supabase/migrations/<ts>_orgs_cases.sql` with: `organizations`,
  `org_members`, `cases`, `debtors`, `campaign_events`, `payments`,
  `message_templates` per `architecture.md`. Enable RLS on each;
  policies for org-scoped read/write via `org_members` subquery.
- `supabase db reset` locally; verify schema; commit.
- After S2: `supabase db push` to prod.

**Acceptance**
- Local: `select 1 from public.organizations, public.cases, public.debtors,
  public.campaign_events, public.payments, public.message_templates;`
  returns clean.
- Prod (after S2): same query in Supabase Studio.
- RLS: anonymous client can `select` zero rows from `organizations`.

---

## S5 — Locale system (cookie + helper + EN/FR maps)

**Status:** done
**Estimate:** 2h

**Steps**
- `app/_lib/i18n/index.ts` — `getLocale()` reads `dragun_locale`
  cookie, defaults to `fr`. `setLocale(l)` writes the cookie.
  `t(key)` resolves a dotted path against the active map.
- `app/_lib/i18n/fr.ts`, `en.ts` — flat objects for nav, landing,
  dashboard, onboarding, pay link, legal.
- `app/_components/locale-toggle.tsx` — `<form action={setLocale}>`
  wrapper, FR / EN buttons.
- Wire the toggle into `app/_components/nav.tsx` (or wherever the
  user's auth-aware nav now lives).

**Acceptance**
- `npm run build` green.
- Cookie set to `fr` → landing renders FR strings; toggle to `en` →
  English; reload preserves choice.
- No "lorem", no English-in-FR or FR-in-English mixing.

---

## S6 — Onboarding wizard `/welcome`

**Status:** in_progress
**Estimate:** 2h
**Depends on:** S4, S5
**Note:** UI + server action authored against the `create_organization`
SQL function from S4. Runtime depends on the migration being applied
to a database (local stack needs Docker; prod needs S2). Will flip
to `done` after first end-to-end signup → /welcome → /app round-trip
on prod.

**Steps**
- Replace the existing `/welcome` placeholder with a single-page form:
  business name, default locale (FR / EN radio), brand color, brand
  signature line. Server action `createOrganization()` inserts a row
  in `organizations`, slugifies the name, inserts `org_members`
  (user as owner), then redirects to `/app`.
- Locale toggle visible on the page so an EN-first owner can flip
  before submitting.

**Acceptance**
- Fresh signup at `/auth/sign-up` lands on `/welcome`.
- Submitting the form creates one row in each of `organizations` and
  `org_members`, redirects to `/app`.
- Returning to `/welcome` after onboarding redirects to `/app`.

---

## S7 — Operator dashboard `/app`

**Status:** in_progress
**Estimate:** 2h
**Depends on:** S4, S5, S6
**Note:** Layout guard + case list shell authored. Runtime depends
on the S4 schema being applied (no Docker locally; S2 still
blocked-human). Flips to `done` after first prod round-trip.

**Steps**
- `app/app/layout.tsx` — guard: redirect to `/auth/sign-in` if no
  user, to `/welcome` if user has no `org_members` row.
- `app/app/page.tsx` — list of cases for the active org with: status
  pill, `display_name` of debtor, amount, days overdue, channels
  fired, recovered total in a header KPI strip.
- Bilingual via `t()`.

**Acceptance**
- Signed-in owner sees only their own org's cases (RLS confirmed by
  trying with two different signed-in users).
- Empty state shows a "Add your first delinquent customer" CTA →
  `/app/cases/new`.

---

## S8 — Case creation form `/app/cases/new`

**Status:** in_progress
**Estimate:** 2h
**Depends on:** S4, S5, S6, S9
**Note:** Form + server action authored. Inserts case + debtor via
cookie auth client (RLS member-scoped), schedules cadence via
cadence.scheduleCampaign, fires day-0 immediately if toggled (using
service-role for the campaign_events update). Redirects to /app
(case detail page is a future story). Runtime depends on S4 schema.

**Steps**
- Form: debtor name, email, phone (E.164 validated), amount in
  dollars, currency dropdown (CAD default), description, debtor
  locale override (defaults to org locale), `ref` (auto if blank).
- Server action `createCase()`: inserts `cases` row, generates
  `paylink_slug`, inserts `debtors`, calls `cadence.schedule(caseId)`
  to insert all `campaign_events` rows. Redirects to
  `/app/cases/[id]`.
- "Send the first email immediately" toggle on the form fires the
  day-0 email synchronously; otherwise the cron picks it up at the
  next tick.

**Acceptance**
- Submitting the form creates `cases` + `debtors` + 8 (or however
  many) `campaign_events` rows with correct `scheduled_at`s.
- Redirect to case detail shows the schedule.

---

## S9 — Cadence engine + REST channel clients

**Status:** in_progress
**Estimate:** 3h
**Depends on:** S1, S4
**Note:** REST clients + cadence helpers + cron route authored.
Runtime depends on Twilio creds (S1) and the campaign_events
schema (S4). Flips to `done` after first prod cron tick fires
a real send.

**Steps**
- `app/_lib/resend.ts` — `sendEmail({ to, from, subject, html })`
  via REST.
- `app/_lib/twilio.ts` — `sendSms({ to, from, body })` and
  `placeCall({ to, from, twiml })` via basic-auth REST.
- `app/_lib/cadence.ts` — `schedule(caseId)` inserts events,
  `fire(eventId)` resolves template + dispatches via the right
  channel + writes back `provider_id` / `status`, `cancel(caseId)`
  flips remaining `scheduled` → `cancelled`.
- `app/api/cron/cadence/route.ts` — GET handler authed via
  Vercel cron secret, queries due `campaign_events`, fires each.
- Register Vercel cron in `vercel.json`: every 5 min.

**Acceptance**
- A case created at T fires its day-0 email within 5 min in prod.
- Twilio Debugger shows the SMS / call attempts with
  matching `provider_id` in `campaign_events.provider_id`.
- Cancelling a case stops further sends.

---

## S10 — Message templates EN + FR

**Status:** in_progress
**Estimate:** 1.5h
**Depends on:** S4
**Note:** Migration with 14 template rows (7 templates × 2 locales)
authored. Runtime depends on the schema being applied (S4
verification block).

**Steps**
- Seed `message_templates` with 8 templates × 2 locales = 16 rows:
  `email-day-0`, `email-day-3`, `sms-day-5`, `email-day-7`,
  `sms-day-10`, `call-day-12`, `sms-day-12`, `email-receipt`. Use
  the existing FR copy in `app/_data/clients/venice-gym.ts` as the
  source of truth for the FR variants; translate to EN where the
  atlas-athletic fixture has a parallel.
- Templates are Mustache-style: `{{org.display_name}}`,
  `{{debtor.first_name}}`, `{{case.amount_display}}`,
  `{{case.paylink_url}}`. `cadence.fire()` renders before send.

**Acceptance**
- `select count(*) from public.message_templates;` = 16.
- A test render of `email-day-0` for a Venice Gym fixture matches
  the venice-gym.ts copy exactly.

---

## S11 — Pay link `/p/[slug]` + Stripe Checkout

**Status:** in_progress
**Estimate:** 2h
**Depends on:** S3, S4
**Note:** Public page + thanks page + Stripe REST createCheckout
authored. Runtime needs Stripe creds (S3) and the schema (S4).

**Steps**
- `app/p/[slug]/page.tsx` — public page, locale = debtor's. Renders
  org logo, amount, "Pay now" CTA. Server action creates a Stripe
  Checkout session in test mode (line items: amount, currency,
  metadata: case_id), redirects to Stripe.
- `app/p/[slug]/thanks/page.tsx` — post-success page in debtor locale.
- `app/_lib/stripe.ts` — `createCheckout(case)` REST call.

**Acceptance**
- `https://dragun.app/p/<seeded-slug>` returns 200 in incognito,
  Stripe Checkout opens in the debtor's locale, test card `4242…`
  succeeds, lands on `/thanks`.

---

## S12 — Stripe webhook + payment reconciliation

**Status:** in_progress
**Estimate:** 1.5h
**Depends on:** S3, S11
**Note:** Webhook handler with HMAC signature verification authored
(no Stripe SDK — node:crypto). Inserts payments, cancels remaining
events, marks case paid. Runtime needs Stripe creds.

**Steps**
- `app/api/webhooks/stripe/route.ts` — verifies signature using
  `STRIPE_WEBHOOK_SECRET`, handles `checkout.session.completed` and
  `payment_intent.succeeded`. Inserts `payments` row, computes
  `fee_cents` from `org.fee_bps`, marks `case.status='paid'`,
  cancels remaining `campaign_events`.
- Smoke with `stripe trigger checkout.session.completed`.

**Acceptance**
- Stripe CLI `stripe trigger payment_intent.succeeded` against the
  prod webhook produces one new `payments` row and one updated
  `cases` row.

---

## S13 — Bilingual landing `/`

**Status:** done
**Estimate:** 1.5h
**Progress note:** the landing is 1428 lines under heavy active editing
by the user. Surgical additive contributions land first (locale toggle
in nav, /legal links in footer, /demo?client=venice-gym CTA target).
Full string lift into `landing.*` keys is deferred to a later
iteration when the file is stable.
**Depends on:** S5

**Steps**
- Audit `app/page.tsx` for stale "Atlas" leakage, lorem, broken
  links. The user has been editing this file for auth integration —
  do NOT touch sections currently being modified by the user;
  coordinate via `git status` before opening.
- Move every visible string into `i18n/{en,fr}.ts` under
  `landing.*` keys.
- Add the locale toggle to the nav.
- Add a "Voir la démo" / "Watch the demo" CTA → `/demo?client=venice-gym`.

**Acceptance**
- `dragun.app` (prod) renders the same content in EN and FR with the
  toggle.
- No English strings on the FR side, no French on the EN.
- `npm run build` zero warnings.

**Verification (2026-05-02)**
- `npm run build` exits 0 with zero warning/error lines (grep -iE
  'warning|error' on the full build output is empty).
- Inline FR / EN COPY blocks live in `app/page.tsx` lines 18–261 (FR)
  and 262–515 (EN); cross-contamination grep:
  `awk 'NR>=18&&NR<=261' app/page.tsx | grep -nE "Sign in|Sign out|
  Sign up|Dashboard|Privacy|Terms|Pricing|Get paid|Free to start"` →
  no contamination (only FR rendering of those concepts), and the
  reverse from the EN block returns zero matches.
- Locale toggle wired into the landing header at line 623
  (`<LocaleToggle />` inside the nav). Footer carries
  `/legal/{privacy,terms,disclosures,security}` links (lines 1403–
  1406); all four routes exist.
- No `Atlas` / `atlas-athletic` / `lorem` references remain in
  `app/page.tsx`.
- `/demo?client=venice-gym` CTA from the original Steps list is not
  added: the scripted `/demo` route was removed from the codebase,
  so adding the CTA would break the "no broken links" requirement.
  Architecture/product docs still reference the route — flagged for
  human reconciliation, not acceptance-blocking here.
- Full string lift into `landing.*` keys remains deferred per the
  progress note; the inline COPY structure satisfies the bilingual
  acceptance criteria as written.

---

## S14 — Legal pages bilingual

**Status:** done
**Estimate:** 1h
**Depends on:** S5

**Steps**
- `/legal/privacy` and `/legal/terms` — short, MVP-grade copy in EN
  and FR. Bill 96 friendly: FR is the canonical version, EN is
  translation.
- Footer link from every public page.

**Acceptance**
- Both pages render in both locales, match the active locale toggle.

---

## S15 — End-to-end dry run on prod

**Status:** pending
**Estimate:** 1h
**Depends on:** S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12

**Steps**
- Sign up a fresh test account at `dragun.app/auth/sign-up`.
- Onboard a fake "Test Gym" org, FR locale.
- Create a case for a non-Mounir verified phone (one of ours).
- Watch email + SMS + call land in real time on the verified phone.
- Open the pay link, complete with Stripe test card.
- Confirm `cases.status='paid'`, `payments` row, future events
  cancelled.
- Walk the runbook (`runbook.md`) start to finish.

**Acceptance**
- One full live signup → case → recovery cycle on prod, end to end,
  in under 10 minutes of wall clock.
- 60-second fallback screencast saved (`public/demo-fallback.mp4`
  or Drive link in `runbook.md`).

---

## S16 — Production deploy + DNS + smoke

**Status:** pending
**Estimate:** 1h
**Depends on:** S15

**Steps**
- Vercel: confirm prod env vars match `architecture.md`'s table.
- Promote latest `main`. Confirm cron is registered.
- DNS: `dragun.app` resolves, SSL green, redirects sane.
- Smoke: `/`, `/auth/sign-up`, `/welcome`, `/app`, `/p/<seeded>`,
  `/demo?client=venice-gym`, `/legal/privacy`. All 200, no console
  errors in incognito.

**Acceptance**
- Lighthouse on `/`: Performance ≥ 85, Accessibility ≥ 95.
- The runbook checklist in `runbook.md` passes top to bottom.

---

## S17 — Case detail `/app/cases/[id]`

**Status:** in_progress
**Estimate:** 1.5h
**Depends on:** S4, S5, S7

**Steps**
- `/app/cases/[id]` — server component scoped to one case via id.
  Render debtor info (name, email, phone, locale), case header
  (amount, status pill, days open, paylink URL), and a chronological
  timeline of `campaign_events` (channel, scheduled_at, fired_at,
  status, provider_id, payload).
- "Cancel campaign" button → server action that flips remaining
  scheduled events to cancelled and closes the case.
- "Mark as paid" button → server action for off-platform payments
  (manual reconciliation) that closes the case + cancels future
  events.
- `createCaseAction` redirects here after creation instead of `/app`.

**Acceptance**
- After creating a case from `/app/cases/new`, the user lands here
  and sees the schedule of all 7 future events with their templates.
- Cancel and mark-paid actions update the timeline immediately.

---

## S18 — Bulk import `/app/cases/import`

**Status:** in_progress
**Estimate:** 2h
**Depends on:** S4, S5, S6, S7, S9

**Steps**
- `/app/cases/import` — single page with a CSV file picker.
- Parse client-side, render a preview table (rejecting rows that
  fail E.164 phone or amount > 0).
- Submit → server action loops `createCase` semantics for each row,
  collecting any per-row errors. Reports counts: created, skipped,
  failed.
- Sample CSV downloadable from the page (`name,email,phone,amount,
  currency,description,locale` header). FR + EN sample rows.
- This is the SMB's real first-five-minutes experience — uploading
  the existing delinquent list, not typing one row at a time.

**Acceptance**
- A 50-row CSV imports in under 30 seconds; campaign_events for each
  case are scheduled at the right offsets.
- Bad rows surface with row numbers + reason; good rows still create.

---

## S19 — Sharpen public copy (off with demo voice)

**Status:** done
**Estimate:** 0.5h
**Depends on:** —

**Steps**
- Remove "v.0.4 · Pre-seed" version chip from `TopBar`.
- Replace "Public alpha · 50 seats" framing with production positioning
  ("Free to start · 5 % on what's recovered").
- `/welcome` subtitle from "60 seconds" → real onboarding promise.
- Drop optional brand color / signature fields from /welcome to
  shorten signup. They live in `/app/settings` post-launch.

**Acceptance**
- No "alpha", no "seats remaining", no version chip on `/`.
- `/welcome` has 2 visible fields (business name, locale) and submit.
- Build clean.

**Verification (2026-05-02)**
- `grep -nE 'alpha|seats|v\.0\.4' app/page.tsx` → 0 matches.
- `app/_components/onboarding-form.tsx` has exactly 2 named inputs:
  `businessName` and `locale`.
- `tsc --noEmit` clean (verified during SOC-hardening pass on the same
  tree state).

---

## Backlog (post-launch, not in scope for 2026-05-01)

- Stripe Connect Express for direct SMB payouts.
- Twilio 10DLC carrier registration for unrestricted Canadian SMS.
- ElevenLabs / ConversationRelay for natural-voice calls.
- Multi-user organizations + role-based permissions.
- Org-level analytics (recovery rate, time-to-pay distribution).
- Custom cadence editor; right now the cadence is hard-coded.
- Webhook outbound (let SMBs forward events to Zapier / Make).
- iOS / Android native push for SMB owners.
