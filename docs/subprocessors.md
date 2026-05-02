# Subprocessor register

The third-party services Dragun relies on to deliver the product. Reviewed
quarterly (next: 2026-Q3). Cross-referenced from the privacy policy.

| # | Vendor | Function | Region | Criticality | DPA | SOC 2 / ISO | Last reviewed |
|---|---|---|---|---|---|---|---|
| 1 | **Supabase** | Postgres database, auth, storage | ca-central-1 | Critical | DPA on file (manops §1.3) | SOC 2 Type II ([report](https://supabase.com/security)) | 2026-05-02 |
| 2 | **Vercel** | Web hosting, edge runtime, image optimization | Global edge, primary `iad1` | Critical | DPA on file | SOC 2 Type II ([trust portal](https://vercel.com/trust)) | 2026-05-02 |
| 3 | **Stripe** | Payments (paylinks + subscription billing) | Global | Critical | DPA bundled with TOS ([page](https://stripe.com/legal/dpa)) | SOC 1 Type II + SOC 2 Type II + PCI DSS Level 1 | 2026-05-02 |
| 4 | **Resend** | Transactional email delivery | US/EU | High | DPA on request | SOC 2 Type II ([trust](https://resend.com/security)) | 2026-05-02 |
| 5 | **Telnyx** | SMS + voice agent (TeXML) | US-anchored, Canadian PoPs | High | DPA on file | SOC 2 Type II + ISO 27001 + HIPAA ([trust](https://telnyx.com/security)) | 2026-05-02 |
| 6 | **Google (OAuth)** | Sign-in identity provider (profile + email scopes only) | Global | Medium | Standard Google Cloud terms | SOC 2 Type II + ISO 27001/27017/27018 | 2026-05-02 |
| 7 | **Sentry** | Error tracking (DSN-conditional, scrubs PII before send) | US | Medium | DPA on file | SOC 2 Type II ([trust](https://sentry.io/security/)) | 2026-05-02 |
| 8 | **Logflare** | Log drain for Supabase + Vercel runtime logs | US | Medium | Subprocessor of Supabase; same DPA path | SOC 2 (via Supabase) | 2026-05-02 |
| 9 | **GitHub** | Source control, CI runner | Global | Medium | DPA bundled | SOC 2 Type II + ISO 27001 | 2026-05-02 |

## Per-vendor data scope

### Supabase
- **Stores:** organizations, org_members, cases, debtors (full_name, email, phone_e164, locale), campaign_events, payments, subscriptions, audit_events
- **Encryption:** at-rest (AES-256, managed by Supabase), in-transit TLS 1.2+
- **Key rotation:** quarterly (manops §2.1) for the service-role key

### Vercel
- **Stores:** rendered HTML/JSON responses in CDN cache; runtime logs (1-day retention on Hobby, 30-day on Pro); environment variables (encrypted at rest)
- **No customer data persisted** beyond cache TTL

### Stripe
- **Stores:** payer email (Checkout-collected), payment metadata (case_id, paylink_slug, org_id, plan), customer + subscription objects
- **PCI scope:** card data never touches Dragun servers — Checkout-hosted

### Resend
- **Stores:** rendered email HTML (subject + body) for delivery + retention per their plan
- **Bounce handling:** webhook to be wired (post-launch)

### Telnyx
- **Stores:** SMS body, call TeXML scripts, recipient phone, delivery webhooks
- **Subprocessor:** carriers (Canadian long-code requires no extra registration for Canada-to-Canada A2P traffic; US 10DLC registration deferred to post-launch when US destinations are added)
- **Auth:** bearer token (`TELNYX_API_KEY`) over TLS; webhook signatures verified via Ed25519 public key

### Google (OAuth)
- **Stores:** OAuth client secret (Vercel envs); end-user identity claims passed back to Supabase Auth
- **Scope:** `openid email profile` only — no offline access, no refresh tokens stored on Dragun side

### Sentry
- **DSN-conditional:** if `SENTRY_DSN` unset, no data leaves; otherwise scrubbed events
- **Scrub allow-list:** see `app/_lib/log.ts` `PII_KEYS`

### Logflare
- **Stores:** structured logs; 90-day retention
- **PII:** Pino scrubber strips email/phone/payload/body before serialization

### GitHub
- **Stores:** source code, PR/issue history, CI logs
- **Scope:** organization repository; secrets scanned by GitHub Advanced Security (free for public repos; paid otherwise)

## Lora (Google Fonts)

`next/font/google` self-hosts the Lora typeface at build time — no runtime
connection to fonts.googleapis.com. Google receives no end-user data while
the site is running. **Not listed as a subprocessor** because no data flows
in production.

## Subprocessor change procedure

1. Adding a vendor: append a row, document data scope, attach DPA + SOC 2 link
2. Update privacy policy to reference the new vendor
3. Notify customers via email if the change materially expands data scope (per privacy policy commitment)
4. Reassess at the next quarterly cycle

## Cross-references

- Privacy policy: `app/legal/_content/privacy.ts`
- ManOps DPA collection schedule: [`soc2-manops.md`](./soc2-manops.md) §1.3
