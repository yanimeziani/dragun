-- Dragun · audit_events
-- Records every administrative mutation on org-scoped data. Inserts are
-- service-role only (SECURITY DEFINER RPC); reads are scoped to org members.
-- Marketing copy promises "audit log on every administrative action,
-- retained twelve months" — this table + the retention pass in the cadence
-- cron is what makes that true.

create table if not exists public.audit_events (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action        text not null,
  target_type   text not null,
  target_id     uuid,
  before        jsonb,
  after         jsonb,
  request_id    text,
  ip            inet,
  ua            text,
  created_at    timestamptz not null default now()
);

create index if not exists audit_events_org_id_created_at_idx
  on public.audit_events (org_id, created_at desc);
create index if not exists audit_events_action_idx
  on public.audit_events (action);

alter table public.audit_events enable row level security;

-- Members read their own org's audit log.
create policy "audit_events_select_member"
  on public.audit_events for select
  to authenticated
  using (
    org_id in (select org_id from public.org_members where user_id = auth.uid())
  );

-- No INSERT/UPDATE/DELETE policy by design — writes go through the
-- record_audit_event RPC (SECURITY DEFINER) or the service role.

create or replace function public.record_audit_event(
  p_org_id      uuid,
  p_action      text,
  p_target_type text,
  p_target_id   uuid,
  p_before      jsonb,
  p_after       jsonb,
  p_request_id  text,
  p_ip          inet,
  p_ua          text
) returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_id      uuid;
begin
  -- Allow when caller is a member of the org. Service role bypasses RLS,
  -- but auth.uid() is null in that case — we still let it through because
  -- service-role calls come from our webhook/cron handlers, which are the
  -- only paths that should be writing system-actor audit rows.
  if v_user_id is not null and not exists (
    select 1 from public.org_members
    where org_id = p_org_id and user_id = v_user_id
  ) then
    raise exception 'not a member of this organization';
  end if;

  insert into public.audit_events (
    org_id, actor_user_id, action, target_type, target_id,
    before, after, request_id, ip, ua
  )
  values (
    p_org_id, v_user_id, p_action, p_target_type, p_target_id,
    p_before, p_after, p_request_id, p_ip, p_ua
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.record_audit_event(uuid, text, text, uuid, jsonb, jsonb, text, inet, text) from public;
grant execute on function public.record_audit_event(uuid, text, text, uuid, jsonb, jsonb, text, inet, text) to authenticated;

-- Retention purge — called by the cadence cron once per day around 03:00 UTC.
create or replace function public.purge_audit_events_older_than(p_days integer)
returns integer
language plpgsql security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.audit_events
  where created_at < now() - make_interval(days => p_days);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_audit_events_older_than(integer) from public;
-- service role only; no grant.

-- campaign_events retention: keep rows for 90 days, redact payload after 30.
create or replace function public.purge_campaign_events_older_than(p_days integer)
returns integer
language plpgsql security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.campaign_events
  where created_at < now() - make_interval(days => p_days);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_campaign_events_older_than(integer) from public;

create or replace function public.redact_campaign_event_payloads_older_than(p_days integer)
returns integer
language plpgsql security definer
set search_path = public
as $$
declare
  v_redacted integer;
begin
  update public.campaign_events
  set payload = '{}'::jsonb
  where created_at < now() - make_interval(days => p_days)
    and payload <> '{}'::jsonb;
  get diagnostics v_redacted = row_count;
  return v_redacted;
end;
$$;

revoke all on function public.redact_campaign_event_payloads_older_than(integer) from public;
