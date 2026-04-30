# Architecture

## Surfaces

| Route                          | Purpose                                                       | Render |
| ------------------------------ | ------------------------------------------------------------- | ------ |
| `/`                            | Landing + investor pitch                                       | Static |
| `/demo`                        | Default scripted replay (current Atlas Athletic fixture)       | Static |
| `/demo?client=<slug>`          | Same player, swapped fixture by slug                           | Static |
| `/demo?client=<slug>&live=1`   | Same player, real channel sends to verified phone              | Client |
| `/opengraph-image`             | 1200×630 OG image                                              | Edge   |
| `/api/lead` (server action)    | Existing Resend lead capture                                   | Server |
| `/api/send/email` (action)     | Trigger Resend email for a case event                          | Server |
| `/api/send/sms` (action)       | Trigger Twilio SMS for a case event                            | Server |
| `/api/send/call` (action)      | Trigger Twilio outbound call with `<Say>` TwiML                | Server |

`api/*` are server actions, not Route Handlers, unless Twilio
webhooks need a Route Handler (TwiML response). Status callbacks
land at `/api/twilio/status` (Route Handler).

## Third-party deps

Three vendors. No more.

| Vendor   | Purpose                              | Critical env vars                                     |
| -------- | ------------------------------------ | ----------------------------------------------------- |
| Resend   | Transactional email                   | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_TO_EMAIL` |
| Twilio   | SMS + outbound voice (`<Say>`)        | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| Supabase | Postgres for cases / debtors / events | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

ElevenLabs is deferred. Stripe is out of scope for tomorrow.

## Data model (Supabase / Postgres)

```sql
create table public.clients (
  slug         text primary key,             -- 'venice-gym', 'atlas-athletic'
  display_name text not null,                -- 'Venice Gym Charlesbourg'
  locale       text not null default 'en',   -- 'fr' for Mounir
  brand        jsonb not null default '{}',  -- color tokens, logo url, signature
  created_at   timestamptz default now()
);

create table public.cases (
  id           uuid primary key default gen_random_uuid(),
  client_slug  text not null references public.clients(slug),
  ref          text not null,                 -- 'DR-1042'
  amount_cents integer not null,
  status       text not null default 'open',  -- 'open' | 'paid' | 'handoff'
  opened_at    timestamptz default now(),
  unique (client_slug, ref)
);

create table public.debtors (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  full_name   text not null,
  email       text,
  phone_e164  text,                            -- Twilio-verified for trial
  created_at  timestamptz default now()
);

create table public.channel_events (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  channel     text not null,                   -- 'email' | 'sms' | 'call'
  provider_id text,                             -- Resend message id / Twilio sid
  status      text not null,                    -- 'queued' | 'sent' | 'delivered' | 'failed'
  payload     jsonb not null default '{}',
  created_at  timestamptz default now()
);
```

Row-level security: enabled on all tables; service-role key only for
server actions. No public reads in MVP.

## Fixtures vs database

The current `/demo` is hard-coded. The split:

- **Fixture data** (`app/_data/clients/<slug>.ts`) — brand strings,
  locale strings, scripted timeline events. Lives in code, ships with
  the bundle, used by the scripted replay.
- **Database data** — only used in `live=1` mode. The server actions
  insert a `case` + `debtor` row at run time, then write a
  `channel_event` per Resend / Twilio call.

This keeps the scripted replay zero-dep and the live demo persistent.

## File layout

```
app/
├─ layout.tsx
├─ globals.css
├─ page.tsx                          investor + landing
├─ icon.svg
├─ opengraph-image.tsx
├─ _actions/
│  ├─ lead.ts                        existing Resend lead capture
│  ├─ send-email.ts                  Resend, branded by client
│  ├─ send-sms.ts                    Twilio SMS
│  └─ place-call.ts                  Twilio call with TwiML <Say>
├─ _components/
│  └─ alpha-form.tsx
├─ _data/
│  └─ clients/
│     ├─ index.ts                    slug -> fixture map
│     ├─ atlas-athletic.ts           existing demo fixture
│     └─ venice-gym.ts               Mounir's fixture (FR)
├─ _lib/
│  ├─ twilio.ts                      thin REST client, no SDK
│  ├─ resend.ts                      thin REST client, no SDK
│  └─ supabase.ts                    server client factory
├─ api/
│  └─ twilio/
│     └─ status/
│        └─ route.ts                 webhook for delivery callbacks
└─ demo/
   ├─ page.tsx                       reads ?client= and ?live= flags
   └─ _demo.tsx                      two-pane player

supabase/
├─ config.toml
├─ migrations/                        new — schema for clients/cases/etc
└─ seed.sql

docs/
├─ README.md
├─ product.md
├─ architecture.md
├─ stories.md
└─ runbook.md
```

## Hosting

- **Web:** Vercel, prod = `dragun.app`. `npm run build` from main.
- **DB:** Supabase Cloud project `dragun-prod`. Migrations applied via
  `supabase db push`. Local stack remains on ports 54340–54349 for dev.
- **Twilio:** trial account, one Canadian number, Mounir's mobile
  added as a verified caller-ID.

## Constraints we will not violate

- **No SDK churn.** Resend and Twilio both have clean REST APIs; we
  call them with `fetch` and ship one less dep tree.
- **No mocks of real channels.** `live=1` either sends or errors;
  there is no "fake send" code path that could mask a misconfig.
- **Fixture-driven branding.** Adding a new client must require zero
  code changes in `app/demo/_demo.tsx`.
- **All secrets are env vars.** No keys in code, no keys in `.env.*`
  committed files. `.env.development.local.example` documents shape only.
