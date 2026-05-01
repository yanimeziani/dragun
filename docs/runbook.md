# Launch runbook — 2026-05-01, 15:30 at Venice Gym Charlesbourg

This is a real first-customer launch, not a scripted demo. Mounir
signs up live, onboards Venice Gym, creates a real case, and the
system runs against his data.

## T-24h (today, 2026-04-30)

**Venue:** Venice Gym Charlesbourg. **Mounir's number:** in your
contacts already → pull it now in E.164 form.

- [ ] Add Mounir's mobile to Twilio's verified caller-IDs and
      complete OTP today (cover with: "doing some carrier stuff").
      The surprise tomorrow is "watch *your* phone light up," not
      "let's verify a number first."
- [ ] Create Stripe test-mode account, generate keys, register
      webhook to `https://dragun.app/api/webhooks/stripe`.
- [ ] Create Supabase Cloud `dragun-prod`, link from this repo,
      `supabase db push`. Verify all schema tables present.
- [ ] All 12 env vars set in Vercel (Production + Preview):
      Supabase URL/publishable/service-role, Resend key/from/lead-to,
      Twilio SID/token/from-number, Stripe secret/publishable/webhook.
- [ ] Treat Venice Gym's guest WiFi as hostile. Phone tether is the
      default. Test the tether against the laptop you'll demo from
      *before you leave*.
- [ ] Charge laptop, phone, backup battery. Throw a USB-C cable in
      the bag. Bring earbuds or a small Bluetooth speaker so the
      Twilio voice call is audible in a noisy gym lobby.

## Hot-edit posture

You said you'll take suggestions in the room and edit live. The
setup supports this if you arrange it:

- Open `app/_lib/i18n/fr.ts` and `app/_data/clients/venice-gym.ts`
  in your editor before walking in. Most copy edits live in those
  two files.
- Run `npm run dev` on `localhost:3000` next to the production tab.
  Demo from prod (the impressive URL); use localhost as the scratch
  surface for quick text edits with hot-reload.
- For prod-visible edits during the meeting, push to `main` from the
  laptop — Vercel auto-deploys in ~30s. Don't push uncommitted work
  in front of him; stage, commit with a real message, push. Even
  small things look slow if they fail.
- Keep `stories.md` open. New asks Mounir surfaces ("can it also do
  X?") become new stories at the bottom of the file, not in-meeting
  promises.

## T-2h (2026-05-01, 13:30)

- [ ] Open Vercel; confirm latest `main` is the production
      deployment, build green, cron registered.
- [ ] Re-verify Mounir's number on Twilio if it's been > 24h since
      the OTP.
- [ ] Smoke the full live flow against your own verified phone:
      sign up a throwaway account, create an org, create a case,
      see email + SMS + call land within 5 min, complete a Stripe
      test payment. Delete the test data after.
- [ ] Sign up a throwaway account, walk the full onboarding +
      single-case-create + CSV-import flow against your own verified
      phone. Record what you see. The product itself is the demo.
- [ ] Open `runbook.md` and `stories.md` on a second monitor. Have
      the fallback screencast (`public/demo-fallback.mp4` or Drive
      link below) one click away.

## T-30m (2026-05-01, 15:00)

- [ ] Hard-refresh the prod URL; confirm no stale build.
- [ ] Tail Supabase logs (Studio → Logs).
- [ ] Tail Twilio Debugger.
- [ ] Tail Stripe events (`stripe listen --forward-to ...` if you
      brought the Stripe CLI; otherwise dashboard tab open).
- [ ] Phone on silent + face-up so the room can see notifications
      land on Mounir's screen.

## In the meeting (~12 min)

1. **Hook (1 min).** "Mounir, before I show you anything — phone
   number?" Type it once into the form below; the surprise lands
   later when his phone goes off.

2. **Investor framing (3 min).** Scroll `dragun.app` top to bottom
   in *FR mode*. The product is for SMBs in Quebec; the surface
   should look like it. Toggle to EN once to show the bilingual
   front, back to FR.

3. **Live launch (6 min) — this is the close.**
   - "Let's set up Venice Gym right now." Open `dragun.app`, sign
     in with Google as Mounir (or hand him the laptop and let him
     sign up). 60 seconds.
   - `/welcome`: business name "Venice Gym Charlesbourg," locale
     FR, brand color his brand, signature "Mounir et l'équipe."
     Submit. 60 seconds.
   - `/app/cases/new`: "Pick a real member who's behind on April
     dues." Type the name + email + phone you pre-cleared with him.
     Amount, currency CAD, description "Cotisation avril,"
     description in FR. **Don't toggle "send first email
     immediately" yet** — that's the punchline.
   - "Hit launch." Toggle the immediate-send. The day-0 email lands
     within 3 seconds.
   - Talk for 60s about the cadence; at +5min the SMS will
     scheduled tick (or for the demo, force the cron to tick now
     via an admin link or just open the URL — TBD before T-2h).
   - Voice call rings the verified phone. Pick up. The system
     reads the FR script.
   - Open `/p/<slug>` on the laptop. "Imagine your member tapped
     the link in the SMS — this is what they see." Scroll.

4. **Close, two prongs (2 min).**
   - **Investor close:** "Here's the round, here's what we close
     this week, here's the use of funds."
   - **Client close:** "Sign this 12-month contract, you keep the
     login you just used. We start ingesting your delinquent list
     Monday." Both asks are on the same conversation; let him pick
     which to answer first.

## If something breaks

| Failure                              | Recover                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| Email doesn't arrive in 30s          | Check Resend dashboard. If Resend is down, skip that channel and verbalize what *would* arrive. |
| SMS doesn't arrive                   | Check Twilio Debugger. Most likely cause: number not verified.          |
| Call fails                           | Same as above. Pivot: "Let me play you the recording I made earlier."   |
| Stripe Checkout 500s                 | Show the test mode in the dashboard, walk through manually.             |
| Vercel deploy is broken              | Switch to `public/demo-fallback.mp4` (or Drive link). Keep narrating.   |
| Network in the room is unusable      | Tether off your phone. Pre-test that the tether actually works.         |
| Sign-up flow errors out              | Pre-create an "owner@venice-charlesbourg.test" account; sign in instead of sign up. |

## Fallback assets

- Local screencast: `public/demo-fallback.mp4` (gitignored if > 5 MB).
- Drive link (fill in after S15 dry run): `<TBD>`
- One-pager PDF for Mounir to walk away with: `<TBD>`
- Pre-built throwaway owner account: `<TBD — create at T-2h>`

## After the meeting

- [ ] Same-hour thank-you email with LOI / wire instructions.
- [ ] If he aligned referrals, ask for warm intros now, with names,
      while he's still holding the phone you just demoed on.
- [ ] Open new stories in `stories.md` for any breakage observed
      during the demo. Do not close out tasks for things you faked.
- [ ] Within 24h: email each new prospect their direct sign-up URL
      (`dragun.app/auth/sign-up`). They onboard their own business in
      5 minutes; the live product is the only demo we offer now.
