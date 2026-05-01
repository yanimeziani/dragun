import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/app/_lib/supabase/service";
import {
  tickDueEvents,
  markOverdueCasesAsHandoff,
} from "@/app/_lib/cadence";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = createServiceClient();
  const sends = await tickDueEvents(client);
  const handed = await markOverdueCasesAsHandoff(client);

  return NextResponse.json({
    ok: true,
    fired: sends.fired,
    failed: sends.failed,
    handed_off: handed,
    at: new Date().toISOString(),
  });
}
