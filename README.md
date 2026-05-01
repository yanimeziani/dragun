# Dragun

Production SaaS for SMB debt recovery. Email, SMS, and voice
reminders on a 14-day cadence, fully bilingual (FR-CA / EN-CA),
Quebec-first. SMB owners sign up, onboard in 5 minutes, paste in
their delinquent list, and Dragun runs recovery in their brand
voice. We keep 5 % of recovered funds; nothing if nothing is
recovered.

## Surfaces

| Route                          | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `/`                            | Landing                                              |
| `/auth/{sign-in,sign-up,callback}` | Supabase auth (Google + email/password)        |
| `/welcome`                     | Onboarding wizard (creates `organizations` row)      |
| `/app`                         | Operator dashboard (KPIs + case list)                |
| `/app/cases/new`               | Single-case creation form                            |
| `/app/cases/import`            | Bulk CSV import (preview + commit)                    |
| `/app/cases/[id]`              | Case detail (timeline, cancel, mark paid)            |
| `/app/settings`                | Org name, locale, brand color, signature, payout     |
| `/p/[slug]`                    | Debtor pay link (Stripe Checkout)                    |
| `/p/[slug]/thanks`             | Post-payment confirmation                            |
| `/u/[debtorId]`                | Debtor unsubscribe (CASL / CAN-SPAM / TCPA)          |
| `/legal/{privacy,terms,disclosures}` | Bilingual legal docs                            |
| `/api/cron/cadence`            | Vercel cron — fires due `campaign_events` (every 5 min) |
| `/api/webhooks/stripe`         | Stripe Checkout / payment_intent reconciliation       |

## Stack

- Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4
- Supabase (Postgres + Auth + RLS + cookie sessions via `@supabase/ssr`)
- Stripe (Checkout, hand-rolled HMAC webhook verification — no SDK)
- Resend (transactional email — REST, no SDK)
- Twilio (SMS + voice with `<Say>` TwiML — REST, no SDK)
- Vercel (hosting + cron)

## Local development

```bash
npm install

# Bring up local Supabase (Docker required)
npm run db:start
npm run db:reset      # applies all migrations + seed

# Run the app
npm run dev           # http://localhost:3000
```

> WSL caveat: if `npm run dev` fails with an SWC bus error on a
> `/mnt/c/...` path, run from native Windows (PowerShell) or copy
> the project into the Linux filesystem.

## Environment variables

Drop these into your host (Vercel: Project → Settings → Environment
Variables) before deploying. Missing vars surface as runtime errors,
not silent skips — the production code paths assume real channels.

### Required for any deploy

| Name                                 | Purpose                                                          |
| ------------------------------------ | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase project URL                                             |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon / publishable key (RLS-scoped)                            |
| `SUPABASE_SERVICE_ROLE_KEY`          | Server-side admin key (cron, webhook, account-delete)            |
| `NEXT_PUBLIC_SITE_URL`               | Canonical site URL for absolute links (e.g. `https://dragun.app`) |
| `CRON_SECRET`                        | Bearer token for `/api/cron/cadence` (any 32+ char string)       |

### Required for actual sends + payments

| Name                                 | Purpose                                                          |
| ------------------------------------ | ---------------------------------------------------------------- |
| `RESEND_API_KEY`                     | Email sending                                                    |
| `RESEND_FROM_EMAIL`                  | Verified Resend sender (e.g. `Dragun <no-reply@dragun.app>`)     |
| `TWILIO_ACCOUNT_SID`                 | Twilio account                                                   |
| `TWILIO_AUTH_TOKEN`                  | Twilio auth                                                      |
| `TWILIO_FROM_NUMBER`                 | E.164 sender (e.g. `+14185550123`)                                |
| `STRIPE_SECRET_KEY`                  | Stripe Checkout                                                  |
| `STRIPE_WEBHOOK_SECRET`              | HMAC verification for `/api/webhooks/stripe`                     |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-visible Stripe key (kept for future client-side flows)    |

### Optional / legacy

| `LEAD_TO_EMAIL`                      | Where the legacy alpha form mailed leads (no longer used) |

## Database migrations

```bash
# Local
supabase db reset       # destroys local data, replays all migrations

# Production
supabase link --project-ref <ref>
supabase db push        # applies new migrations to the linked project
```

Migrations as of this writing (in `supabase/migrations/`):

- `20260430000000_init.sql` — `auth.users` triggers + `profiles` table
- `20260430120000_orgs_cases.sql` — multi-tenant schema, RLS, helpers
- `20260430130000_message_templates_seed.sql` — 14 bilingual templates
- `20260430140000_rls_fix.sql` — RLS recursion fix on `org_members`
- `20260430150000_settings_unsubscribe.sql` — settings RPC, opt-out, account delete

Apply in order. Re-running is safe (the seeds use `ON CONFLICT
DO UPDATE`; schema migrations use `if not exists` / `drop ...
if exists` patterns).

## Production deploy

```bash
# First time
vercel link
vercel env pull
# Set the env vars listed above in the Vercel dashboard
vercel --prod

# Subsequent deploys
git push origin main    # auto-deploys via Vercel git integration
```

Cron is registered in `vercel.json` — `/api/cron/cadence` fires
every 5 minutes. Confirm in Vercel → Project → Settings → Cron Jobs
after the first deploy.

## Cadence schedule

For every case created, 7 events are scheduled at the following
day-offsets (UTC; the cron tick-rate determines real send latency):

```
day  0  09:00 UTC — email-day-0     friendly reminder
day  3  09:00 UTC — email-day-3     nudge
day  5  14:00 UTC — sms-day-5       pay link with STOP opt-out
day  7  09:00 UTC — email-day-7     gentle reminder
day 10  14:00 UTC — sms-day-10      quiet-hours aware
day 12  13:00 UTC — call-day-12     voice <Say> in customer locale
day 12  13:05 UTC — sms-day-12      pay link after call
```

A debtor opt-out (`/u/[debtorId]`) cancels all remaining
`status='scheduled'` events for the case immediately. A successful
Stripe Checkout payment does the same and flips the case to
`status='paid'`.

## File map

```
app/
├─ layout.tsx                  root, fonts, metadata
├─ globals.css                 Tailwind + theme tokens
├─ page.tsx                    landing + investor sections
├─ icon.svg                    brand favicon
├─ opengraph-image.tsx         1200×630 OG image (edge)
├─ not-found.tsx               bilingual 404
├─ error.tsx                   client error boundary
├─ global-error.tsx            root error boundary
├─ robots.ts                   robots.txt generator
├─ sitemap.ts                  sitemap.xml generator
├─ middleware.ts (root)        Supabase session refresh
├─ _actions/
│  ├─ auth.ts                  signIn/signUp/signOut, OAuth
│  ├─ org.ts                   createOrganizationAction
│  ├─ settings.ts              updateOrgAction, deleteAccountAction
│  ├─ case.ts                  createCase, cancel, markPaid
│  ├─ import.ts                importCasesAction (CSV preview + commit)
│  ├─ unsubscribe.ts           unsubscribeAction
│  ├─ checkout.ts              startCheckoutAction
│  ├─ locale.ts                setLocaleAction
│  └─ lead.ts                  legacy alpha-form (no consumer left)
├─ _components/
│  ├─ auth-form.tsx            sign-in/sign-up form
│  ├─ google-button.tsx        OAuth button
│  ├─ locale-toggle.tsx        FR / EN switch
│  ├─ onboarding-form.tsx      /welcome form
│  ├─ settings-form.tsx        /app/settings form
│  ├─ case-form.tsx            /app/cases/new form
│  ├─ import-form.tsx          /app/cases/import form
│  └─ unsubscribe-form.tsx     /u/[debtorId] form
├─ _lib/
│  ├─ supabase/
│  │  ├─ client.ts             browser client
│  │  ├─ server.ts             server client (cookie-scoped)
│  │  ├─ service.ts            service-role client (cron, webhooks)
│  │  └─ middleware.ts         session refresh
│  ├─ i18n/{index,types,fr,en}.ts   locale system
│  ├─ resend.ts                sendEmail (REST)
│  ├─ twilio.ts                sendSms, placeCall (REST)
│  ├─ stripe.ts                createCheckoutSession + verifyWebhookSignature
│  └─ cadence.ts               scheduleCampaign, fireEvent, tickDueEvents
├─ auth/                       sign-in / sign-up / callback / shell
├─ welcome/                    onboarding wizard
├─ app/                        signed-in dashboard tree
│  ├─ layout.tsx               auth + membership guard
│  ├─ page.tsx                 dashboard
│  ├─ cases/{new,[id],import}/ case CRUD
│  └─ settings/                org settings + account delete
├─ p/[slug]/                   debtor pay link
├─ u/[debtorId]/               debtor unsubscribe
├─ legal/{privacy,terms,disclosures}/  bilingual legal
└─ api/
   ├─ cron/cadence/route.ts
   └─ webhooks/stripe/route.ts

supabase/
├─ config.toml                 local stack ports 54340–54349
├─ migrations/                 ordered SQL files
└─ seed.sql                    local-only Yani user

docs/
├─ README.md                   spec index
├─ product.md                  product spec
├─ architecture.md             architecture spec
├─ stories.md                  build slices S0..S19
├─ runbook.md                  launch-day runbook
└─ loop.md                     autonomous build loop spec
```

## Customer journey

1. Visitor lands on `/`, clicks **Start free**.
2. Signs up at `/auth/sign-up` (Google or email).
3. Lands on `/welcome`, names their business, picks default locale,
   submits → `create_organization` RPC inserts org + owner membership
   atomically.
4. Lands on `/app` — empty dashboard with the three-step quick-start.
5. Clicks **Add a case** (single) or **Import** (CSV). Either path
   inserts `cases` + `debtors` + 7 `campaign_events` rows.
6. The Vercel cron tick fires `/api/cron/cadence` every 5 min,
   sends due emails / SMS / calls, writes back provider IDs.
7. Debtor receives a branded email with a pay link → `/p/[slug]`
   → Stripe Checkout → success → `/p/[slug]/thanks`.
8. The Stripe webhook (`/api/webhooks/stripe`) verifies the HMAC
   signature, inserts a `payments` row with the 5 % fee computed
   from `organizations.fee_bps`, cancels remaining events, flips
   the case to `paid`.
9. Owner sees the recovered total in `/app`'s KPI strip.

## Compliance baked in

- **CASL / CAN-SPAM / TCPA**: every email carries an unsubscribe link
  (`/u/[debtorId]`); SMS carries `Reply STOP` in the first message;
  voice scripts default to local business-hour windows.
- **Law 25 (Quebec)**: account deletion is immediate and cascades
  through orgs / cases / debtors / events / payments, plus
  `auth.users`. Privacy policy details rights and authorities.
- **GDPR / UK GDPR / CCPA**: covered in the privacy doc with the
  legal-bases breakdown, transfer mechanism (SCCs + UK IDTA + Swiss
  addendum), and complaint authorities.
- **Bilingual (Bill 96)**: French is canonical on legal pages; the
  whole product is FR / EN cookie-toggled.

## Operating notes

- Failed sends are logged in `campaign_events.status='failed'` with
  the error in `payload.error`. No retry today — manual triage via
  `/app/cases/[id]`.
- The cron runs every 5 min; latency between scheduled time and
  actual send is bounded by that interval.
- Twilio trial accounts can only send to verified destinations.
  Production sends to arbitrary Canadian numbers require 10DLC
  carrier registration (~1–4 weeks).
- Stripe is in test mode by default; swap `STRIPE_SECRET_KEY` and
  `STRIPE_WEBHOOK_SECRET` to live keys when ready.
- For the first cohort of customers, settlement is manual (Interac
  / wire). Stripe Connect Express integration is in the v2 backlog.
