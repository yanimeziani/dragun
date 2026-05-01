-- Dragun · multi-tenant schema
-- Builds on 20260430000000_init.sql (auth.users + public.profiles).
-- See docs/architecture.md for the data-model contract.

/* ──────────────────────────────────────────────────────────
 * Tables
 * ────────────────────────────────────────────────────────── */

create table public.organizations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  display_name        text not null,
  locale              text not null default 'fr' check (locale in ('fr', 'en')),
  brand               jsonb not null default '{}'::jsonb,
  fee_bps             integer not null default 500 check (fee_bps between 0 and 10000),
  payout_email        text,
  stripe_account_id   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.org_members (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'owner' check (role in ('owner', 'staff')),
  created_at  timestamptz not null default now(),
  primary key (org_id, user_id)
);

create index org_members_user_id_idx on public.org_members(user_id);

create table public.cases (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  ref             text not null,
  amount_cents    integer not null check (amount_cents > 0),
  currency        text not null default 'CAD' check (currency in ('CAD', 'USD', 'EUR')),
  description     text,
  paylink_slug    text not null unique,
  status          text not null default 'open' check (status in ('open', 'paid', 'closed', 'handoff')),
  opened_at       timestamptz not null default now(),
  closed_at       timestamptz,
  unique (org_id, ref)
);

create index cases_org_id_idx on public.cases(org_id);
create index cases_status_idx on public.cases(status);

create table public.debtors (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  full_name   text not null,
  email       text,
  phone_e164  text,
  locale      text check (locale in ('fr', 'en')),
  created_at  timestamptz not null default now()
);

create index debtors_case_id_idx on public.debtors(case_id);

create table public.campaign_events (
  id            uuid primary key default gen_random_uuid(),
  case_id       uuid not null references public.cases(id) on delete cascade,
  template_id   text not null,
  channel       text not null check (channel in ('email', 'sms', 'call')),
  scheduled_at  timestamptz not null,
  fired_at      timestamptz,
  status        text not null default 'scheduled' check (status in ('scheduled', 'sent', 'delivered', 'opened', 'failed', 'cancelled')),
  provider_id   text,
  payload       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index campaign_events_case_id_idx on public.campaign_events(case_id);
create index campaign_events_due_idx on public.campaign_events(scheduled_at) where status = 'scheduled';

create table public.payments (
  id                       uuid primary key default gen_random_uuid(),
  case_id                  uuid not null references public.cases(id) on delete cascade,
  amount_cents             integer not null check (amount_cents > 0),
  currency                 text not null,
  fee_cents                integer not null default 0,
  net_to_org_cents         integer not null default 0,
  stripe_payment_intent_id text unique,
  status                   text not null check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  paid_at                  timestamptz,
  created_at               timestamptz not null default now()
);

create index payments_case_id_idx on public.payments(case_id);

create table public.message_templates (
  id        text not null,
  locale    text not null check (locale in ('fr', 'en')),
  channel   text not null check (channel in ('email', 'sms', 'call')),
  subject   text,
  body      text not null,
  created_at  timestamptz not null default now(),
  primary key (id, locale)
);

/* ──────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────── */

-- Atomically create an organization and bind the current user as owner.
-- Bypasses RLS on insert for both tables.
create or replace function public.create_organization(
  p_slug          text,
  p_display_name  text,
  p_locale        text default 'fr',
  p_brand         jsonb default '{}'::jsonb
) returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_org_id  uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  insert into public.organizations (slug, display_name, locale, brand)
    values (p_slug, p_display_name, coalesce(p_locale, 'fr'), coalesce(p_brand, '{}'::jsonb))
    returning id into v_org_id;

  insert into public.org_members (org_id, user_id, role)
    values (v_org_id, v_user_id, 'owner');

  return v_org_id;
end;
$$;

revoke all on function public.create_organization(text, text, text, jsonb) from public;
grant execute on function public.create_organization(text, text, text, jsonb) to authenticated;

-- Public read of pay-link case details. Used by /p/[slug] (anon).
create or replace function public.get_paylink_case(p_slug text)
returns table (
  case_id           uuid,
  org_display_name  text,
  org_brand         jsonb,
  org_locale        text,
  amount_cents      integer,
  currency          text,
  description       text,
  debtor_full_name  text,
  debtor_locale     text,
  status            text
)
language plpgsql security definer stable
set search_path = public
as $$
begin
  return query
    select
      c.id,
      o.display_name,
      o.brand,
      o.locale,
      c.amount_cents,
      c.currency,
      c.description,
      d.full_name,
      coalesce(d.locale, o.locale),
      c.status
    from public.cases c
    join public.organizations o on o.id = c.org_id
    left join public.debtors d on d.case_id = c.id
    where c.paylink_slug = p_slug
    limit 1;
end;
$$;

revoke all on function public.get_paylink_case(text) from public;
grant execute on function public.get_paylink_case(text) to anon, authenticated;

/* ──────────────────────────────────────────────────────────
 * Row-level security
 * ────────────────────────────────────────────────────────── */

alter table public.organizations    enable row level security;
alter table public.org_members      enable row level security;
alter table public.cases            enable row level security;
alter table public.debtors          enable row level security;
alter table public.campaign_events  enable row level security;
alter table public.payments         enable row level security;
alter table public.message_templates enable row level security;

-- organizations: members read; mutate via SECURITY DEFINER function only.
create policy "organizations_select_member"
  on public.organizations for select
  to authenticated
  using (
    id in (select org_id from public.org_members where user_id = auth.uid())
  );

create policy "organizations_update_owner"
  on public.organizations for update
  to authenticated
  using (
    id in (select org_id from public.org_members where user_id = auth.uid() and role = 'owner')
  )
  with check (
    id in (select org_id from public.org_members where user_id = auth.uid() and role = 'owner')
  );

-- org_members: read your own memberships and your peers in shared orgs.
create policy "org_members_select_self"
  on public.org_members for select
  to authenticated
  using (
    user_id = auth.uid()
    or org_id in (select org_id from public.org_members where user_id = auth.uid())
  );

-- cases: full CRUD if you're a member of the org.
create policy "cases_all_member"
  on public.cases for all
  to authenticated
  using (
    org_id in (select org_id from public.org_members where user_id = auth.uid())
  )
  with check (
    org_id in (select org_id from public.org_members where user_id = auth.uid())
  );

-- debtors: scoped by parent case org.
create policy "debtors_all_member"
  on public.debtors for all
  to authenticated
  using (
    case_id in (
      select c.id from public.cases c
      join public.org_members m on m.org_id = c.org_id
      where m.user_id = auth.uid()
    )
  )
  with check (
    case_id in (
      select c.id from public.cases c
      join public.org_members m on m.org_id = c.org_id
      where m.user_id = auth.uid()
    )
  );

-- campaign_events: read only via member; cron + webhooks use service role.
create policy "campaign_events_select_member"
  on public.campaign_events for select
  to authenticated
  using (
    case_id in (
      select c.id from public.cases c
      join public.org_members m on m.org_id = c.org_id
      where m.user_id = auth.uid()
    )
  );

create policy "campaign_events_insert_member"
  on public.campaign_events for insert
  to authenticated
  with check (
    case_id in (
      select c.id from public.cases c
      join public.org_members m on m.org_id = c.org_id
      where m.user_id = auth.uid()
    )
  );

-- payments: read only; writes only via service role from the Stripe webhook.
create policy "payments_select_member"
  on public.payments for select
  to authenticated
  using (
    case_id in (
      select c.id from public.cases c
      join public.org_members m on m.org_id = c.org_id
      where m.user_id = auth.uid()
    )
  );

-- message_templates: any authenticated user can read; admin seeds via service role.
create policy "message_templates_select_authenticated"
  on public.message_templates for select
  to authenticated
  using (true);

/* ──────────────────────────────────────────────────────────
 * updated_at touch trigger for organizations
 * ────────────────────────────────────────────────────────── */

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_touch_updated_at
  before update on public.organizations
  for each row execute function public.touch_updated_at();
