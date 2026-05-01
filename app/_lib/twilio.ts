function getCreds() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set");
  }
  return { sid, token };
}

function basicAuth(sid: string, token: string): string {
  return `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`;
}

export async function sendSms(args: {
  to: string;
  from: string;
  body: string;
  statusCallback?: string;
}): Promise<{ sid: string; status: string }> {
  const { sid, token } = getCreds();
  const params = new URLSearchParams();
  params.set("To", args.to);
  params.set("From", args.from);
  params.set("Body", args.body);
  if (args.statusCallback) params.set("StatusCallback", args.statusCallback);

  const r = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: basicAuth(sid, token),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Twilio SMS ${r.status}: ${txt}`);
  }

  const data = (await r.json()) as { sid: string; status: string };
  return { sid: data.sid, status: data.status };
}

export async function placeCall(args: {
  to: string;
  from: string;
  twiml: string;
  statusCallback?: string;
}): Promise<{ sid: string; status: string }> {
  const { sid, token } = getCreds();
  const params = new URLSearchParams();
  params.set("To", args.to);
  params.set("From", args.from);
  params.set("Twiml", args.twiml);
  if (args.statusCallback) params.set("StatusCallback", args.statusCallback);

  const r = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`,
    {
      method: "POST",
      headers: {
        Authorization: basicAuth(sid, token),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Twilio Call ${r.status}: ${txt}`);
  }

  const data = (await r.json()) as { sid: string; status: string };
  return { sid: data.sid, status: data.status };
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
