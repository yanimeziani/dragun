import { createHmac, timingSafeEqual } from "crypto";

const STRIPE_API = "https://api.stripe.com/v1";

export type CheckoutArgs = {
  amountCents: number;
  currency: string;
  description: string;
  caseId: string;
  paylinkSlug: string;
  locale: "fr" | "en";
  origin: string;
};

export async function createCheckoutSession(
  args: CheckoutArgs,
): Promise<{ url: string; id: string }> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY not set");

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set(
    "line_items[0][price_data][currency]",
    args.currency.toLowerCase(),
  );
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(args.amountCents),
  );
  params.set(
    "line_items[0][price_data][product_data][name]",
    args.description || "Dragun",
  );
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", `${args.origin}/p/${args.paylinkSlug}/thanks`);
  params.set("cancel_url", `${args.origin}/p/${args.paylinkSlug}`);
  params.set("metadata[case_id]", args.caseId);
  params.set("metadata[paylink_slug]", args.paylinkSlug);
  params.set("locale", args.locale === "fr" ? "fr" : "en");
  params.set("payment_method_types[0]", "card");
  params.set("automatic_tax[enabled]", "false");

  const r = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Stripe checkout ${r.status}: ${txt}`);
  }

  const data = (await r.json()) as { id: string; url: string };
  return { url: data.url, id: data.id };
}

export function verifyWebhookSignature(
  payload: string,
  header: string | null,
  secret: string,
  toleranceSec = 300,
): boolean {
  if (!header) return false;
  const parts: Record<string, string> = {};
  for (const piece of header.split(",")) {
    const [k, v] = piece.trim().split("=", 2);
    if (k && v) parts[k] = v;
  }
  if (!parts.t || !parts.v1) return false;

  const ts = Number(parts.t);
  if (!Number.isFinite(ts)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > toleranceSec) return false;

  const expected = createHmac("sha256", secret)
    .update(`${parts.t}.${payload}`)
    .digest("hex");
  const provided = parts.v1;
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}
