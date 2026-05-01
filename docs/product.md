# Product

## What Dragun is

Production SaaS that recovers delinquent revenue for SMBs across email,
SMS, and voice — fully bilingual (FR-CA / EN-CA), Quebec-first.

An SMB owner signs up, onboards their business in under 5 minutes,
adds one delinquent customer, and walks away. Dragun runs the 14-day
recovery cadence in their brand voice, in the customer's language,
and books the payment when it lands. Dragun keeps 5 % of recovered
funds. The owner pays nothing if nothing is recovered.

The wedge market is **independent gyms in Quebec** — predictable
monthly dues, predictable failure modes (expired card, member
ghosting), and owners who currently call delinquents themselves
between sets. The architecture is vertical-agnostic so salons, dental
clinics, language schools, music schools, pilates studios, and any
SMB with recurring revenue can self-onboard the same way.

## Launch on 2026-05-01 at 15:30

**Audience:** Mounir Rami, owner of Venice Gym Charlesbourg. He is
simultaneously our first investor and our first paying customer.
The meeting is at his gym in Charlesbourg.

**Win conditions, ordered:**

1. **Mounir signs up live, onboards Venice Gym, and starts a real
   campaign against a real delinquent member during the meeting.**
   The system sends the email, the SMS, and the voice call to the
   member's phone in French. He sees his own SaaS work end-to-end on
   his own data.
2. **The dashboard, landing, debtor communications, and pay link are
   fully French by default** for Venice Gym, with EN as a one-click
   toggle. Quebec Bill 96 compliance is the floor, not a feature
   request.
3. **We leave the room with both** (a) a wired investment commitment
   and (b) a 12-month Venice Gym contract, because the product he
   touched is the product he keeps using.

## Production scope shipped on 2026-05-01

This is what `dragun.app` actually does on launch day:

- **Auth.** Google OAuth + email/password via Supabase. (Done by user
  in parallel. Profiles table mirrors `auth.users`, populated by
  trigger.)
- **Onboarding wizard.** `/welcome` collects business name, default
  locale (FR/EN), brand mark, signature. Creates an `organizations`
  row and binds the user as `owner` in `org_members`.
- **Operator dashboard.** `/app` lists the org's cases with a status
  pill, amount, days-overdue, channels touched, recovered total.
  `/app/cases/new` is a single form that creates a case + debtor and
  starts the 14-day campaign immediately (or scheduled).
- **Cross-channel cadence engine.** A Vercel cron tick advances each
  open campaign and fires the next scheduled `campaign_event` via
  Resend (email), Twilio (SMS), Twilio TwiML `<Say>` (voice). All
  templates have an EN and a FR variant.
- **Debtor pay link.** `/p/<slug>` is a public page in the debtor's
  locale. Stripe Checkout (Apple Pay / Google Pay first) settles the
  amount to the Dragun platform Stripe account. Dragun reconciles
  and pays the SMB out manually for the first cohort; Stripe Connect
  Express for SMB payouts is v2.
- **Bilingual surfaces.** Landing, dashboard, communications, pay
  link, legal — everything has EN and FR strings, with a cookie-based
  locale toggle that defaults to FR for Quebec IPs.
- **No scripted "demo" route.** The product itself is the demo:
  prospects sign up at `/auth/sign-up`, complete onboarding, import
  a CSV (or add a single test customer), and watch a real campaign
  fire. The previous scrub-through scripted player has been removed.

## Out of scope for 2026-05-01

- **Stripe Connect Express.** Manual reconciliation for the first
  cohort. Dragun receives the full amount, pays out 95 % to the SMB
  by interac / wire weekly. Mounir signs an addendum that this is the
  v1 settlement path.
- **10DLC SMS registration.** Twilio trial mode with verified
  destinations only for live sends. Mounir's debtor's phone is
  added to the verified list pre-meeting. Production carrier
  registration is a 1–4 week post-launch process.
- **ElevenLabs / conversational voice agents.** Twilio `<Say>`
  reads scripted FR / EN copy. Natural-voice upgrade is post-launch.
- **Multi-user orgs.** One owner per organization; team invites are
  v2.
- **Marketplace / public templates / themes.** Brand customization is
  display-name + logo + signature only.
- **Analytics dashboards beyond the case list.** No funnel charts,
  no cohort reports, no Looker. Recovered total + status pills only.

## Why this scope

22 hours. Mounir buys polish and a working channel demo against his
real data, not analytics depth. The architecture supports the v2
features (Stripe Connect, multi-user orgs, advanced reporting), but
the launch ships only the surfaces an SMB owner needs to: sign up,
add one customer, see one campaign run, get paid for one recovery.
That is the entire purchase decision.

## After 2026-05-01

If Mounir aligns referrals during or after the meeting, every other
gym owner he points at us must be able to sign up at `dragun.app`,
finish onboarding in 5 minutes, add a delinquent member, and watch
the same cadence play out for their own customer. **No human in the
loop.** Self-serve onboarding is the test of "did we ship a product"
versus "did we ship a demo."

The scripted `/demo?client=<slug>` route stays alive permanently as
a top-of-funnel sales surface — fixture-only, zero-credential,
shareable on a phone in 30 seconds.

## Success metric for the build phase

By 2026-05-01 14:30 (T-1h before Mounir):

1. `https://dragun.app/auth/sign-up` works for a brand-new email
   never seen before. Google OAuth works. Email works.
2. A fresh signup can complete `/welcome`, land on `/app`, create a
   case, and the email + SMS + voice fire in real time to a verified
   phone in the chosen locale.
3. `https://dragun.app/p/<slug>` returns a Stripe Checkout in the
   debtor's locale. Successful test charge with a Stripe test card.
4. Locale toggle works on every public surface and on `/app`.
5. A 60-second fallback screencast of the full live signup-to-recovery
   flow is recorded for if the room WiFi is hostile.
