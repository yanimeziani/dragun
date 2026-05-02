-- Dragun · DB linter remediation (Supabase advisor, 2026-05-02)
-- Three classes of finding addressed here:
--   1. function_search_path_mutable on touch_updated_at
--   2. anon_security_definer_function_executable on functions that should
--      be authenticated-only or internal-only
--   3. authenticated_security_definer_function_executable on internal-only
--      helpers (handle_new_user, user_org_ids)
--
-- Two warnings remain open as ACCEPTED RISK (documented in
-- docs/soc2-readiness.md): get_paylink_case and unsubscribe_debtor are
-- deliberately anon-callable so debtors can pay invoices and unsubscribe
-- from one-time links without an account.
--
-- This migration is independent of 20260503000000_audit_events.sql; either
-- can be applied first.

/* ──────────────────────────────────────────────────────────
 * 1. search_path on touch_updated_at
 *    Without an explicit search_path, a SECURITY DEFINER function (and
 *    even regular functions in trusted contexts) can be tricked into
 *    resolving identifiers against an attacker-influenced schema.
 *    touch_updated_at is a trigger so this is low-impact in practice,
 *    but the linter is right to want it pinned.
 * ────────────────────────────────────────────────────────── */

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

/* ──────────────────────────────────────────────────────────
 * 2. Explicit anon revoke on authenticated-only RPCs.
 *    The original migrations did `revoke all from public; grant to
 *    authenticated`, but PostgREST + Supabase role chain can still
 *    surface these to anon. Belt-and-braces revoke from anon directly.
 * ────────────────────────────────────────────────────────── */

revoke execute on function public.create_organization(text, text, text, jsonb)
  from anon;
revoke execute on function public.delete_my_data()
  from anon;
revoke execute on function public.update_my_organization(uuid, text, text, jsonb, text)
  from anon;

/* ──────────────────────────────────────────────────────────
 * 3. Internal-only helpers — must not be reachable via /rest/v1/rpc.
 *    handle_new_user is a trigger function; the trigger runs as its owner
 *    so no role needs EXECUTE on the function name.
 *    user_org_ids is referenced by RLS policy expressions, which evaluate
 *    in the requesting role's context — authenticated keeps EXECUTE,
 *    everyone else loses it.
 * ────────────────────────────────────────────────────────── */

revoke execute on function public.handle_new_user()
  from anon, authenticated, public;

revoke execute on function public.user_org_ids()
  from anon, public;

/* ──────────────────────────────────────────────────────────
 * 4. Document the two intentional anon-callable functions so the
 *    accepted-risk shows up in pg_description for any future operator.
 * ────────────────────────────────────────────────────────── */

comment on function public.get_paylink_case(text) is
  'Public paylink read. Intentionally anon-callable so debtors can land on /p/[slug] without an account. Returns only public-safe fields. Linter warning 0028 is accepted risk.';

comment on function public.unsubscribe_debtor(uuid) is
  'Public unsubscribe. Intentionally anon-callable so debtors can opt out from a one-time link in email/SMS without signing in. Linter warning 0028 is accepted risk.';
