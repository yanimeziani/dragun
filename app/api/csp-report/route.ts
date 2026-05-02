import { NextResponse, type NextRequest } from "next/server";
import { withReqId } from "@/app/_lib/log";

export const runtime = "nodejs";

// CSP violation reports land here. Browsers POST application/csp-report (or
// application/reports+json depending on the report-to vs report-uri path).
// We log at warn level — review weekly while the policy is Report-Only,
// flip to Content-Security-Policy after a clean window (manops §1.2).

type CspReport = {
  "csp-report"?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  const reqId = req.headers.get("x-request-id");
  const log = withReqId(reqId);

  let body: CspReport | unknown = null;
  try {
    body = await req.json();
  } catch {
    // some browsers send malformed JSON — ignore parse errors but record
  }

  const report =
    (body as CspReport | null)?.["csp-report"] ??
    (body as Record<string, unknown> | null) ??
    {};

  log.warn(
    {
      kind: "csp.violation",
      report,
    },
    "csp violation",
  );

  return new NextResponse(null, { status: 204 });
}
