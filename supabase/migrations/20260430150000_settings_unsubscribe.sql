-- Dragun · settings + unsubscribe + account-delete

/* ──────────────────────────────────────────────────────────
 * Debtor opt-out (CASL / CAN-SPAM / TCPA)
 * Tracked per-debtor; cadence engine skips events when set.
 * ────────────────────────────────────────────────────────── */

alter table public.debtors
  add column if not exists unsubscribed_at timestamptz;

create index if not exists debtors_unsubscribed_idx
  on public.debtors(unsubscribed_at)
  where unsubscribed_at is not null;

/* ──────────────────────────────────────────────────────────
 * Public unsubscribe RPC: sets unsubscribed_at + cancels
 * remaining campaign_events. Anon-grantable (debtor follows
 * a link from an email or SMS).
 * ────────────────────────────────────────────────────────── */

create or replace function public.unsubscribe_debtor(p_debtor_id uuid)
returns table (
  full_name text,
  org_display_name text,
  org_locale text,
  already_unsubscribed boolean
)
language plpgsql security definer
set search_path = public
as $$
declare
  v_case_id uuid;
  v_already boolean := false;
  v_was_set timestamptz;
begin
  select case_id, unsubscribed_at into v_case_id, v_was_set
  from public.debtors where id = p_debtor_id;
  if v_case_id is null then
    return;
  end if;
  v_already := v_was_set is not null;

  if not v_already then
    update public.debtors set unsubscribed_at = now() where id = p_debtor_id;
    update public.campaign_events
      set status = 'cancelled'
      where case_id = v_case_id and status = 'scheduled';
  end if;

  return query
    select d.full_name, o.display_name, o.locale, v_already
    from public.debtors d
    join public.cases c on c.id = d.case_id
    join public.organizations o on o.id = c.org_id
    where d.id = p_debtor_id;
end;
$$;

revoke all on function public.unsubscribe_debtor(uuid) from public;
grant execute on function public.unsubscribe_debtor(uuid) to anon, authenticated;

/* ──────────────────────────────────────────────────────────
 * Update get_paylink_case to also expose debtor_id and the
 * unsubscribed_at flag (callers may want to render a different
 * pay page for opted-out debtors).
 * ────────────────────────────────────────────────────────── */

create or replace function public.get_paylink_case(p_slug text)
returns table (
  case_id           uuid,
  org_display_name  text,
  org_brand         jsonb,
  org_locale        text,
  amount_cents      integer,
  currency          text,
  description       text,
  debtor_id         uuid,
  debtor_full_name  text,
  debtor_locale     text,
  debtor_unsubscribed boolean,
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
      d.id,
      d.full_name,
      coalesce(d.locale, o.locale),
      d.unsubscribed_at is not null,
      c.status
    from public.cases c
    join public.organizations o on o.id = c.org_id
    left join public.debtors d on d.case_id = c.id
    where c.paylink_slug = p_slug
    limit 1;
end;
$$;

/* ──────────────────────────────────────────────────────────
 * Account deletion (Law 25 right to delete)
 * Wipes the caller's orgs (cascades through cases / debtors /
 * events / payments) and their profile. The auth.users row is
 * deleted by the server action via the admin API.
 * ────────────────────────────────────────────────────────── */

create or replace function public.delete_my_data()
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  delete from public.organizations
  where id in (
    select org_id from public.org_members where user_id = v_user_id
  );

  delete from public.profiles where id = v_user_id;
end;
$$;

revoke all on function public.delete_my_data() from public;
grant execute on function public.delete_my_data() to authenticated;

/* ──────────────────────────────────────────────────────────
 * Org settings update (atomic: name + locale + brand + payout).
 * Owner-only.
 * ────────────────────────────────────────────────────────── */

create or replace function public.update_my_organization(
  p_org_id        uuid,
  p_display_name  text,
  p_locale        text,
  p_brand         jsonb,
  p_payout_email  text
) returns void
language plpgsql security definer
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
    where org_id = p_org_id and user_id = v_user_id and role = 'owner'
  ) then
    raise exception 'not an owner of this organization';
  end if;

  update public.organizations
  set display_name = p_display_name,
      locale       = p_locale,
      brand        = coalesce(p_brand, brand),
      payout_email = nullif(p_payout_email, '')
  where id = p_org_id;
end;
$$;

revoke all on function public.update_my_organization(uuid, text, text, jsonb, text) from public;
grant execute on function public.update_my_organization(uuid, text, text, jsonb, text) to authenticated;
