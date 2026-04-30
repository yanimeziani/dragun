# Stories

Ordered slices the autonomous build loop walks top to bottom. Each is
≤2h of effective work and has a binary acceptance check. A story is
**done** only when the acceptance check passes on the deployed Vercel
URL, not localhost.

Mark progress in this file by changing `Status:` from `pending` to
`in_progress` to `done`. The loop reads this file each iteration.

---

## S1 — Twilio account, number, verified caller-ID

**Status:** blocked-human
**Estimate:** 1h
**Why blocked:** Twilio account creation requires manual signup
(payment card, ToS). Verifying Mounir's caller-ID requires him to
read back an OTP. The autonomous loop must skip this story.
**Human steps (do these by hand, then flip Status to `pending`):**
- Create Twilio account, buy a Canadian SMS+Voice number.
- Add Mounir's mobile (from contacts) as a verified caller-ID.
- Capture `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
  into `.env.development.local` and Vercel project env (Production
  + Preview).

**Steps**
- Create Twilio account (or log in to existing).
- Buy one Canadian phone number capable of SMS + Voice.
- Add Mounir's mobile as a verified caller-ID.
- Capture `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
  into Vercel project env (Production + Preview).

**Acceptance**
- `curl -u $SID:$TOKEN https://api.twilio.com/2010-04-01/Accounts/$SID.json` returns 200.
- A manual test SMS from the Twilio console lands on Mounir's phone.

---

## S2 — Supabase Cloud project + migrations applied

**Status:** blocked-human
**Estimate:** 1h
**Why blocked:** Supabase Cloud project creation and service-role
key generation require manual dashboard steps. The autonomous loop
must skip this story.
**Human steps (do these by hand, then flip Status to `pending`):**
- Create Supabase Cloud project `dragun-prod`.
- Generate a service-role key.
- Capture `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  into `.env.development.local` and Vercel env.
- `supabase link --project-ref ...` so `supabase db push` works.

**Steps**
- Create Supabase Cloud project `dragun-prod` (region: `us-east-1` or
  `ca-central-1` if available).
- Generate a service-role key.
- Capture `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  into Vercel env.
- `supabase link --project-ref ...` then `supabase db push`.

**Acceptance**
- Tables `clients`, `cases`, `debtors`, `channel_events` visible in
  Supabase Studio for the prod project.
- `select * from public.clients;` returns 0 rows (no errors).

---

## S3 — Schema migration

**Status:** pending
**Estimate:** 1h
**Depends on:** S2

**Steps**
- Add `supabase/migrations/<ts>_initial.sql` containing the four
  tables in `architecture.md` plus row-level-security enabled.
- `supabase db reset` locally; verify schema; commit.
- Apply to prod via `supabase db push`.

**Acceptance**
- `\d public.cases` in local psql matches the spec.
- `supabase db diff` against prod shows no drift after push.

---

## S4 — Resend + Twilio thin REST clients

**Status:** pending
**Estimate:** 2h

**Steps**
- `app/_lib/resend.ts` — `sendEmail({ to, from, subject, html })`
  using `fetch('https://api.resend.com/emails')`.
- `app/_lib/twilio.ts` — `sendSms({ to, from, body })` and
  `placeCall({ to, from, twiml })` using basic-auth `fetch` to the
  Twilio REST API. No SDK.
- `app/_lib/supabase.ts` — server-side service-role client factory.
- Server actions `_actions/send-email.ts`, `_actions/send-sms.ts`,
  `_actions/place-call.ts` that wrap the lib calls and write a
  `channel_events` row per attempt.

**Acceptance**
- A Node script invoking `sendSms` with the Vercel env vars delivers
  to the verified number and inserts one `channel_events` row with
  `status='queued'`.

---

## S5 — Client fixture module + Venice Gym data

**Status:** in_progress
**Estimate:** 2h

**Steps**
- Move the existing Atlas Athletic data out of `_demo.tsx` into
  `app/_data/clients/atlas-athletic.ts`. The component reads from a
  shared fixture interface.
- Add `app/_data/clients/venice-gym.ts` with: brand colors, logo
  reference, French locale strings, a Quebec-realistic delinquent
  member (e.g., "Jean-François Tremblay, 89,00 $ CAD, 18 jours en
  retard"), and a 14-day campaign timeline in French.
- Add `app/_data/clients/index.ts` mapping slug → fixture.

**Acceptance**
- `/demo?client=atlas-athletic` renders identically to today's `/demo`.
- `/demo?client=venice-gym` renders the entire UI in French with
  Venice Gym branding and no Atlas Athletic strings anywhere on the page.

---

## S6 — Live mode wiring

**Status:** pending
**Estimate:** 2h
**Depends on:** S4, S5

**Steps**
- `/demo?client=<slug>&live=1&phone=<e164>` reads the phone param and
  validates it's E.164.
- On scrubber play, the timeline events trigger the matching server
  actions in real time (not the scripted 16× replay — true wall-clock
  pacing or compressed-but-real, your call).
- Each send writes a `channel_events` row; the operator pane reads
  those rows so the on-screen "Transmission feed" is sourced from the
  database, not the script.
- An emergency "stop sends" button kills the campaign mid-flight.

**Acceptance**
- `/demo?client=venice-gym&live=1&phone=<verified>` on the Vercel
  prod URL delivers, in order, one email + one SMS + one outbound
  call to that phone. All three render in the on-screen feed.

---

## S7 — Investor copy pass on `/`

**Status:** pending
**Estimate:** 1h

**Steps**
- Audit `app/page.tsx` for stale "Atlas" leakage, Lorem, broken
  internal links, missing alt text, contrast misses.
- Tighten the headline + sub. Confirm the live counter still ticks
  (it was deleted from `_components/` — see git status; either restore
  or remove all references).
- Add a "Watch the demo" CTA that deep-links to
  `/demo?client=venice-gym` (scripted, not live).

**Acceptance**
- `npm run build` passes with zero warnings.
- Manual scroll-through on the Vercel prod URL: no broken images,
  no console errors, no English/French mixing in the gym section.

---

## S8 — End-to-end dry run

**Status:** pending
**Estimate:** 1h
**Depends on:** S1..S7

**Steps**
- Run the live demo flow against a non-Mounir verified phone (one of
  ours) on Vercel prod.
- Walk the runbook (`runbook.md`) start to finish, time it, capture
  any breakage in this file as a new story.
- Record a 60-second fallback screencast of the successful run.

**Acceptance**
- One full live run with email + SMS + call delivered, all three
  showing in the `channel_events` table with `status='delivered'` or
  `status='sent'`.
- Fallback video saved to `public/demo-fallback.mp4` (gitignored if
  large; keep a Drive/S3 link in `runbook.md`).

---

## S9 — Production deploy + smoke

**Status:** pending
**Estimate:** 1h
**Depends on:** S8

**Steps**
- Verify Vercel prod env vars match the architecture-doc table.
- Promote latest `main` to production.
- DNS: confirm `dragun.app` resolves and SSL is green.
- Smoke: hit `/`, `/demo`, `/demo?client=venice-gym`, the lead form.

**Acceptance**
- All four URLs return 200 with no console errors in a fresh
  incognito window.
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95.
- The day-of runbook checklist (`runbook.md`) passes top to bottom.
