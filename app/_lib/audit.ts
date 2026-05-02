// Audit-event helper. Wraps the record_audit_event SECURITY DEFINER RPC so
// every mutating server action can write a row in one line.
//
// Usage from a user-context server action:
//   await recordAudit({ orgId, action: "org.update", targetType: "organization",
//                       targetId: orgId, before, after });
//
// Usage from the service role (webhook / cron): pass `client` explicitly
// (already created via createServiceClient).

import { headers } from "next/headers";
import { createClient } from "./supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./log";

export type AuditAction =
  | "org.create"
  | "org.update"
  | "org.delete"
  | "org.plan_changed"
  | "case.create"
  | "case.update"
  | "case.cancel"
  | "case.markPaid"
  | "case.import"
  | "payment.received"
  | "subscription.created"
  | "subscription.updated"
  | "subscription.deleted"
  | "member.invite"
  | "member.remove";

export type AuditTargetType =
  | "organization"
  | "case"
  | "payment"
  | "subscription"
  | "member"
  | "debtor";

export type RecordAuditArgs = {
  orgId: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string | null;
  before?: unknown;
  after?: unknown;
  /** Pass a service-role client when calling from webhook/cron. */
  client?: SupabaseClient;
};

export async function recordAudit(args: RecordAuditArgs): Promise<void> {
  let h: Awaited<ReturnType<typeof headers>> | null = null;
  try {
    h = await headers();
  } catch {
    // Outside a request scope (rare); webhook + cron pass `client` and we
    // simply have no request-id / ip / ua to record.
  }

  const reqId = h?.get("x-request-id") ?? null;
  const ipHeader = h?.get("x-forwarded-for") ?? h?.get("x-real-ip") ?? null;
  const ip = ipHeader ? ipHeader.split(",")[0].trim() : null;
  const ua = h?.get("user-agent") ?? null;

  const client = args.client ?? (await createClient());

  const { error } = await client.rpc("record_audit_event", {
    p_org_id: args.orgId,
    p_action: args.action,
    p_target_type: args.targetType,
    p_target_id: args.targetId ?? null,
    p_before: (args.before ?? null) as never,
    p_after: (args.after ?? null) as never,
    p_request_id: reqId,
    p_ip: ip,
    p_ua: ua,
  });

  if (error) {
    // Audit failure should not crash the user-facing action — log and move
    // on. Sentry will pick it up.
    logger.error(
      {
        kind: "audit.record.failed",
        action: args.action,
        target_type: args.targetType,
        request_id: reqId,
        err: error.message,
      },
      "audit_event insert failed",
    );
  }
}
