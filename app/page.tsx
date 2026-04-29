import { LiveCounter } from "./_components/live-counter";
import { AlphaForm } from "./_components/alpha-form";

export default function Home() {
  return (
    <main className="relative">
      <TopBar />
      <Nav />
      <Hero />
      <Arrivals />
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
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
        <div className="flex items-center gap-6">
          <span>Berthed · 04·29·2026</span>
          <span className="hidden md:inline">Sector · Receivables</span>
          <span className="hidden lg:inline">Operating window · 08:00–20:59 local</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:flex items-center gap-2">
            <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
            <span className="text-bone-2">Live · Private alpha</span>
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
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
            ™ · Receivables
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-2">
          <li><a href="/demo" className="text-ember hover:text-bone">Live demo</a></li>
          <li><a href="#mechanism" className="hover:text-bone">Mechanism</a></li>
          <li><a href="#dashboard" className="hover:text-bone">Ledger</a></li>
          <li><a href="#compliance" className="hover:text-bone">Compliance</a></li>
          <li><a href="#alpha" className="hover:text-bone">Alpha</a></li>
          <li><a href="#investor" className="hover:text-bone">Investors</a></li>
        </ul>
        <a
          href="#investor"
          className="group inline-flex items-center gap-2 border border-bone/70 px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone hover:border-ember hover:text-ember transition-colors"
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
            <p className="rise font-mono text-[11px] uppercase tracking-[0.32em] text-bone-3">
              <span className="text-ember">●</span>&nbsp;&nbsp;Automated debt
              recovery for SMBs · Est. 2026
            </p>
            <h1
              className="rise font-display mt-8 text-[clamp(3.4rem,9.4vw,9.5rem)] leading-[0.92] tracking-[-0.02em] text-bone"
              style={{ animationDelay: "0.08s" }}
            >
              Money owed,
              <br />
              <em className="italic text-bone-2">brought home.</em>
            </h1>
            <p
              className="rise mt-10 max-w-[44ch] text-lg leading-[1.55] text-bone-2 md:text-xl"
              style={{ animationDelay: "0.18s" }}
            >
              Dragun is the relentless back-office that recovers accounts
              receivable for small and medium businesses — across email, SMS
              and voice — without sounding like a debt collector. We pursue
              the invoice. You stay in business.
            </p>

            <div
              className="rise mt-12 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.28s" }}
            >
              <a
                href="/demo"
                className="group inline-flex items-center gap-3 bg-ember px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone"
              >
                Run the live demo
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#investor"
                className="group inline-flex items-center gap-3 border border-bone/50 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
              >
                Investor memo
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#dashboard"
                className="group inline-flex items-center gap-3 border-b border-bone/40 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-2 transition-colors hover:text-bone hover:border-bone"
              >
                See the platform
                <span className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>
          </div>

          {/* Live ledger card */}
          <aside
            className="rise lg:col-span-4 lg:mt-2 self-start"
            style={{ animationDelay: "0.42s" }}
          >
            <div className="border border-line bg-ink-1/70 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
                <span>Live ledger · Net 30d</span>
                <span className="flex items-center gap-2 text-ember">
                  <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
                  Recovering
                </span>
              </div>
              <div className="px-5 py-7">
                <div className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none tracking-tight text-bone">
                  <LiveCounter />
                </div>
                <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
                  Recovered to operator accounts
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-line">
                {[
                  { k: "Cases", v: "1,284" },
                  { k: "Median TTP", v: "9.4d" },
                  { k: "Recovery", v: "73.2%" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="border-r border-line px-4 py-4 last:border-r-0"
                  >
                    <div className="num font-display text-2xl text-bone">{s.v}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3">
                      {s.k}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-line px-5 py-4">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
                  Channel mix
                </div>
                <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-[1px] bg-ink-3">
                  <span className="h-full bg-bone" style={{ width: "44%" }} />
                  <span
                    className="h-full bg-ember"
                    style={{ width: "31%" }}
                  />
                  <span className="h-full bg-moss" style={{ width: "25%" }} />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3">
                  <span>Email · 44</span>
                  <span>SMS · 31</span>
                  <span>Voice · 25</span>
                </div>
              </div>
            </div>

            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
              Powered by · Resend · Twilio · Dragun voice agent
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Arrivals marquee                                          */
/* ────────────────────────────────────────────────────────── */

function Arrivals() {
  const items = [
    ["DR-1041", "Northridge Plumbing & Heat", "$4,128.00"],
    ["DR-1039", "Halstead Auto Body", "$1,290.00"],
    ["DR-1037", "Oakwell Café Group", "$782.50"],
    ["DR-1034", "Maritime Supply Co.", "$9,402.00"],
    ["DR-1031", "Waves & Wicks LLC", "$355.00"],
    ["DR-1029", "Foothill Dental Partners", "$2,140.75"],
    ["DR-1027", "Bramble Lawn & Garden", "$612.40"],
    ["DR-1024", "Bering Strait Logistics", "$11,008.20"],
    ["DR-1021", "Quietwater Marina", "$3,275.00"],
    ["DR-1018", "Larkfield Bakery Co.", "$478.65"],
    ["DR-1016", "Granite Roof & Siding", "$5,820.00"],
    ["DR-1014", "Penobscot Pet Supply", "$294.30"],
  ];
  const stream = [...items, ...items];
  return (
    <section
      aria-label="Recent recoveries"
      className="relative border-y border-line bg-ink-1/40 py-3"
    >
      <div className="ticker-track font-mono text-[11px] uppercase tracking-[0.2em] text-bone-2">
        {stream.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            <span className="text-ember">▲ ARRIVED</span>
            <span className="text-bone-3">{it[0]}</span>
            <span className="text-bone">{it[1]}</span>
            <span className="num text-bone">{it[2]}</span>
            <span className="text-bone-3">·</span>
          </span>
        ))}
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
      <div className="mx-auto max-w-[1320px] px-6 py-32 md:py-44">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
              I. The arithmetic of being owed
            </p>
            <p className="mt-6 font-display text-3xl leading-tight text-bone-2">
              It is not a billing problem.
              <br />
              <em>It is a follow-up problem.</em>
            </p>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <p className="font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.05] tracking-tight text-bone">
              <span className="text-ember">42%</span> of SMB invoices age past
              thirty days. By day ninety, recovery collapses to{" "}
              <span className="text-ember">12¢</span> on the dollar.
            </p>
            <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
              {[
                {
                  k: "$825B",
                  l: "Outstanding US AR held by SMBs",
                },
                {
                  k: "31 hrs / mo",
                  l: "A typical owner spends chasing it",
                },
                {
                  k: "1 in 6",
                  l: "Invoices written off by year three",
                },
              ].map((d) => (
                <div key={d.k}>
                  <div className="num font-display text-4xl text-bone">
                    {d.k}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
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
      cadence: "3 touches",
      voice: "Soft, transactional, tonally aligned to your brand.",
      stat: { k: "Open", v: "64.8%" },
      sub: { k: "Pay rate", v: "28.4%" },
      detail: [
        "DKIM, SPF & DMARC alignment",
        "Threaded replies routed to your team",
        "Variable subject + warm-up rotation",
      ],
    },
    {
      roman: "Ⅱ.",
      name: "SMS",
      vendor: "Twilio",
      window: "Day 5 → 14",
      cadence: "2 touches",
      voice: "Direct, brief, branded. Pay link in one tap.",
      stat: { k: "Delivery", v: "99.1%" },
      sub: { k: "Pay rate", v: "19.7%" },
      detail: [
        "10DLC registered, A2P 10DLC pre-cleared",
        "Smart quiet hours by debtor timezone",
        "Inbound STOP / HELP handled",
      ],
    },
    {
      roman: "Ⅲ.",
      name: "Voice",
      vendor: "Dragun agent",
      window: "Day 10 →",
      cadence: "Up to 3 connects",
      voice: "Conversational AI. Listens. Negotiates. Documents.",
      stat: { k: "Connect", v: "41.2%" },
      sub: { k: "Pay rate", v: "33.6%" },
      detail: [
        "Real-time call recording & transcripts",
        "TCPA-windowed dialing, opt-out aware",
        "Hand-off to human on signal phrases",
      ],
    },
  ];
  return (
    <section
      id="channels"
      className="relative border-t border-line bg-ink-1/30"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:py-36">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
              II. Channels of pursuit
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-bone">
              Three channels, one campaign, one ledger.
            </h2>
          </div>
          <p className="max-w-md font-sans text-bone-2">
            Every debtor receives the same arc — softly, then firmly. The
            sequence is automated, compliance-windowed, and tuned per
            industry.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-line border border-line md:grid-cols-3">
          {channels.map((c) => (
            <article
              key={c.name}
              className="group relative bg-ink p-8 transition-colors hover:bg-ink-1"
            >
              <div className="flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                <span>{c.roman} {c.name}</span>
                <span>{c.vendor}</span>
              </div>
              <h3 className="mt-6 font-display text-5xl tracking-tight text-bone">
                {c.name}
              </h3>
              <p className="mt-4 max-w-[34ch] text-bone-2">{c.voice}</p>

              <dl className="mt-8 grid grid-cols-2 border-t border-line pt-5">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                    {c.stat.k}
                  </dt>
                  <dd className="num mt-1 font-display text-3xl text-ember">
                    {c.stat.v}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                    {c.sub.k}
                  </dt>
                  <dd className="num mt-1 font-display text-3xl text-bone">
                    {c.sub.v}
                  </dd>
                </div>
              </dl>

              <ul className="mt-8 space-y-2 text-sm text-bone-2">
                {c.detail.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 h-px w-3 shrink-0 bg-bone-3" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
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
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:py-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
          III. The thirty-day arc
        </p>
        <h2 className="mt-4 max-w-[24ch] font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-bone">
          One campaign. Drafted soft, finished firm.
        </h2>
        <p className="mt-6 max-w-[60ch] text-bone-2">
          Campaigns escalate automatically across email, SMS, and voice.
          Operators see every touch in a single ledger; debtors hear from one
          consistent voice.
        </p>

        <div className="mt-16 border border-line bg-ink-1/40">
          {/* Day axis */}
          <div className="grid grid-cols-[120px_1fr] border-b border-line">
            <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
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
                      <span className="absolute left-1 top-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3">
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
              className="grid grid-cols-[120px_1fr] border-b border-line last:border-b-0"
            >
              <div className="flex flex-col justify-center border-r border-line px-4 py-5">
                <span className="font-display text-xl text-bone">
                  {lane.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
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
                        className="absolute left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3"
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
          <div className="grid grid-cols-[120px_1fr] border-t border-line bg-ink">
            <div className="border-r border-line px-4 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
              Outcome
            </div>
            <div className="relative px-4 py-4">
              <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-2">
                <span>Pay link delivered</span>
                <span>
                  Average resolution{" "}
                  <span className="num text-ember">D9.4</span>
                </span>
                <span>Escalation if &gt; D27</span>
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
      status: "RECOVERED",
    },
    {
      id: "DR-1042",
      who: "Halstead Auto Body",
      sector: "Auto",
      amount: "$1,290.00",
      age: "14d",
      mix: ["E", "S"],
      status: "IN PURSUIT",
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
      status: "ESCALATED",
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
      status: "IN PURSUIT",
    },
    {
      id: "DR-1047",
      who: "Foothill Dental Partners",
      sector: "Health",
      amount: "$2,140.75",
      age: "31d",
      mix: ["E", "S"],
      status: "PROMISE",
    },
  ];

  const events = [
    { t: "02:14", c: "VOICE", m: "Connected · 1m12s · payment promise 02:00 today", id: "DR-1041" },
    { t: "02:11", c: "EMAIL", m: "Reply received · ‘send pay link again’", id: "DR-1042" },
    { t: "02:09", c: "SMS", m: "Delivered · pay link tapped", id: "DR-1044" },
    { t: "02:04", c: "EMAIL", m: "Sent · soft tone v3", id: "DR-1045" },
    { t: "01:58", c: "VOICE", m: "Voicemail dropped · branded", id: "DR-1046" },
    { t: "01:52", c: "SMS", m: "Delivered · quiet-hours respected", id: "DR-1047" },
  ];

  const channelStats = [
    { name: "Email", v: "Resend", a: 64.8, b: 28.4 },
    { name: "SMS", v: "Twilio", a: 99.1, b: 19.7 },
    { name: "Voice", v: "Agent", a: 41.2, b: 33.6 },
  ];

  const statusColor: Record<string, string> = {
    RECOVERED: "bg-moss text-bone border-moss",
    "IN PURSUIT": "bg-ember/15 text-ember border-ember/40",
    DRAFTED: "bg-transparent text-bone-3 border-bone-3/40",
    ESCALATED: "bg-ember text-ink border-ember",
    PROMISE: "bg-bone text-ink border-bone",
  };

  return (
    <section id="dashboard" className="relative border-y border-line bg-ink-1/40">
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:py-36">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
              IV. The operator surface
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-bone">
              One ledger for every receivable.
            </h2>
          </div>
          <p className="max-w-md text-bone-2">
            Built for operators, not collectors. Every case is auditable,
            every touch is timestamped, every dollar lands in your bank.
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
            <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
              app.dragun.io / ledger
            </div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
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
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                  Your business
                </div>
              </div>
              <nav className="px-2 py-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                {[
                  ["Ledger", true],
                  ["Cases", false],
                  ["Drafts", false],
                  ["Inbox", false],
                  ["Voice log", false],
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
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                  Compliance
                </div>
                <div className="mt-3 space-y-1.5 text-[12px] text-bone-2">
                  <div className="flex items-center justify-between">
                    <span>TCPA window</span>
                    <span className="text-ember">Open</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>FDCPA mode</span>
                    <span className="text-bone">SMB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>10DLC</span>
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
                  { k: "Active recoveries", v: "1,284", d: "+82 wk" },
                  { k: "Recovered · 30d", v: "$4.21M", d: "+19%" },
                  { k: "Median TTP", v: "9.4d", d: "−1.6d" },
                  { k: "Recovery rate", v: "73.2%", d: "+4.4pp" },
                ].map((k, i) => (
                  <div
                    key={k.k}
                    className={`px-5 py-5 ${
                      i < 3 ? "border-r border-line" : ""
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                      {k.k}
                    </div>
                    <div className="num mt-2 font-display text-3xl text-bone">
                      {k.v}
                    </div>
                    <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ember">
                      {k.d}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cases */}
              <div className="overflow-x-auto thin-scroll">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                      <th className="px-5 py-3 font-medium">Case</th>
                      <th className="px-3 py-3 font-medium">Debtor</th>
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
                        <td className="px-5 py-3.5 font-mono text-[12px] text-bone-2">
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
                          <div className="flex gap-1 font-mono text-[10px]">
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
                            className={`inline-flex border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${
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

              {/* Channel performance */}
              <div className="border-t border-line p-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                    Channel performance · last 30d
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                    delivery / pay-rate
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
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                          {c.v}
                        </div>
                      </div>
                      <div className="relative h-2 bg-ink-3">
                        <div
                          className="absolute inset-y-0 left-0 bg-bone/70"
                          style={{ width: `${c.a}%` }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 bg-ember"
                          style={{ width: `${c.b}%` }}
                        />
                      </div>
                      <div className="num text-right text-sm text-bone-2">
                        {c.a}%{" / "}
                        <span className="text-ember">{c.b}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live transmissions */}
            <aside className="border-t border-line lg:border-t-0 lg:border-l">
              <div className="border-b border-line px-5 py-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                  Live transmissions
                </span>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
                  <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
                  Streaming
                </span>
              </div>
              <ul>
                {events.map((e, i) => (
                  <li
                    key={i}
                    className="row border-b border-line-soft px-5 py-3"
                  >
                    <div className="flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.18em]">
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
                    <p className="mt-1 text-[13px] text-bone-2 leading-snug">
                      {e.m}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
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
      l: "Calls and texts windowed to debtor local time, opt-out aware, prior express consent surfaced per case.",
    },
    {
      k: "FDCPA",
      l: "Frequency caps, identity disclosure, mini-Miranda templates by state — and an SMB-mode that stays on the right side of the line.",
    },
    {
      k: "10DLC / A2P",
      l: "Sender registered for application-to-person traffic. Carrier filtering minimised through brand & campaign vetting.",
    },
    {
      k: "SOC 2",
      l: "Type I in process. Controls aligned to AICPA TSC. Audit log on every case, retained for seven years.",
    },
  ];
  return (
    <section id="compliance" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:py-36">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
              V. Compliance, by design
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] tracking-tight text-bone">
              We pursue debts.
              <br />
              <em>Not problems.</em>
            </h2>
            <p className="mt-6 max-w-[40ch] text-bone-2">
              Compliance is not a feature bolted on. It is the lattice every
              campaign is built into.
            </p>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <div className="grid gap-px border border-line bg-line md:grid-cols-2">
              {items.map((it) => (
                <div key={it.k} className="bg-ink p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl text-bone">
                      {it.k}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember">
                      Active
                    </span>
                  </div>
                  <p className="mt-4 text-bone-2">{it.l}</p>
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
      <div className="mx-auto max-w-[1320px] px-6 py-28 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
              VI. Distribution
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-bone">
              Private alpha.
              <br />
              <em>Sourced from operators.</em>
            </h2>
            <p className="mt-6 max-w-[44ch] text-bone-2">
              Dragun&rsquo;s first fifty customers are being onboarded one at
              a time, directly from tech-savvy SMB owner groups on Facebook —
              communities where operators already trade tooling
              recommendations and care, more than most, about cash flow.
            </p>
            <p className="mt-4 max-w-[44ch] text-bone-2">
              We win them with a working product, an honest demo, and a
              flat-fee on what we recover. No pitch deck warriors. No paid
              acquisition. Word travels.
            </p>
          </div>

          <div className="lg:col-span-7 lg:pl-10">
            <div className="border border-line">
              <div className="grid grid-cols-3 border-b border-line">
                {[
                  { k: "Alpha seats", v: "50", d: "By Q3 2026" },
                  { k: "From comms", v: "12+", d: "FB owner groups" },
                  { k: "Pricing", v: "5%", d: "Of recovered, flat" },
                ].map((s, i) => (
                  <div
                    key={s.k}
                    className={`p-6 ${i < 2 ? "border-r border-line" : ""}`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                      {s.k}
                    </div>
                    <div className="num mt-2 font-display text-4xl text-bone">
                      {s.v}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
                      {s.d}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="divide-y divide-line">
                {[
                  ["W1", "Operator-direct intros from gym-owner & SMB FB groups"],
                  ["W2", "Public roadmap. Weekly demo for new alpha seats"],
                  ["W3", "First voice-agent campaigns shipped to alpha cohort"],
                  ["W4", "Case studies → expansion through operator referrals"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="grid grid-cols-[60px_1fr] items-baseline px-6 py-4"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                      {k}
                    </span>
                    <span className="text-bone-2">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Alpha access form */}
        <div
          id="alpha"
          className="mt-24 grid gap-12 border-t border-line pt-16 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
              Apply
            </p>
            <h3 className="mt-3 font-display text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] tracking-tight text-bone">
              Run your ledger
              <br />
              <em className="text-bone-2">on Dragun.</em>
            </h3>
            <p className="mt-5 max-w-[40ch] text-bone-2">
              Forty-nine seats remain. We onboard one operator at a time.
              Tell us what gets aged out in your shop and we&rsquo;ll come
              back with a working campaign within a business day.
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-2">
              <li className="flex gap-3">
                <span className="text-ember">▲</span> Flat 5% on what we
                recover. Nothing else.
              </li>
              <li className="flex gap-3">
                <span className="text-ember">▲</span> Bilingual EN · FR from
                day one.
              </li>
              <li className="flex gap-3">
                <span className="text-ember">▲</span> Cancel any time. Your
                ledger is yours.
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
      <div className="relative mx-auto max-w-[1320px] px-6 py-28 md:py-44">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-3">
          VII. Now raising
        </p>
        <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(3rem,7vw,7rem)] leading-[0.96] tracking-tight text-bone">
          The back-office for
          <br />
          <em className="text-bone-2">money owed.</em>
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-lg text-bone-2 leading-[1.55] max-w-[58ch]">
              We are closing a pre-seed round to extend the voice agent and
              widen the compliance lattice. The data room — including pilot
              economics, the alpha cohort plan, and our compliance posture
              — is available on request to qualified investors.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="mailto:investors@dragun.app?subject=Dragun%20%E2%80%94%20investor%20memo"
                className="group inline-flex items-center gap-3 bg-ember px-7 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone"
              >
                investors@dragun.app
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="mailto:founders@dragun.app?subject=Dragun%20%E2%80%94%20founders"
                className="group inline-flex items-center gap-3 border-b border-bone/40 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-2 transition-colors hover:text-bone hover:border-bone"
              >
                Talk to a founder
              </a>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-line bg-ink-1/70 p-7">
              <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                <span>Round · Pre-seed</span>
                <span className="text-ember">Open</span>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-6">
                {[
                  { k: "Stage", v: "Pre-seed" },
                  { k: "Vehicle", v: "SAFE" },
                  { k: "Use", v: "Voice agent · Compliance · Alpha" },
                  { k: "Geography", v: "Québec · US first" },
                ].map((d) => (
                  <div key={d.k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                      {d.k}
                    </dt>
                    <dd className="mt-1 font-display text-xl text-bone">
                      {d.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-7 border-t border-line pt-5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3 leading-relaxed">
                Memo includes pilot economics, channel-mix performance,
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
      <div className="mx-auto max-w-[1320px] px-6 pt-20 pb-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <a href="#" className="flex items-center gap-3 text-bone">
              <Mark className="h-6 w-6" />
              <span className="font-display text-2xl tracking-tight">
                Dragun
              </span>
            </a>
            <p className="mt-5 max-w-[44ch] text-bone-2">
              The relentless back-office for money owed. Email, SMS and voice
              — one campaign, one ledger, one bank deposit.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-2">
            <div>
              <div className="text-bone-3">Platform</div>
              <ul className="mt-3 space-y-2">
                <li><a href="#mechanism" className="hover:text-bone">Mechanism</a></li>
                <li><a href="#dashboard" className="hover:text-bone">Ledger</a></li>
                <li><a href="#compliance" className="hover:text-bone">Compliance</a></li>
              </ul>
            </div>
            <div>
              <div className="text-bone-3">Contact</div>
              <ul className="mt-3 space-y-2">
                <li><a href="mailto:investors@dragun.app" className="hover:text-bone">Investors</a></li>
                <li><a href="mailto:founders@dragun.app" className="hover:text-bone">Founders</a></li>
                <li><a href="mailto:hello@dragun.app" className="hover:text-bone">Operators</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-20 select-none">
          <div className="font-display text-[clamp(5rem,22vw,18rem)] leading-none tracking-[-0.03em] text-bone/90">
            DRAGUN<span className="text-ember">†</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Dragun, Inc. · All rights reserved</span>
          <span>Built in dim rooms · For loud receivables</span>
          <span className="flex gap-5">
            <a href="#" className="hover:text-bone">Privacy</a>
            <a href="#" className="hover:text-bone">Terms</a>
            <a href="#" className="hover:text-bone">Disclosures</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
