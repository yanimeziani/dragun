// Telnyx TeXML responder.
// When cadence.ts places an outbound call, it gives Telnyx a URL pointing
// here. Telnyx fetches this URL on call-answered and expects TeXML back.
//
// The script body is encoded as a base64url query param so this endpoint
// is stateless — no DB lookup per call, no auth surface to defend, no
// per-call resource to provision.

import { NextRequest } from "next/server";
import { escapeXml } from "@/app/_lib/telnyx";

export const runtime = "edge";

function decodeBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  // edge runtime supports atob
  return decodeURIComponent(
    atob(b64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

function handle(req: NextRequest) {
  const url = new URL(req.url);
  const t = url.searchParams.get("t");
  const lang = url.searchParams.get("lang") ?? "fr-CA";

  let text = "";
  try {
    if (t) text = decodeBase64Url(t);
  } catch {
    text = "";
  }

  const safeText = escapeXml(text || "Bonjour, ceci est un rappel automatisé.");
  const safeLang = lang === "en-CA" ? "en-CA" : "fr-CA";
  const voice = "alice";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Speak voice="${voice}" language="${safeLang}">${safeText}</Speak>
  <Pause length="1"/>
  <Hangup/>
</Response>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
