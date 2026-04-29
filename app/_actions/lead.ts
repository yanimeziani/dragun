"use server";

export type LeadState =
  | { status: "idle" }
  | { status: "ok"; name: string }
  | { status: "error"; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  // Honeypot — bots tend to fill every visible field
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "ok", name: "" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name) return { status: "error", error: "Tell us your name." };
  if (!EMAIL_RE.test(email))
    return { status: "error", error: "That email looks off." };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL ?? "founders@dragun.app";
  const from = process.env.RESEND_FROM_EMAIL ?? "Dragun <alpha@dragun.app>";

  const subject = `New alpha request — ${business || name}`;
  const text = [
    `Name      : ${name}`,
    `Email     : ${email}`,
    `Business  : ${business || "—"}`,
    `Location  : ${location || "—"}`,
    `Note      : ${note || "—"}`,
    ``,
    `— Sent from dragun.app`,
  ].join("\n");

  if (!apiKey) {
    // Soft-success in dev / preview without keys.
    console.log("[dragun:lead] RESEND_API_KEY missing — captured locally:");
    console.log(text);
    return { status: "ok", name };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[dragun:lead] resend error", res.status, body);
      return {
        status: "error",
        error: "Couldn't reach our mailroom. Try founders@dragun.app.",
      };
    }
  } catch (e) {
    console.error("[dragun:lead] network error", e);
    return {
      status: "error",
      error: "Network blip on our end. Try founders@dragun.app.",
    };
  }

  return { status: "ok", name };
}
