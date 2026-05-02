import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { createServiceClient } from "@/app/_lib/supabase/service";
import {
  tickDueEvents,
  markOverdueCasesAsHandoff,
} from "@/app/_lib/cadence";
import { withReqId } from "@/app/_lib/log";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const want = `Bearer ${expected}`;
  if (header.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(header), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  const log = withReqId(req.headers.get("x-request-id"));

  if (!authorized(req)) {
    log.warn(
      { kind: "cron.auth.failed", path: "/api/cron/cadence" },
      "cron unauthorized",
    );
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = createServiceClient();
  const sends = await tickDueEvents(client);
  const handed = await markOverdueCasesAsHandoff(client);

  // Daily retention pass — runs in the first 5 minutes of the 03:00 UTC hour.
  // Vercel Hobby caps at 1 cron, so we piggyback rather than add a second
  // entry. The RPCs are idempotent and cheap when there's nothing to delete.
  let retention: {
    audit_purged: number;
    campaign_purged: number;
    payload_redacted: number;
  } | null = null;
  const now = new Date();
  if (now.getUTCHours() === 3 && now.getUTCMinutes() < 5) {
    const [auditPurge, campaignPurge, payloadRedact] = await Promise.all([
      client.rpc("purge_audit_events_older_than", { p_days: 365 }),
      client.rpc("purge_campaign_events_older_than", { p_days: 90 }),
      client.rpc("redact_campaign_event_payloads_older_than", { p_days: 30 }),
    ]);
    retention = {
      audit_purged: (auditPurge.data as number | null) ?? 0,
      campaign_purged: (campaignPurge.data as number | null) ?? 0,
      payload_redacted: (payloadRedact.data as number | null) ?? 0,
    };
    log.info({ kind: "cron.retention.tick", ...retention }, "retention tick");
  }

  log.info(
    {
      kind: "cron.cadence.tick",
      fired: sends.fired,
      failed: sends.failed,
      handed_off: handed,
    },
    "cadence tick",
  );

  return NextResponse.json({
    ok: true,
    fired: sends.fired,
    failed: sends.failed,
    handed_off: handed,
    retention,
    at: new Date().toISOString(),
  });
}
