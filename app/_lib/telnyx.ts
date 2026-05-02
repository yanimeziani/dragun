// Telnyx REST client — Messaging v2 + TeXML voice.
// Auth: bearer token. Same surface as the prior twilio.ts so cadence.ts
// only needs an import swap.

const MESSAGING_URL = "https://api.telnyx.com/v2/messages";

function getApiKey(): string {
  const key = process.env.TELNYX_API_KEY;
  if (!key) throw new Error("TELNYX_API_KEY not set");
  return key;
}

function bearerAuth(key: string): string {
  return `Bearer ${key}`;
}

export async function sendSms(args: {
  to: string;
  from: string;
  body: string;
  webhookUrl?: string;
}): Promise<{ sid: string; status: string }> {
  const key = getApiKey();
  const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID;

  const body: Record<string, unknown> = {
    from: args.from,
    to: args.to,
    text: args.body,
  };
  if (messagingProfileId) body.messaging_profile_id = messagingProfileId;
  if (args.webhookUrl) body.webhook_url = args.webhookUrl;

  const r = await fetch(MESSAGING_URL, {
    method: "POST",
    headers: {
      Authorization: bearerAuth(key),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Telnyx SMS ${r.status}: ${txt}`);
  }

  const data = (await r.json()) as {
    data: { id: string; to: Array<{ status: string }> };
  };
  // Telnyx returns per-recipient status; for single-recipient sends we
  // collapse to the first. Map id → sid so the cadence.ts surface is
  // unchanged from the Twilio era.
  const status = data.data.to?.[0]?.status ?? "queued";
  return { sid: data.data.id, status };
}

export async function placeCall(args: {
  to: string;
  from: string;
  twimlUrl: string;
  webhookUrl?: string;
}): Promise<{ sid: string; status: string }> {
  const key = getApiKey();
  const connectionId = process.env.TELNYX_TEXML_CONNECTION_ID;
  if (!connectionId) {
    throw new Error("TELNYX_TEXML_CONNECTION_ID not set");
  }

  const params = new URLSearchParams();
  params.set("From", args.from);
  params.set("To", args.to);
  params.set("Url", args.twimlUrl);
  if (args.webhookUrl) params.set("StatusCallback", args.webhookUrl);

  const r = await fetch(
    `https://api.telnyx.com/v2/texml/calls/${encodeURIComponent(connectionId)}`,
    {
      method: "POST",
      headers: {
        Authorization: bearerAuth(key),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Telnyx Call ${r.status}: ${txt}`);
  }

  // TeXML create-call returns Twilio-shaped XML when Accept is */* or
  // text/xml, JSON otherwise. We don't set Accept so the response is XML.
  // We don't actually need the response body — Telnyx queues the call —
  // but cadence.ts wants a sid + status for storage. Generate a stable id
  // from the response if possible, fall back to a placeholder we'll
  // overwrite when the status webhook lands.
  const txt = await r.text();
  const sidMatch = txt.match(/<Sid>([^<]+)<\/Sid>/);
  const statusMatch = txt.match(/<Status>([^<]+)<\/Status>/);
  return {
    sid: sidMatch?.[1] ?? "",
    status: statusMatch?.[1] ?? "queued",
  };
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
