# Dragun

Automated debt recovery for SMBs — across email, SMS and voice.
Marketing site, investor surface, and a live, scrub-able demo of one
campaign from both the operator's and the debtor's perspective.

```
/                  ledger-spectral landing + investor pitch
/demo              two-pane live demo: operator (Atlas Athletic) + debtor (Alex Carter)
/opengraph-image   1200×630 PNG generated with next/og
/icon.svg          brand favicon
```

## Stack

- Next.js 16 (App Router)
- React 19, TypeScript
- Tailwind CSS 4 (`@theme inline` tokens)
- `next/font/google` for **Instrument Serif** · **Instrument Sans** · **JetBrains Mono**
- One client island for the live counter, one for the demo
- One server action that posts leads to **Resend** via REST (no SDK dep)

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

> If you're running this from WSL on a `/mnt/c/...` path, Next 16's SWC
> binary may bus-error on the 9p mount. Run `npm run dev` from native
> Windows (PowerShell, VS Code terminal) or copy the project into the
> Linux filesystem.

## Production build

```bash
npm run build
npm run start        # serves the prerendered output
```

All public routes (`/`, `/demo`, `/icon.svg`) prerender as static.
`/opengraph-image` runs on the edge (required by `next/og`).

## Environment variables

Drop these into Vercel / your host before deploy. The app degrades
gracefully if any are missing — the alpha-access form will log the
lead to the server console instead of mailing it.

| Name                | Purpose                            | Example                              |
| ------------------- | ---------------------------------- | ------------------------------------ |
| `RESEND_API_KEY`    | Server-side Resend API key         | `re_xxxxxxxxxxxxxxxx`                |
| `RESEND_FROM_EMAIL` | Verified Resend sender             | `Dragun <alpha@dragun.app>`          |
| `LEAD_TO_EMAIL`     | Where to mail new alpha requests   | `founders@dragun.app`                |

## Deploy to Vercel

```bash
npx vercel --prod
```

…or push the repo and connect it from the Vercel dashboard. No build
config needed — `next build` is detected automatically. After the
first deploy, set the three env vars above in **Project → Settings →
Environment Variables**, then redeploy.

## The /demo flow

`/demo` is a single screen with three regions:

1. **Control bar** — play / pause / reset / skip, scrubber over the
   14-day timeline, and a 1× / 4× / 16× speed toggle.
2. **Operator pane** (left) — Atlas Athletic's view of case `DR-1042`.
   Status, amount, channel touches, KPI strip, and a live transmission
   feed that fills in as the cursor advances.
3. **Debtor pane** (right) — Alex Carter's iPhone notifications stream.
   Email, SMS, voice, and Apple-Pay confirmation cards land in real
   time as the campaign progresses.

The whole campaign — three emails, two text messages, one voice call,
one Apple-Pay completion, one receipt — replays in ~5 seconds at 16×.

## File map

```
app/
├─ layout.tsx                 root, fonts, metadata
├─ globals.css                Tailwind + theme tokens, grain, scanline
├─ page.tsx                   landing + investor sections
├─ icon.svg                   brand favicon
├─ opengraph-image.tsx        dynamic 1200×630 OG image (edge)
├─ _actions/
│  └─ lead.ts                 server action → Resend REST
├─ _components/
│  ├─ live-counter.tsx        ticking $ recovered counter
│  └─ alpha-form.tsx          lead form (useActionState + useFormStatus)
└─ demo/
   ├─ page.tsx                /demo route shell
   └─ _demo.tsx               two-pane scenario player
```
# dragun
