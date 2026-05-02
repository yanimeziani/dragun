-- Dragun · billing plans + SaaS subscriptions
-- Adds plan/customer columns to organizations, a subscriptions table for the
-- paid tiers (Sprint, PRO Monthly, PRO Annual), and a member-facing
-- get_billing_status RPC. Enterprise is sales-led — no row in subscriptions.

/* ──────────────────────────────────────────────────────────
 * organizations · plan + Stripe customer
 * fee_bps already exists; we now treat it as a function of plan
 * (5 % for starter, 0 % for paid). The webhook still reads
 * organizations.fee_bps when computing commission on a paylink
 * payment, so flipping the column is enough.
 * ────────────────────────────────────────────────────────── */

alter table public.organizations
  add column if not exists plan text not null default 'starter'
    check (plan in ('starter', 'sprint', 'pro_monthly', 'pro_annual', 'enterprise'));

alter table public.organizations
  add column if not exists stripe_customer_id text;

create unique index if not exists organizations_stripe_customer_id_key
  on public.organizations(stripe_customer_id)
  where stripe_customer_id is not null;

/* ──────────────────────────────────────────────────────────
 * subscriptions
 * One row per Stripe subscription. We keep history (cancelled
 * rows stay) — billing status reads the most recent live row.
 * Writes happen exclusively via the Stripe webhook (service role).
 * ────────────────────────────────────────────────────────── */

create table if not exists public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  org_id                   uuid not null references public.organizations(id) on delete cascade,
  plan                     text not null
    check (plan in ('sprint', 'pro_monthly', 'pro_annual')),
  status                   text not null
    check (status in (
      'trialing', 'active', 'past_due', 'canceled',
      'incomplete', 'incomplete_expired', 'unpaid', 'paused'
    )),
  stripe_subscription_id   text unique,
  stripe_price_id          text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  canceled_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists subscriptions_org_id_idx on public.subscriptions(org_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_member"
  on public.subscriptions for select
  to authenticated
  using (
    org_id in (select org_id from public.org_members where user_id = auth.uid())
  );

/* ──────────────────────────────────────────────────────────
 * get_billing_status RPC
 * Returns one row: the org's plan + the most recent live
 * subscription's status / period_end / cancel_at_period_end.
 * Starter orgs get a synthetic 'active' status so the UI can
 * branch on a single field.
 * ────────────────────────────────────────────────────────── */

create or replace function public.get_billing_status(p_org_id uuid)
returns table (
  plan                  text,
  status                text,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean,
  fee_bps               integer
)
language plpgsql security definer stable
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  if not exists (
    select 1 from public.org_members
    where org_id = p_org_id and user_id = v_user_id
  ) then
    raise exception 'not a member of this organization';
  end if;

  return query
    select
      o.plan,
      coalesce(
        s.status,
        case when o.plan = 'starter' then 'active' else 'inactive' end
      ) as status,
      s.current_period_end,
      coalesce(s.cancel_at_period_end, false) as cancel_at_period_end,
      o.fee_bps
    from public.organizations o
    left join lateral (
      select status, current_period_end, cancel_at_period_end
      from public.subscriptions
      where org_id = o.id
        and status in ('trialing', 'active', 'past_due', 'paused', 'unpaid')
      order by created_at desc
      limit 1
    ) s on true
    where o.id = p_org_id;
end;
$$;

revoke all on function public.get_billing_status(uuid) from public;
grant execute on function public.get_billing_status(uuid) to authenticated;
