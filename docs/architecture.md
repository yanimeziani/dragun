# Architecture

## Surfaces

| Route                          | Purpose                                                              | Auth | Render |
| ------------------------------ | -------------------------------------------------------------------- | ---- | ------ |
| `/`                            | Bilingual landing + investor pitch                                    | none | Static |
| `/auth/sign-in`                | Email + Google sign-in                                                | none | Server |
| `/auth/sign-up`                | New account                                                           | none | Server |
| `/auth/callback`               | Supabase OAuth callback                                               | none | Server |
| `/welcome`                     | Onboarding wizard — business name, locale, brand                      | user | Server |
| `/app`                         | Operator dashboard — case list, KPIs                                  | org  | Server |
| `/app/cases/new`               | Form: create a case + debtor + start cadence                          | org  | Server |
| `/app/cases/[id]`              | Case detail — timeline, channel events, status                        | org  | Server |
| `/app/settings`                | Org settings — brand, locale, signature, billing email                | org  | Server |
| `/p/[slug]`                    | Debtor-facing pay page (Stripe Checkout)                              | none | Server |
| `/p/[slug]/thanks`             | Post-payment confirmation in debtor locale                            | none | Static |
| `/legal/privacy`               | Bilingual privacy policy                                              | none | Static |
| `/legal/terms`                 | Bilingual terms of service                                            | none | Static |
| `/api/cron/cadence`            | Vercel cron — advances open campaigns                                 | cron | Edge   |
| `/api/webhooks/stripe`         | Stripe Checkout / Connect events                                      | sig  | Server |
| `/api/webhooks/twilio/status`  | Twilio delivery callbacks                                             | sig  | Server |

`org` auth = signed-in user with at least one row in `org_members`.

## Third-party deps

Four vendors. No more.

| Vendor   | Purpose                              | Required env vars                                                                  |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| Supabase | Postgres, auth, RLS                   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Resend   | Transactional email                   | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_TO_EMAIL`                              |
| Twilio   | SMS + outbound voice (`<Say>`)        | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`                     |
| Stripe   | Pay link Checkout + webhook signature | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  |

ElevenLabs deferred. Stripe Connect Express deferred (manual SMB
payouts for first cohort). No analytics SDK.

## Data model (Postgres / Supabase)

Auth + profiles already present (user's S0 work). Add:

```sql
-- Each SMB account
create table public.organizations (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  display_name    text not null,
  locale          text not null default 'fr',     -- 'fr' | 'en'
  brand           jsonb not null default '{}',     -- { color, signature, logo_url }
  fee_bps         integer not null default 500,    -- 5 % flat
  payout_email    text,                            -- for manual reconciliation
  stripe_account_id text,                          -- v2: Connect Express
  created_at      timestamptz default now()
);

-- Owners + future invitees
create table public.org_members (
  org_id   uuid references public.organizations on delete cascade,
  user_id  uuid references auth.users on delete cascade,
  role     text not null default 'owner',          -- 'owner' | 'staff' (v2)
  created_at timestamptz default now(),
  primary key (org_id, user_id)
);

-- One delinquent invoice
create table public.cases (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations on delete cascade,
  ref             text not null,                   -- 'DR-1042' or owner-defined
  amount_cents    integer not null,
  currency        text not null default 'CAD',
  description     text,                            -- 'Cotisation avril'
  paylink_slug    text unique not null,            -- '/p/<slug>'
  status          text not null default 'open',    -- 'open' | 'paid' | 'closed' | 'handoff'
  opened_at       timestamptz default now(),
  closed_at       timestamptz,
  unique (org_id, ref)
);

-- The person who owes
create table public.debtors (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases on delete cascade,
  full_name   text not null,
  email       text,
  phone_e164  text,
  locale      text,                                -- override; null = org default
  created_at  timestamptz default now()
);

-- Each scheduled or fired send
create table public.campaign_events (
  id            uuid primary key default gen_random_uuid(),
  case_id       uuid not null references public.cases on delete cascade,
  template_id   text not null,                     -- 'email-1' | 'sms-1' | 'call-day12'
  channel       text not null,                     -- 'email' | 'sms' | 'call'
  scheduled_at  timestamptz not null,
  fired_at      timestamptz,
  status        text not null default 'scheduled', -- 'scheduled' | 'sent' | 'delivered' | 'opened' | 'failed' | 'cancelled'
  provider_id   text,                              -- Resend message id / Twilio sid
  payload       jsonb not null default '{}',
  created_at    timestamptz default now()
);

-- Stripe Checkout outcomes
create table public.payments (
  id                       uuid primary key default gen_random_uuid(),
  case_id                  uuid not null references public.cases on delete cascade,
  amount_cents             integer not null,
  currency                 text not null,
  fee_cents                integer not null,           -- amount_cents * fee_bps / 10000
  net_to_org_cents         integer not null,           -- amount_cents - fee_cents
  stripe_payment_intent_id text unique,
  status                   text not null,              -- 'pending' | 'succeeded' | 'failed' | 'refunded'
  paid_at                  timestamptz,
  created_at               timestamptz default now()
);

-- Localized message bodies
create table public.message_templates (
  id        text not null,                          -- 'email-day-0', 'sms-day-5', 'call-day-12'
  locale    text not null,                          -- 'fr' | 'en'
  subject   text,                                   -- email only
  body      text not null,
  primary key (id, locale)
);
```

**Row-level security:** every table above carries an `org_id` (directly
or via a `case_id` join). Policies allow read/write only when
`org_id` is in `(select org_id from public.org_members where user_id =
auth.uid())`. The `/api/cron/cadence` and webhook handlers use the
service-role key and bypass RLS.

## Cadence engine

The 14-day campaign is a deterministic schedule applied per case at
creation:

```
day 0  09:00 — email-day-0    (friendly)
day 3  09:00 — email-day-3    (nudge)
day 5  14:00 — sms-day-5      (pay link)
day 7  09:00 — email-day-7    (gentle)
day 10 14:00 — sms-day-10     (quiet-hours aware)
day 12 13:00 — call-day-12    (voice <Say>)
day 12 13:05 — sms-day-12     (link after call)
day 14 09:00 — system-close   (no-op if paid; else handoff state)
```

When a case is created, the API inserts one `campaign_events` row per
step with `status='scheduled'` and `scheduled_at` computed from the
case's `opened_at`. A Vercel cron tick runs `/api/cron/cadence` every
5 minutes (or 1 min during the demo window) and fires every event
where `scheduled_at <= now() AND status = 'scheduled'`. Per-event
firing writes `fired_at`, `provider_id`, and updates `status`.

If a payment lands before day 14, all remaining `scheduled` events
for that case are flipped to `cancelled`.

## Localization

**Cookie-based, not URL-based.** Cookie name: `dragun_locale`. Values:
`fr` | `en`. Default for unset cookie + Quebec geo: `fr`. Toggle in
the nav sets the cookie, calls `revalidatePath('/', 'layout')`, and
reloads.

UI strings live in `app/_lib/i18n/<locale>.ts` — flat object keyed by
dotted path (`nav.signIn`, `app.dashboard.kpiAmount`, etc.). One
helper:

```ts
import { t } from '@/app/_lib/i18n';
const label = await t('nav.signIn');  // server: reads cookie
```

For client components, the resolved string map is passed via React
context from a server component wrapper.

Debtor-facing channel content (email/SMS/voice scripts) is driven by
`debtors.locale` (override) or `organizations.locale` (default).

## File layout

```
app/
├─ layout.tsx                 root, fonts, metadata
├─ globals.css
├─ page.tsx                   bilingual landing
├─ icon.svg
├─ opengraph-image.tsx
├─ middleware.ts (root)       Supabase session refresh
├─ _actions/
│  ├─ auth.ts                 (done) sign-in/up/out, OAuth
│  ├─ org.ts                  create org, update brand, switch locale
│  ├─ cases.ts                create case, cancel campaign
│  └─ lead.ts                 (legacy — replaced by /auth/sign-up)
├─ _components/
│  ├─ auth-form.tsx           (done)
│  ├─ google-button.tsx       (done)
│  ├─ locale-toggle.tsx       FR / EN switch
│  ├─ nav.tsx                 top nav, locale-aware
│  └─ case-card.tsx           dashboard list item
│  (no _data/ — the scripted /demo route was removed in favor of
├─ _lib/
│  ├─ supabase/
│  │  ├─ client.ts            (done) browser client
│  │  ├─ server.ts            (done) server client
│  │  └─ middleware.ts        (done) session refresh
│  ├─ i18n/
│  │  ├─ index.ts             t() helper, getLocale()
│  │  ├─ fr.ts                French strings
│  │  └─ en.ts                English strings
│  ├─ resend.ts               REST sendEmail
│  ├─ twilio.ts               REST sendSms, placeCall
│  ├─ stripe.ts               REST createCheckout, verifyWebhook
│  └─ cadence.ts              schedule(), fire(), cancel()
├─ auth/
│  ├─ sign-in/page.tsx        (done)
│  ├─ sign-up/page.tsx        (done)
│  ├─ callback/page.tsx       (done)
│  └─ _shell.tsx              (done)
├─ welcome/
│  └─ page.tsx                onboarding wizard
├─ app/
│  ├─ layout.tsx              org-scoped guard, sidebar
│  ├─ page.tsx                dashboard
│  ├─ cases/
│  │  ├─ new/page.tsx
│  │  └─ [id]/page.tsx
│  └─ settings/page.tsx
├─ p/
│  ├─ [slug]/page.tsx         debtor pay page
│  └─ [slug]/thanks/page.tsx
├─ legal/
│  ├─ privacy/page.tsx
│  └─ terms/page.tsx
├─ demo/
│  ├─ page.tsx                (done)
│  └─ _demo.tsx               (done)
└─ api/
   ├─ cron/cadence/route.ts   GET — Vercel cron
   └─ webhooks/
      ├─ stripe/route.ts
      └─ twilio/status/route.ts

supabase/
├─ config.toml                (done)
├─ migrations/                (done — 20260430 init: profiles)
│  └─ 20260430000000_init.sql
└─ seed.sql

docs/
├─ README.md
├─ product.md
├─ architecture.md
├─ stories.md
├─ runbook.md
└─ loop.md
```

## Constraints we will not violate

- **No SDK churn.** Resend, Twilio, Stripe all called via REST `fetch`
  — except Stripe webhook signature verification, which uses the
  official Stripe SDK because hand-rolling HMAC is not worth the risk.
- **No mock channels.** Everything inside `/app` and `/api/*` either
  sends real channel traffic or errors. There is no "fake send" code
  path that could mask a misconfig.
- **Branding via `organizations.brand` jsonb.** Logos, colors, and
  signature live in the database per-org; no per-client code drops.
- **All secrets are env vars.** No keys in code, no keys in committed
  `.env.*` files.
- **RLS on every public table.** No public reads of org-scoped data.
- **One vendor per concern.** Supabase for storage+auth, Resend for
  email, Twilio for telephony, Stripe for money. No second of each.

## Hosting

- **Web:** Vercel, prod = `dragun.app`. `npm run build` from `main`.
  Vercel cron registered for `/api/cron/cadence` (every 5 min).
- **DB:** Supabase Cloud `dragun-prod`. Migrations applied via
  `supabase db push` from local. Local dev stack on ports 54340–54349.
- **Twilio:** trial account, one Canadian number, verified destinations
  list (Mounir's mobile + ours pre-meeting).
- **Stripe:** test mode for the demo. Live mode keys swap in post-LOI.
