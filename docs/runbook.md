# Demo runbook — 2026-05-01, 15:30

## T-24h (today, 2026-04-30)

**Venue:** Venice Gym Charlesbourg (we go to him).
**Mounir's number:** in your phone contacts already → pull it now in
E.164 form (`+1XXXXXXXXXX`) and paste into Twilio verified caller-IDs.

- [ ] Add Mounir's mobile to Twilio's verified caller-ID list.
      Trigger Twilio's verification call/SMS, ask Mounir to read the
      OTP back ("for a quick test tomorrow") — do NOT spoil the demo.
- [ ] Treat Venice Gym's guest WiFi as hostile. Tether off your
      phone is the default; verify the tether works on the laptop
      that runs the demo before you leave.
- [ ] Charge laptop, charge phone, charge backup battery, throw a
      USB-C cable in the bag.
- [ ] Note from the venue: gym lobbies are loud — wear earbuds /
      bring a small Bluetooth speaker so the room can hear the
      Twilio voice call.

## T-2h (2026-05-01, 13:30)

- [ ] Open Vercel; confirm latest `main` is the production
      deployment and shows green build.
- [ ] Verify env vars in Vercel match `architecture.md`:
      `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_TO_EMAIL`,
      `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`,
      `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Confirm Mounir's number is on Twilio's verified caller-ID list.
      Re-verify with a fresh OTP if it's been > 24h.
- [ ] Hit `/demo?client=venice-gym` (scripted) and click through it
      end to end. No Atlas Athletic leakage, no English strings.
- [ ] Hit `/demo?client=venice-gym&live=1&phone=<your-own-e164>`
      against your own phone. Confirm email + SMS + call land.
- [ ] Open `runbook.md` and `stories.md` on a second monitor. Keep
      the fallback screencast (`public/demo-fallback.mp4` or Drive
      link below) one click away.

## Hot-edit posture

You said you'll take suggestions in the room and edit live. The setup
supports this if you arrange it:

- Open `app/_data/clients/venice-gym.ts` in your editor before walking
  in. All copy, brand strings, and the campaign script live there —
  one file to grep when Mounir says "no, say it like *this*."
- Run `npm run dev` on `localhost:3000` *next to* the production tab.
  Demo from prod (it's the impressive URL); use localhost as the
  scratch surface for quick text edits with hot-reload.
- For prod-visible edits during the meeting, push to `main` from the
  laptop — Vercel auto-deploys in ~30s. Don't push uncommitted work
  in front of him; stage, commit with a real message, push. Even
  small things look slow if they fail.
- Keep `stories.md` open too. New asks Mounir surfaces ("can it also
  do X?") become new stories, not promises.

## T-30m (2026-05-01, 15:00)

- [ ] Hard-refresh the Vercel prod URL; confirm no stale build.
- [ ] Tail Supabase logs (Studio → Logs) so failed sends are visible.
- [ ] Tail Twilio Debugger so failed calls/SMS surface in real time.
- [ ] Phone on silent + face-up so the room can see the
      notifications land on Mounir's screen during the demo.

## In the meeting

**Order, ~12 minutes:**

1. **Hook (1 min).** "Mounir, before I show you anything, can I ask
    your phone number? I want to demo this *on your phone*, not mine."
    Type it into the URL.
2. **Investor framing (3 min).** Scroll `/` top to bottom. Say what
    Dragun is, the gym wedge, the recovered-dollars counter. Don't
    sell the product yet — sell the company.
3. **Live demo (5 min).** Open
    `/demo?client=venice-gym&live=1&phone=<his-e164>`. Hit play.
    Narrate what's happening as each channel fires:
    - "There's the email — check your inbox."
    - "There's the SMS — check your messages."
    - "And here comes the call — pick up."
    He picks up; Twilio reads the French script.
4. **Close, two prongs (3 min).**
    - **Investor close:** "Here's the round, here's what we close on
       this week, here's the use of funds."
    - **Client close:** "I can have Venice Gym live in seven days.
       Sign this LOI and we start ingesting your delinquent list
       Monday."
    Both asks live in the same conversation; let him pick which one
    to answer first.

## If something breaks

| Failure                              | Recover                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| Email doesn't arrive in 30s          | Check Resend dashboard. If down, skip and verbalize what *would* arrive. |
| SMS doesn't arrive                   | Check Twilio Debugger. Most likely cause: Mounir's number not verified. |
| Call fails                           | Same as above. Pivot to: "Let me play you the recording I made earlier." |
| Vercel deploy is broken              | Switch to `public/demo-fallback.mp4` (or Drive link). Keep narrating.    |
| Network in the room is unusable      | Tether off your phone. Pre-test that the tether actually works.          |

## Fallback assets

- Local screencast: `public/demo-fallback.mp4` (gitignored if > 5 MB).
- Drive link (fill in after S8): `<TBD — paste here after S8 dry run>`
- One-pager PDF for Mounir to walk away with: `<TBD>`

## After the meeting

- [ ] Send a same-day thank-you email with the LOI and/or wire
      instructions attached. Same hour, not same day.
- [ ] If he aligned referrals, ask for warm intros *now*, with names,
      while he's holding the phone you just demoed on.
- [ ] Open a new story in `stories.md` for any breakage observed
      during the demo. Do not close out tasks for things you faked.
