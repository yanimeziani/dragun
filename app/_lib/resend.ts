export type SendEmailArgs = {
  to: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(
  args: SendEmailArgs,
): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
      text: args.text,
      reply_to: args.replyTo,
    }),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Resend ${r.status}: ${txt}`);
  }

  const data = (await r.json()) as { id: string };
  return { id: data.id };
}
