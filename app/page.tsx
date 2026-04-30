import { AlphaForm } from "./_components/alpha-form";

export default function Home() {
  return (
    <main className="relative">
      <TopBar />
      <Nav />
      <Hero />
      <Problem />
      <Channels />
      <Mechanism />
      <Dashboard />
      <Compliance />
      <Distribution />
      <Investor />
      <Footer />
    </main>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Brand mark                                                */
/* ────────────────────────────────────────────────────────── */

function Mark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      className={className}
      aria-hidden
    >
      <path d="M3.5 4.5 H20.5" />
      <path d="M12 4.5 V19.5" />
      <path d="M6 13 L12 19.5 L18 13" />
      <circle cx="12" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Top status bar                                            */
/* ────────────────────────────────────────────────────────── */

function TopBar() {
  return (
    <div className="border-b border-line bg-ink-1/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span>Online · 04·30·2026</span>
          <span className="hidden md:inline">For small businesses</span>
          <span className="hidden lg:inline">Reminder hours · 08:00–20:59 local</span>
        </div>
        <div className="flex items-center gap-x-6 gap-y-1">
          <span className="hidden sm:flex items-center gap-2">
            <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
            <span className="text-bone-2">Public alpha · 50 seats</span>
          </span>
          <span>v.0.4 · Pre-seed</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Nav                                                       */
/* ────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3 text-bone">
          <Mark className="h-5 w-5" />
          <span className="font-display text-xl tracking-tight">Dragun</span>
          <span className="hidden lg:inline font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone-3">
            ™ · Get paid
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-5 lg:gap-8 font-mono text-[12px] lg:text-sm uppercase tracking-[0.18em] text-bone-2">
          <li><a href="/demo" className="text-ember hover:text-bone">Live demo</a></li>
          <li><a href="#mechanism" className="hover:text-bone">How it works</a></li>
          <li><a href="#dashboard" className="hover:text-bone">Ledger</a></li>
          <li><a href="#compliance" className="hover:text-bone">Compliance</a></li>
          <li><a href="#alpha" className="hover:text-bone">Alpha</a></li>
          <li><a href="#investor" className="hover:text-bone">Investors</a></li>
        </ul>
        <a
          href="/demo"
          className="group inline-flex md:hidden items-center gap-2 border border-ember px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ember"
        >
          Live demo
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
        <a
          href="#investor"
          className="group hidden md:inline-flex items-center gap-2 border border-bone/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-bone hover:border-ember hover:text-ember transition-colors"
        >
          Request memo
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </nav>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Hero                                                      */
/* ────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="ember-floor" aria-hidden />
      <div className="scanline" aria-hidden />
      <div className="scanline delay" aria-hidden />

      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(236,228,210,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(236,228,210,1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pt-24 pb-32 md:pt-32 md:pb-44">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="rise font-mono text-xs sm:text-sm uppercase tracking-[0.28em] sm:tracking-[0.32em] text-bone-3">
              <span className="text-ember">●</span>&nbsp;&nbsp;Friendly invoice
              follow-up for small businesses · Est. 2026
            </p>
            <h1
              className="rise font-display mt-8 text-[clamp(2.6rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.02em] text-bone break-words"
              style={{ animationDelay: "0.08s" }}
            >
              Get paid on time.
              <br />
              <em className="italic text-bone-2">Stay friends.</em>
            </h1>
            <p
              className="rise mt-10 max-w-[44ch] text-base sm:text-lg leading-[1.55] text-bone-2 md:text-xl"
              style={{ animationDelay: "0.18s" }}
            >
              Dragun is the back-office that follows up on your unpaid
              invoices — across email, SMS and a friendly voice agent — so
              you keep the customer and still get paid. You run the shop.
              We handle the awkward part.
            </p>

            <div
              className="rise mt-10 sm:mt-12 flex flex-wrap items-center gap-3 sm:gap-4"
              style={{ animationDelay: "0.28s" }}
            >
              <a
                href="/demo"
                className="group inline-flex items-center gap-3 bg-ember px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone"
              >
                See it in action
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#alpha"
                className="group inline-flex items-center gap-3 border border-bone/50 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
              >
                Claim a seat
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#dashboard"
                className="group inline-flex items-center gap-3 border-b border-bone/40 pb-1 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone-2 transition-colors hover:text-bone hover:border-bone"
              >
                Tour the ledger
                <span className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>
          </div>

          {/* Ledger preview card */}
          <aside
            className="rise lg:col-span-4 lg:mt-2 self-start"
            style={{ animationDelay: "0.42s" }}
          >
            <div className="border border-line bg-ink-1/70 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3">
                <span>Your ledger · Preview</span>
                <span className="flex items-center gap-2 text-bone-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-bone-3/60" />
                  Mockup
                </span>
              </div>
              <div className="px-5 py-7">
                <div className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.96] tracking-tight text-bone break-words">
                  One inbox.
                  <br />
                  <em className="text-bone-2">Three channels.</em>
                </div>
                <p className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3">
                  Public alpha · 50 seats open
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-line">
                {[
                  { k: "Channels", v: "3" },
                  { k: "Campaign", v: "30d" },
                  { k: "Pricing", v: "5%" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="border-r border-line px-4 py-4 last:border-r-0"
                  >
                    <div className="num font-display text-2xl text-bone">{s.v}</div>
                    <div className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {s.k}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-line px-5 py-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-bone-3">
                  Channel arc
                </div>
                <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-[1px] bg-ink-3">
                  <span className="h-full bg-bone" style={{ width: "33.33%" }} />
                  <span
                    className="h-full bg-ember"
                    style={{ width: "33.33%" }}
                  />
                  <span className="h-full bg-moss" style={{ width: "33.34%" }} />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                  <span>Email</span>
                  <span>SMS</span>
                  <span>Voice</span>
                </div>
              </div>
            </div>

            <p className="mt-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
              Built on · Resend · Twilio · Dragun voice agent
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Problem                                                   */
/* ────────────────────────────────────────────────────────── */

function Problem() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-44">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              I. The math of getting paid
            </p>
            <p className="mt-6 font-display text-2xl sm:text-3xl leading-tight text-bone-2">
              The invoice isn&rsquo;t the problem.
              <br />
              <em>The follow-up is.</em>
            </p>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <p className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[1.08] tracking-tight text-bone break-words">
              <span className="text-ember">42%</span> of small-business invoices
              go past thirty days. By day ninety, only{" "}
              <span className="text-ember">12¢</span> on the dollar comes back.
            </p>
            <div className="mt-10 sm:mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  k: "$825B",
                  l: "Outstanding invoices held by US small businesses",
                },
                {
                  k: "31 hrs / mo",
                  l: "A typical owner spends sending reminders",
                },
                {
                  k: "1 in 6",
                  l: "Invoices written off by year three",
                },
              ].map((d) => (
                <div key={d.k}>
                  <div className="num font-display text-3xl sm:text-4xl text-bone break-words">
                    {d.k}
                  </div>
                  <div className="mt-2 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-3">
                    {d.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Channels — Resend, Twilio, Voice                          */
/* ────────────────────────────────────────────────────────── */

function Channels() {
  const channels = [
    {
      roman: "Ⅰ.",
      name: "Email",
      vendor: "Resend",
      window: "Day 0 → 7",
      cadence: "3 reminders",
      voice: "Warm, transactional, written in your brand voice.",
      detail: [
        "DKIM, SPF & DMARC alignment",
        "Threaded replies routed to your team",
        "Variable subject + sender warm-up",
      ],
    },
    {
      roman: "Ⅱ.",
      name: "SMS",
      vendor: "Twilio",
      window: "Day 5 → 14",
      cadence: "2 nudges",
      voice: "Short, kind, branded. Pay link in one tap.",
      detail: [
        "10DLC registered, A2P 10DLC pre-cleared",
        "Quiet hours by your customer's timezone",
        "Inbound STOP / HELP handled",
      ],
    },
    {
      roman: "Ⅲ.",
      name: "Voice",
      vendor: "Dragun agent",
      window: "Day 10 →",
      cadence: "Up to 3 calls",
      voice: "A friendly agent. Listens, helps, leaves a clear record.",
      detail: [
        "Real-time call recording & transcripts",
        "Calls only during local business hours",
        "Hands off to a human at the right cue",
      ],
    },
  ];
  return (
    <section
      id="channels"
      className="relative border-t border-line bg-ink-1/30"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              II. Three friendly channels
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
              Three channels, one rhythm, one inbox.
            </h2>
          </div>
          <p className="max-w-md font-sans text-bone-2">
            Every customer hears from you the same way — kindly. The cadence
            is automatic, hours-aware, and tuned to your industry.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid gap-px bg-line border border-line md:grid-cols-3">
          {channels.map((c) => (
            <article
              key={c.name}
              className="group relative bg-ink p-6 sm:p-8 transition-colors hover:bg-ink-1"
            >
              <div className="flex items-baseline justify-between font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
                <span>{c.roman} {c.name}</span>
                <span>{c.vendor}</span>
              </div>
              <h3 className="mt-5 sm:mt-6 font-display text-4xl sm:text-5xl tracking-tight text-bone">
                {c.name}
              </h3>
              <p className="mt-4 max-w-[34ch] text-bone-2 text-sm sm:text-base">{c.voice}</p>

              <ul className="mt-7 sm:mt-8 space-y-2 border-t border-line pt-5 text-sm text-bone-2">
                {c.detail.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 h-px w-3 shrink-0 bg-bone-3" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-end justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
                <span>Window {c.window}</span>
                <span>{c.cadence}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Mechanism — 30 day campaign timeline                      */
/* ────────────────────────────────────────────────────────── */

function Mechanism() {
  const days = 30;
  const lanes = [
    {
      name: "Email",
      vendor: "Resend",
      color: "var(--color-bone)",
      hits: [0, 3, 7, 14, 21],
    },
    {
      name: "SMS",
      vendor: "Twilio",
      color: "var(--color-ember)",
      hits: [5, 10, 18],
    },
    {
      name: "Voice",
      vendor: "Agent",
      color: "var(--color-moss)",
      hits: [12, 19, 26],
    },
  ];

  return (
    <section id="mechanism" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
          III. The thirty-day rhythm
        </p>
        <h2 className="mt-4 max-w-[24ch] font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
          One rhythm. Friendly start, gentle reminders, polite finish.
        </h2>
        <p className="mt-6 max-w-[60ch] text-bone-2 text-sm sm:text-base">
          Reminders unfold automatically across email, SMS and voice. You see
          every touch in a single ledger; your customers hear one consistent,
          friendly tone.
        </p>

        <div className="mt-12 sm:mt-16 border border-line bg-ink-1/40 overflow-hidden">
          {/* Day axis */}
          <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] border-b border-line">
            <div className="px-3 sm:px-4 py-3 font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
              Lane
            </div>
            <div className="relative h-9">
              <div className="absolute inset-0 flex">
                {Array.from({ length: days + 1 }).map((_, d) => (
                  <div
                    key={d}
                    className="relative flex-1 border-l border-line-soft first:border-l-0"
                  >
                    {d % 5 === 0 && (
                      <span className="absolute left-1 top-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                        {d === 0 ? "D0" : `D${d}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lanes */}
          {lanes.map((lane) => (
            <div
              key={lane.name}
              className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] border-b border-line last:border-b-0"
            >
              <div className="flex flex-col justify-center border-r border-line px-3 sm:px-4 py-4 sm:py-5">
                <span className="font-display text-lg sm:text-xl text-bone">
                  {lane.name}
                </span>
                <span className="font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                  {lane.vendor}
                </span>
              </div>
              <div className="relative h-20">
                {/* lane rail */}
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                {/* hit markers */}
                {lane.hits.map((d, i) => {
                  const pct = (d / days) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${pct}%` }}
                    >
                      <div
                        className="h-3 w-3 -translate-x-1/2 rounded-full"
                        style={{
                          background: lane.color,
                          boxShadow: `0 0 0 4px ${lane.color}22`,
                        }}
                      />
                      <div
                        className="hidden md:block absolute left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3"
                      >
                        D{d} · #{i + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Outcome bar */}
          <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] border-t border-line bg-ink">
            <div className="border-r border-line px-3 sm:px-4 py-3 sm:py-4 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
              Outcome
            </div>
            <div className="relative px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[10.5px] sm:text-xs uppercase tracking-[0.18em] text-bone-2">
                <span>Pay link · Day 0</span>
                <span>Rhythm · 30d</span>
                <span>Hand-off if &gt; D27</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Dashboard preview                                         */
/* ────────────────────────────────────────────────────────── */

function Dashboard() {
  const cases = [
    {
      id: "DR-1041",
      who: "Northridge Plumbing & Heat",
      sector: "Trades",
      amount: "$4,128.00",
      age: "27d",
      mix: ["E", "S", "V"],
      status: "PAID",
    },
    {
      id: "DR-1042",
      who: "Halstead Auto Body",
      sector: "Auto",
      amount: "$1,290.00",
      age: "14d",
      mix: ["E", "S"],
      status: "FOLLOWING UP",
    },
    {
      id: "DR-1043",
      who: "Oakwell Café Group",
      sector: "Hospitality",
      amount: "$782.50",
      age: "9d",
      mix: ["E"],
      status: "DRAFTED",
    },
    {
      id: "DR-1044",
      who: "Maritime Supply Co.",
      sector: "Wholesale",
      amount: "$9,402.00",
      age: "41d",
      mix: ["E", "S", "V"],
      status: "ATTENTION",
    },
    {
      id: "DR-1045",
      who: "Waves & Wicks LLC",
      sector: "Retail",
      amount: "$355.00",
      age: "4d",
      mix: ["E"],
      status: "DRAFTED",
    },
    {
      id: "DR-1046",
      who: "Bering Strait Logistics",
      sector: "Logistics",
      amount: "$11,008.20",
      age: "19d",
      mix: ["E", "S", "V"],
      status: "FOLLOWING UP",
    },
    {
      id: "DR-1047",
      who: "Foothill Dental Partners",
      sector: "Health",
      amount: "$2,140.75",
      age: "31d",
      mix: ["E", "S"],
      status: "PROMISED",
    },
  ];

  const events = [
    { t: "02:14", c: "VOICE", m: "Friendly call · 1m12s · they’ll pay later today", id: "DR-1041" },
    { t: "02:11", c: "EMAIL", m: "Reply received · ‘can you resend the link?’", id: "DR-1042" },
    { t: "02:09", c: "SMS", m: "Delivered · pay link tapped", id: "DR-1044" },
    { t: "02:04", c: "EMAIL", m: "Sent · friendly reminder", id: "DR-1045" },
    { t: "01:58", c: "VOICE", m: "Voicemail left · warm tone", id: "DR-1046" },
    { t: "01:52", c: "SMS", m: "Delivered · quiet hours respected", id: "DR-1047" },
  ];

  const channelStats = [
    { name: "Email", v: "Resend", start: 0, span: 70, window: "D0–D21" },
    { name: "SMS", v: "Twilio", start: 16, span: 44, window: "D5–D18" },
    { name: "Voice", v: "Agent", start: 40, span: 47, window: "D12–D26" },
  ];

  const statusColor: Record<string, string> = {
    PAID: "bg-moss text-bone border-moss",
    "FOLLOWING UP": "bg-ember/15 text-ember border-ember/40",
    DRAFTED: "bg-transparent text-bone-3 border-bone-3/40",
    ATTENTION: "bg-ember text-ink border-ember",
    PROMISED: "bg-bone text-ink border-bone",
  };

  return (
    <section id="dashboard" className="relative border-y border-line bg-ink-1/40">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              IV. Your ledger · Preview
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
              One ledger for every unpaid invoice.
            </h2>
          </div>
          <p className="max-w-md text-bone-2 text-sm sm:text-base">
            Built for small-business owners. Every customer is auditable,
            every reminder is timestamped, every payment lands in your bank.
            <span className="mt-2 block font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
              Mockup · sample data ahead of alpha
            </span>
          </p>
        </div>

        {/* App chrome */}
        <div className="mt-14 overflow-hidden border border-line bg-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
          {/* window bar */}
          <div className="flex items-center justify-between border-b border-line bg-ink-2 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-ember/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-bone-3/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-bone-3/40" />
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-3">
              app.dragun.io / ledger · preview
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-3">
              your-business
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_320px]">
            {/* Sidebar */}
            <aside className="border-b border-line lg:border-b-0 lg:border-r">
              <div className="px-5 py-5 border-b border-line">
                <div className="flex items-center gap-2 text-bone">
                  <Mark className="h-4 w-4" />
                  <span className="font-display text-base tracking-tight">
                    Dragun
                  </span>
                </div>
                <div className="mt-3 font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                  Your business
                </div>
              </div>
              <nav className="px-2 py-3 font-mono text-sm uppercase tracking-[0.18em]">
                {[
                  ["Ledger", true],
                  ["Customers", false],
                  ["Drafts", false],
                  ["Inbox", false],
                  ["Call log", false],
                  ["Settings", false],
                ].map(([label, active]) => (
                  <a
                    key={String(label)}
                    href="#"
                    className={`flex items-center justify-between rounded-[1px] px-3 py-2 ${
                      active
                        ? "bg-bone/5 text-bone"
                        : "text-bone-3 hover:text-bone"
                    }`}
                  >
                    <span>{label}</span>
                    {active && <span className="text-ember">●</span>}
                  </a>
                ))}
              </nav>
              <div className="mt-2 border-t border-line px-5 py-5">
                <div className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                  Compliance
                </div>
                <div className="mt-3 space-y-1.5 text-[13.5px] text-bone-2">
                  <div className="flex items-center justify-between">
                    <span>Calling hours</span>
                    <span className="text-ember">Open</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tone</span>
                    <span className="text-bone">Friendly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS · 10DLC</span>
                    <span className="text-bone">OK</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="min-w-0">
              {/* KPI */}
              <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-line">
                {[
                  { k: "Open invoices", v: "—" },
                  { k: "Paid · 30d", v: "—" },
                  { k: "Median time-to-pay", v: "—" },
                  { k: "Pay rate", v: "—" },
                ].map((k, i) => (
                  <div
                    key={k.k}
                    className={`px-5 py-5 ${
                      i < 3 ? "border-r border-line" : ""
                    }`}
                  >
                    <div className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                      {k.k}
                    </div>
                    <div className="num mt-2 font-display text-3xl text-bone-2">
                      {k.v}
                    </div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-bone-3">
                      Awaits first cohort
                    </div>
                  </div>
                ))}
              </div>

              {/* Cases — mobile cards */}
              <ul className="md:hidden divide-y divide-line">
                {cases.map((r) => (
                  <li key={r.id} className="px-5 py-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-3">
                        {r.id} · {r.sector}
                      </span>
                      <span
                        className={`inline-flex border px-2 py-0.5 font-mono text-sm uppercase tracking-[0.18em] ${statusColor[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <div className="mt-1.5 text-bone">{r.who}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="num text-sm text-bone-2">
                        <span className="text-bone">{r.amount}</span>
                        <span className="text-bone-3"> · </span>
                        {r.age}
                      </span>
                      <div className="flex gap-1 font-mono text-[11.5px]">
                        {(["E", "S", "V"] as const).map((m) => {
                          const on = r.mix.includes(m);
                          return (
                            <span
                              key={m}
                              className={`flex h-5 w-5 items-center justify-center border ${
                                on
                                  ? "border-bone text-bone"
                                  : "border-bone-3/30 text-bone-3/40"
                              }`}
                            >
                              {m}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cases — tablet+ table */}
              <div className="hidden md:block overflow-x-auto thin-scroll">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                      <th className="px-5 py-3 font-medium">Invoice</th>
                      <th className="px-3 py-3 font-medium">Customer</th>
                      <th className="px-3 py-3 font-medium">Sector</th>
                      <th className="px-3 py-3 font-medium text-right">Amount</th>
                      <th className="px-3 py-3 font-medium text-right">Age</th>
                      <th className="px-3 py-3 font-medium">Channels</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((r) => (
                      <tr key={r.id} className="row border-b border-line-soft">
                        <td className="px-5 py-3.5 font-mono text-[13.5px] text-bone-2">
                          {r.id}
                        </td>
                        <td className="px-3 py-3.5 text-bone">{r.who}</td>
                        <td className="px-3 py-3.5 text-bone-3">{r.sector}</td>
                        <td className="num px-3 py-3.5 text-right text-bone">
                          {r.amount}
                        </td>
                        <td className="num px-3 py-3.5 text-right text-bone-2">
                          {r.age}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex gap-1 font-mono text-[11.5px]">
                            {(["E", "S", "V"] as const).map((m) => {
                              const on = r.mix.includes(m);
                              return (
                                <span
                                  key={m}
                                  className={`flex h-5 w-5 items-center justify-center border ${
                                    on
                                      ? "border-bone text-bone"
                                      : "border-bone-3/30 text-bone-3/40"
                                  }`}
                                >
                                  {m}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex border px-2 py-0.5 font-mono text-[11.5px] uppercase tracking-[0.18em] ${
                              statusColor[r.status]
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Channel composition */}
              <div className="border-t border-line p-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                    Channel composition · per case
                  </div>
                  <div className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                    window
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {channelStats.map((c) => (
                    <div
                      key={c.name}
                      className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
                    >
                      <div>
                        <div className="font-display text-lg text-bone">
                          {c.name}
                        </div>
                        <div className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                          {c.v}
                        </div>
                      </div>
                      <div className="relative h-2 bg-ink-3">
                        <div
                          className="absolute inset-y-0 bg-bone/40"
                          style={{ left: `${c.start}%`, width: `${c.span}%` }}
                        />
                      </div>
                      <div className="num text-right text-sm text-bone-3 font-mono uppercase tracking-[0.18em]">
                        {c.window}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample transmissions */}
            <aside className="border-t border-line lg:border-t-0 lg:border-l">
              <div className="border-b border-line px-5 py-3 flex items-center justify-between">
                <span className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                  Transmissions
                </span>
                <span className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-bone-3/60" />
                  Sample
                </span>
              </div>
              <ul>
                {events.map((e, i) => (
                  <li
                    key={i}
                    className="row border-b border-line-soft px-5 py-3"
                  >
                    <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.18em]">
                      <span className="text-bone-3">{e.t}</span>
                      <span
                        className={
                          e.c === "EMAIL"
                            ? "text-bone"
                            : e.c === "SMS"
                              ? "text-bone-2"
                              : "text-ember"
                        }
                      >
                        {e.c}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-bone-2 leading-snug">
                      {e.m}
                    </p>
                    <p className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
                      {e.id}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Compliance                                                */
/* ────────────────────────────────────────────────────────── */

function Compliance() {
  const items = [
    {
      k: "TCPA",
      tag: "Built in",
      l: "Calls and texts respect your customer's local hours. Opt-outs honored instantly. Consent records kept per invoice.",
    },
    {
      k: "Tone & frequency",
      tag: "Built in",
      l: "Sensible frequency caps, clear identity in every message, and a small-business tone — designed to keep customers, not to corner them.",
    },
    {
      k: "10DLC / A2P",
      tag: "Registered",
      l: "Sender registered for application-to-person traffic. Carrier filtering minimised through brand & campaign vetting.",
    },
    {
      k: "SOC 2",
      tag: "In progress",
      l: "Type I in process. Controls aligned to AICPA TSC. Audit log on every invoice, retained for seven years.",
    },
  ];
  return (
    <section id="compliance" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              V. Built thoughtfully
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.85rem,4.5vw,3.6rem)] leading-[1.06] tracking-tight text-bone break-words">
              Friendly with your customers.
              <br />
              <em>Honest with the rules.</em>
            </h2>
            <p className="mt-6 max-w-[40ch] text-bone-2 text-sm sm:text-base">
              Customer respect isn&rsquo;t a feature bolted on. It&rsquo;s how
              every reminder is written, scheduled, and sent.
            </p>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <div className="grid gap-px border border-line bg-line md:grid-cols-2">
              {items.map((it) => (
                <div key={it.k} className="bg-ink p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-2xl sm:text-3xl text-bone break-words">
                      {it.k}
                    </span>
                    <span className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.22em] text-ember">
                      {it.tag}
                    </span>
                  </div>
                  <p className="mt-4 text-bone-2 text-sm sm:text-base">{it.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Distribution — private alpha via FB owner groups          */
/* ────────────────────────────────────────────────────────── */

function Distribution() {
  return (
    <section className="relative border-t border-line bg-ink-1/40">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              VI. Getting started
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
              Public alpha.
              <br />
              <em>Fifty seats, open.</em>
            </h2>
            <p className="mt-6 max-w-[44ch] text-bone-2 text-sm sm:text-base">
              No invitations, no waiting list. Fifty seats, first come, first
              served. Sign up and an in-app tutorial walks you from empty
              ledger to your first friendly reminder — no sales calls, no
              gatekeeping.
            </p>
            <p className="mt-4 max-w-[44ch] text-bone-2 text-sm sm:text-base">
              Flat 5% on what gets paid. Cancel any time. Your ledger is yours.
              We only earn when you do.
            </p>
          </div>

          <div className="lg:col-span-7 lg:pl-10">
            <div className="border border-line">
              <div className="grid grid-cols-3 border-b border-line">
                {[
                  { k: "Alpha seats", v: "50", d: "Open now" },
                  { k: "Onboarding", v: "Self-serve", d: "In-app tutorial" },
                  { k: "Pricing", v: "5%", d: "Of paid, flat" },
                ].map((s, i) => (
                  <div
                    key={s.k}
                    className={`p-4 sm:p-6 ${i < 2 ? "border-r border-line" : ""}`}
                  >
                    <div className="font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {s.k}
                    </div>
                    <div className="num mt-2 font-display text-2xl sm:text-4xl text-bone break-words">
                      {s.v}
                    </div>
                    <div className="mt-1 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-ember">
                      {s.d}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="divide-y divide-line">
                {[
                  ["D0", "Claim a seat · sandbox provisioned automatically"],
                  ["D0", "In-app tutorial · email, SMS, voice wired in minutes"],
                  ["D1", "Approve your first drafts · reminders go live"],
                  ["D7+", "Voice agent joins in as invoices age"],
                ].map(([k, v], i) => (
                  <li
                    key={`${k}-${i}`}
                    className="grid grid-cols-[52px_1fr] sm:grid-cols-[60px_1fr] items-baseline px-4 sm:px-6 py-4 gap-2"
                  >
                    <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {k}
                    </span>
                    <span className="text-bone-2 text-sm sm:text-base">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Alpha access form */}
        <div
          id="alpha"
          className="mt-20 sm:mt-24 grid gap-12 border-t border-line pt-12 sm:pt-16 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              Claim a seat
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.06] tracking-tight text-bone break-words">
              Run your ledger
              <br />
              <em className="text-bone-2">on Dragun.</em>
            </h3>
            <p className="mt-5 max-w-[40ch] text-bone-2 text-sm sm:text-base">
              Fifty seats are open. The in-app tutorial gets you from sign-up
              to your first friendly reminder in under ten minutes — no sales
              calls, no waiting list.
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-2">
              <li className="flex gap-3">
                <span className="text-ember shrink-0">▲</span> Flat 5% on what
                gets paid. Nothing else.
              </li>
              <li className="flex gap-3">
                <span className="text-ember shrink-0">▲</span> Bilingual EN · FR
                from day one.
              </li>
              <li className="flex gap-3">
                <span className="text-ember shrink-0">▲</span> Cancel any time.
                Your ledger is yours.
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <AlphaForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Investor                                                  */
/* ────────────────────────────────────────────────────────── */

function Investor() {
  return (
    <section
      id="investor"
      className="relative overflow-hidden border-t border-line"
    >
      <div className="ember-floor" aria-hidden style={{ bottom: "-65%" }} />
      <div className="relative mx-auto max-w-[1320px] px-6 py-24 md:py-44">
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
          VII. Now raising
        </p>
        <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2.25rem,7vw,7rem)] leading-[0.98] tracking-tight text-bone break-words">
          The back-office for
          <br />
          <em className="text-bone-2">getting paid.</em>
        </h2>

        <div className="mt-12 sm:mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg text-bone-2 leading-[1.55] max-w-[58ch]">
              We&rsquo;re closing a pre-seed round to extend the voice agent
              and the compliance lattice. The data room — including unit
              economics, the alpha cohort plan, and our compliance posture
              — is available on request to qualified investors.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="mailto:investors@dragun.app?subject=Dragun%20%E2%80%94%20investor%20memo"
                className="group inline-flex max-w-full items-center gap-3 bg-ember px-5 sm:px-7 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone break-all"
              >
                investors@dragun.app
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="mailto:founders@dragun.app?subject=Dragun%20%E2%80%94%20founders"
                className="group inline-flex items-center gap-3 border-b border-bone/40 pb-1 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone-2 transition-colors hover:text-bone hover:border-bone"
              >
                Talk to a founder
              </a>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-line bg-ink-1/70 p-5 sm:p-7">
              <div className="flex items-center justify-between font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
                <span>Round · Pre-seed</span>
                <span className="text-ember">Open</span>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-5 sm:gap-6">
                {[
                  { k: "Stage", v: "Pre-seed" },
                  { k: "Vehicle", v: "SAFE" },
                  { k: "Use", v: "Voice agent · Compliance · Alpha" },
                  { k: "Geography", v: "Québec · US first" },
                ].map((d) => (
                  <div key={d.k} className="min-w-0">
                    <dt className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {d.k}
                    </dt>
                    <dd className="mt-1 font-display text-lg sm:text-xl text-bone break-words">
                      {d.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-7 border-t border-line pt-5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3 leading-relaxed">
                Memo includes unit economics, channel design,
                regulatory posture, alpha cohort plan, and team profile.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Footer                                                    */
/* ────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-[1320px] px-6 pt-16 sm:pt-20 pb-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <a href="#" className="flex items-center gap-3 text-bone">
              <Mark className="h-6 w-6" />
              <span className="font-display text-2xl tracking-tight">
                Dragun
              </span>
            </a>
            <p className="mt-5 max-w-[44ch] text-bone-2 text-sm sm:text-base">
              The friendly back-office for getting paid. Email, SMS and voice
              — one rhythm, one ledger, one bank deposit.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-2">
            <div>
              <div className="text-bone-3">Platform</div>
              <ul className="mt-3 space-y-2">
                <li><a href="#mechanism" className="hover:text-bone">How it works</a></li>
                <li><a href="#dashboard" className="hover:text-bone">Ledger</a></li>
                <li><a href="#compliance" className="hover:text-bone">Compliance</a></li>
              </ul>
            </div>
            <div className="min-w-0">
              <div className="text-bone-3">Contact</div>
              <ul className="mt-3 space-y-2 break-words">
                <li><a href="mailto:investors@dragun.app" className="hover:text-bone">Investors</a></li>
                <li><a href="mailto:founders@dragun.app" className="hover:text-bone">Founders</a></li>
                <li><a href="mailto:hello@dragun.app" className="hover:text-bone">Owners</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-16 sm:mt-20 select-none overflow-hidden">
          <div className="font-display text-[clamp(3.5rem,22vw,18rem)] leading-none tracking-[-0.03em] text-bone/90 break-words">
            DRAGUN<span className="text-ember">†</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[10.5px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-bone-3 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Dragun, Inc. · All rights reserved</span>
          <span>Built in Québec · For small businesses</span>
          <span className="flex flex-wrap gap-4 sm:gap-5">
            <a href="#" className="hover:text-bone">Privacy</a>
            <a href="#" className="hover:text-bone">Terms</a>
            <a href="#" className="hover:text-bone">Disclosures</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
