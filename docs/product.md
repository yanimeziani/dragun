# Product

## What Dragun is

Automated cross-channel debt recovery for SMBs. Email, SMS, and voice
sequences run on a 14-day timeline against delinquent customers. The
operator sees a case dashboard; the debtor sees a ramping cadence of
messages that ends in either payment or a human handoff.

The wedge market is **independent gyms** — recurring monthly dues,
predictable failure modes (expired card, member ghosting), and owners
who currently call delinquents themselves between sets.

## Demo on 2026-05-01 at 15:30

**Audience:** Mounir Rami, owner of Venice Gym Charlesbourg (Quebec).
He is simultaneously our first investor and our first prospective
client. He gets one demo; it has to land on both axes.

**Win conditions, ordered:**

1. Mounir's phone receives a real email, a real SMS, and a real voice
   call during the meeting, branded "Venice Gym Charlesbourg," in
   French. He sees the system work on his own device.
2. The investor narrative on `/` reads like a company that already has
   a wedge, not a pitch deck — live counter, real demo link, real
   product screenshots above the fold.
3. We leave the room with either (a) a wired investment commitment, or
   (b) a signed LOI to deploy at Venice Gym, or both.

**Out of scope for 2026-05-01:**

- Sending to anyone other than Mounir's verified phone (Twilio trial
  mode; 10DLC registration for production Canadian SMS takes weeks).
- Multi-tenant auth, billing, payment capture, Stripe.
- A real ElevenLabs / conversational voice agent — Twilio `<Say>` reads
  a French script. Natural-voice upgrade is post-demo.
- Operator-facing dashboard beyond what `/demo` already shows.

## Why this scope and not more

Twenty-eight hours from spec to live demo. Every hour spent on
production-grade plumbing (auth, billing, multi-tenant) is an hour
not spent on the surface Mounir actually sees. The bet: Mounir will
sign on polish + a working channel demo to his own phone, not on
backend depth he can't observe.

## After the meeting

If Mounir aligns referrals, the system has to demo to other gym
owners with a one-line config change:

```
/demo?client=<gym-slug>&live=1&phone=<verified-e164>
```

Architecture must keep that promise. See `architecture.md`.

## Success metric for the build phase

By 2026-05-01 14:30 (one hour before Mounir arrives), all of:

- `https://dragun.app/demo?client=venice-gym&live=1` triggers email +
  SMS + voice call to a verified phone, in French, with Venice Gym
  branding, end-to-end, on production Vercel.
- `https://dragun.app/` is investor-ready (no Lorem, no broken links,
  no "Atlas Athletic" copy leakage).
- A 60-second fallback video of the live flow is recorded in case the
  network in the meeting room is hostile.
