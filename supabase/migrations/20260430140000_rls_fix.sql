-- Dragun · RLS recursion fix
-- The original org_members select policy referenced org_members in its own
-- subquery, which causes Postgres' RLS to return inconsistent (often empty)
-- results — most visibly: /app and /welcome disagree about whether the user
-- has a membership, producing a redirect loop after onboarding.
--
-- Fix: simplify org_members select to "see your own row only" (peer-listing
-- is v2), and route all cross-table membership checks through a
-- SECURITY DEFINER helper that bypasses RLS for the lookup.

/* ──────────────────────────────────────────────────────────
 * Helper: returns the calling user's org_ids (RLS-bypassed)
 * ────────────────────────────────────────────────────────── */

create or replace function public.user_org_ids()
returns setof uuid
language sql security definer stable
set search_path = public
as $$
  select org_id from public.org_members where user_id = auth.uid();
$$;

revoke all on function public.user_org_ids() from public;
grant execute on function public.user_org_ids() to authenticated;

/* ──────────────────────────────────────────────────────────
 * Replace the recursive org_members policy
 * ────────────────────────────────────────────────────────── */

drop policy if exists "org_members_select_self" on public.org_members;
create policy "org_members_select_self"
  on public.org_members for select
  to authenticated
  using (user_id = auth.uid());

/* ──────────────────────────────────────────────────────────
 * Replace cross-table policies that subqueried org_members
 * with calls to the helper — same semantics, no recursion risk.
 * ────────────────────────────────────────────────────────── */

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member"
  on public.organizations for select
  to authenticated
  using (id in (select public.user_org_ids()));

drop policy if exists "organizations_update_owner" on public.organizations;
create policy "organizations_update_owner"
  on public.organizations for update
  to authenticated
  using (
    id in (
      select org_id from public.org_members
      where user_id = auth.uid() and role = 'owner'
    )
  )
  with check (
    id in (
      select org_id from public.org_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

drop policy if exists "cases_all_member" on public.cases;
create policy "cases_all_member"
  on public.cases for all
  to authenticated
  using (org_id in (select public.user_org_ids()))
  with check (org_id in (select public.user_org_ids()));

drop policy if exists "debtors_all_member" on public.debtors;
create policy "debtors_all_member"
  on public.debtors for all
  to authenticated
  using (
    case_id in (
      select id from public.cases
      where org_id in (select public.user_org_ids())
    )
  )
  with check (
    case_id in (
      select id from public.cases
      where org_id in (select public.user_org_ids())
    )
  );

drop policy if exists "campaign_events_select_member" on public.campaign_events;
create policy "campaign_events_select_member"
  on public.campaign_events for select
  to authenticated
  using (
    case_id in (
      select id from public.cases
      where org_id in (select public.user_org_ids())
    )
  );

drop policy if exists "campaign_events_insert_member" on public.campaign_events;
create policy "campaign_events_insert_member"
  on public.campaign_events for insert
  to authenticated
  with check (
    case_id in (
      select id from public.cases
      where org_id in (select public.user_org_ids())
    )
  );

drop policy if exists "payments_select_member" on public.payments;
create policy "payments_select_member"
  on public.payments for select
  to authenticated
  using (
    case_id in (
      select id from public.cases
      where org_id in (select public.user_org_ids())
    )
  );
