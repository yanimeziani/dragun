"use client";

import { useEffect, useMemo, useState } from "react";

/* ────────────────────────────────────────────────────────── */
/*  Scenario                                                  */
/* ────────────────────────────────────────────────────────── */

type Channel = "EMAIL" | "SMS" | "VOICE" | "PAY" | "SYSTEM";
type Side = "operator" | "debtor" | "both";

type Ev = {
  c: number; // cursor in hours
  ch: Channel;
  who: Side;
  title: string;
  body: string;
  meta?: string;
};

const h = (d: number, hr: number) => d * 24 + hr;

const SCENARIO: Ev[] = [
  {
    c: h(0, 9),
    ch: "SYSTEM",
    who: "operator",
    title: "Invoice opened",
    body: "DR-1042 · Alex Carter · $89.00 · 1 day overdue",
    meta: "MEMBERSHIP · MARCH",
  },
  {
    c: h(0, 9),
    ch: "EMAIL",
    who: "both",
    title: "Email #1 · friendly reminder",
    body: "Hi Alex — quick heads-up, your March membership at Atlas Athletic ($89.00) hasn't gone through yet. Sometimes a card just expires. Update in one tap →",
  },
  {
    c: h(0, 11),
    ch: "EMAIL",
    who: "operator",
    title: "Email #1 opened",
    body: "Read on iPhone Mail · 11:14 EDT",
    meta: "OPENED",
  },
  {
    c: h(3, 9),
    ch: "EMAIL",
    who: "both",
    title: "Email #2 · friendly nudge",
    body: "Quick note in case the last one slipped past. Same link below — no late fee, no drama.",
  },
  {
    c: h(5, 14),
    ch: "SMS",
    who: "both",
    title: "SMS #1 · pay link",
    body:
      "Atlas Athletic: Hi Alex, your March dues ($89.00) are still open. Pay in one tap → drag.un/p/9R2K · Reply STOP to opt out.",
  },
  {
    c: h(5, 14),
    ch: "SMS",
    who: "operator",
    title: "Pay link tapped",
    body: "Tapped 14:22 · didn't finish checkout",
    meta: "TAPPED · NOT YET PAID",
  },
  {
    c: h(7, 9),
    ch: "EMAIL",
    who: "both",
    title: "Email #3 · gentle reminder",
    body:
      "Alex — keeping it short. March dues ($89.00) just need clearing this week so your access stays on. One tap below.",
  },
  {
    c: h(10, 14),
    ch: "SMS",
    who: "both",
    title: "SMS #2 · quiet-hours aware",
    body:
      "Atlas Athletic: still showing $89.00 open. Happy to sort it gently — drag.un/p/9R2K.",
  },
  {
    c: h(12, 13),
    ch: "VOICE",
    who: "both",
    title: "Voice call placed",
    body: "Dragun agent · calling hours 09:00–20:59 local · 13:04",
  },
  {
    c: h(12, 13),
    ch: "VOICE",
    who: "both",
    title: "Voice call · 1m12s",
    body:
      "“Hi Alex, this is Sam from Atlas Athletic. Just a quick one — looks like March is still open. Want me to text the link now?” — “Yeah, send it, I'll do it tonight.”",
    meta: "WILL PAY BY 18:00",
  },
  {
    c: h(12, 13),
    ch: "SMS",
    who: "both",
    title: "Pay link sent · per call",
    body:
      "Atlas Athletic: per our call — drag.un/p/9R2K · $89.00 · expires 24h.",
  },
  {
    c: h(12, 18),
    ch: "PAY",
    who: "both",
    title: "Pay link tapped · Apple Pay",
    body: "Charged $89.00 · authorized 18:02 EDT",
    meta: "PROCESSING",
  },
  {
    c: h(12, 18),
    ch: "PAY",
    who: "both",
    title: "Payment received · $89.00",
    body:
      "Settled to Atlas Athletic's Stripe account in 4 seconds via Dragun.",
    meta: "COMPLETE",
  },
  {
    c: h(13, 9),
    ch: "EMAIL",
    who: "both",
    title: "Receipt sent",
    body:
      "Thanks Alex — we got the $89.00. Your access is back on. See you at the squat rack.",
  },
  {
    c: h(14, 9),
    ch: "SYSTEM",
    who: "operator",
    title: "Invoice closed · PAID",
    body: "Time-to-pay 12d · Channels E·S·V · Net to ledger $84.55",
    meta: "5% FLAT FEE",
  },
];

const MAX = h(14, 10);

/* ────────────────────────────────────────────────────────── */
/*  Helpers                                                   */
/* ────────────────────────────────────────────────────────── */

function fmtClock(cursor: number) {
  const day = Math.floor(cursor / 24);
  const hr = cursor % 24;
  const hh = String(hr).padStart(2, "0");
  return { day, label: `D${day} · ${hh}:00`, hh };
}

function statusFor(visible: Ev[]) {
  if (visible.some((e) => e.title.startsWith("Invoice closed"))) return "PAID · CLOSED";
  if (visible.some((e) => e.ch === "PAY" && e.title.startsWith("Payment"))) return "PAID";
  if (visible.some((e) => e.ch === "VOICE" && e.title.includes("call · 1m"))) return "PROMISED";
  if (visible.some((e) => e.ch === "SMS")) return "FOLLOWING UP";
  if (visible.some((e) => e.ch === "EMAIL")) return "DRAFTED";
  return "PENDING";
}

const STATUS_CX: Record<string, string> = {
  PENDING: "border-bone-3/40 text-bone-3",
  DRAFTED: "border-bone-3/40 text-bone-3",
  "FOLLOWING UP": "border-ember/60 text-ember",
  PROMISED: "border-bone text-bone",
  PAID: "bg-ember text-ink border-ember",
  "PAID · CLOSED": "bg-moss text-bone border-moss",
};

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
/*  Top bar + scrubber                                        */
/* ────────────────────────────────────────────────────────── */

function ControlBar({
  cursor,
  setCursor,
  playing,
  setPlaying,
  speed,
  setSpeed,
}: {
  cursor: number;
  setCursor: (n: number) => void;
  playing: boolean;
  setPlaying: (b: boolean) => void;
  speed: number;
  setSpeed: (n: number) => void;
}) {
  const { label, day } = fmtClock(cursor);

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      {/* row 1 */}
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-x-4 gap-y-1 px-4 sm:px-6 py-3 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-bone-3">
        <a href="/" className="flex items-center gap-2 text-bone">
          <Mark className="h-4 w-4" />
          <span className="font-display text-base tracking-tight">Dragun</span>
          <span className="text-bone-3">/</span>
          <span>Live demo</span>
        </a>
        <span className="hidden md:inline">Scenario · Atlas Athletic · DR-1042</span>
        <span className="ml-auto flex items-center gap-2 text-bone-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-ember pulse" : "bg-bone-3"}`}
          />
          {playing ? "Playing" : cursor >= MAX ? "Complete" : "Paused"}
        </span>
        <a
          href="/"
          className="hidden md:inline border-b border-line pb-px text-bone-2 hover:text-bone hover:border-bone"
        >
          ← Back to site
        </a>
      </div>

      {/* row 2 — controls */}
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-3 sm:gap-5 px-4 sm:px-6 pb-3 sm:pb-4">
        {/* play / pause / reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (cursor >= MAX) setCursor(0);
              setPlaying(!playing);
            }}
            className="inline-flex h-10 w-10 items-center justify-center border border-bone bg-bone text-ink transition-colors hover:bg-ember hover:border-ember"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
                <rect x="0" y="0" width="3.5" height="13" />
                <rect x="7.5" y="0" width="3.5" height="13" />
              </svg>
            ) : (
              <svg width="12" height="13" viewBox="0 0 12 13" fill="currentColor">
                <path d="M0 0 L12 6.5 L0 13 Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setCursor(0);
              setPlaying(false);
            }}
            className="inline-flex h-10 items-center gap-2 border border-line bg-transparent px-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-2 hover:border-bone hover:text-bone"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={() => {
              setCursor(MAX);
              setPlaying(false);
            }}
            className="inline-flex h-10 items-center gap-2 border border-line bg-transparent px-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-2 hover:border-bone hover:text-bone"
          >
            Skip ⤳
          </button>
        </div>

        {/* scrubber */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="num font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3 whitespace-nowrap">
            {label}
          </span>
          <input
            type="range"
            min={0}
            max={MAX}
            step={1}
            value={cursor}
            onChange={(e) => {
              setCursor(Number(e.target.value));
              setPlaying(false);
            }}
            className="dragun-scrub min-w-0 flex-1 accent-ember"
            aria-label="Scenario time"
          />
          <span className="num font-mono text-[10.5px] uppercase tracking-[0.2em] text-ember whitespace-nowrap">
            D{Math.floor(MAX / 24)}
          </span>
        </div>

        {/* speed */}
        <div className="flex items-center gap-1 border border-line p-1 font-mono text-[10px] uppercase tracking-[0.2em]">
          {[1, 4, 16].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 ${
                speed === s ? "bg-bone text-ink" : "text-bone-3 hover:text-bone"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* day rail */}
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 pb-3">
        <div className="relative h-1 w-full bg-ink-3">
          <div
            className="absolute inset-y-0 left-0 bg-ember transition-[width] duration-200"
            style={{ width: `${(cursor / MAX) * 100}%` }}
          />
          {SCENARIO.map((e, i) => (
            <span
              key={i}
              className="absolute -top-0.5 h-2 w-px bg-bone-3"
              style={{ left: `${(e.c / MAX) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-1 grid grid-cols-[repeat(15,1fr)] font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.14em] sm:tracking-[0.2em] text-bone-3">
          {Array.from({ length: 15 }).map((_, d) => (
            <span key={d} className={d === day ? "text-ember" : ""}>
              D{d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Operator pane                                             */
/* ────────────────────────────────────────────────────────── */

function OperatorPane({
  visible,
  status,
  cursor,
}: {
  visible: Ev[];
  status: string;
  cursor: number;
}) {
  const channels = {
    E: visible.some((e) => e.ch === "EMAIL"),
    S: visible.some((e) => e.ch === "SMS"),
    V: visible.some((e) => e.ch === "VOICE"),
  };
  const recovered = visible.some((e) => e.ch === "PAY" && e.title.startsWith("Payment"));
  const ttp = recovered ? "12d" : "—";
  const fee = recovered ? "$4.45" : "—";
  const net = recovered ? "$84.55" : "—";

  const operatorEvents = visible.filter((e) => e.who !== "debtor");

  const { label } = fmtClock(cursor);

  return (
    <section className="order-2 lg:order-1 bg-ink">
      {/* App chrome */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ink-2 px-3 sm:px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-ember/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone-3/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone-3/40" />
        </div>
        <div className="hidden sm:block font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone-3 truncate">
          app.dragun.io / customers / DR-1042
        </div>
        <div className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
          atlas-athletic
        </div>
      </div>

      {/* Operator pane label */}
      <div className="border-b border-line bg-ink-1 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
          ▲ Owner view · Atlas Athletic
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
          {label}
        </span>
      </div>

      {/* Case header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-7 pb-5 border-b border-line">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3 break-words">
              Customer · DR-1042 · Membership · March
            </div>
            <div className="mt-2 font-display text-2xl sm:text-3xl text-bone break-words">
              Alex Carter
            </div>
            <div className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-bone-3">
              Member since 2024 · Monthly plan
            </div>
          </div>
          <span
            className={`inline-flex border px-2.5 sm:px-3 py-1 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] ${STATUS_CX[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-line">
        {[
          { k: "Amount", v: "$89.00", d: "Membership · March" },
          { k: "Time-to-pay", v: ttp, d: recovered ? "Paid" : "Open" },
          { k: "Channels", v: <ChannelBadges on={channels} />, d: "E · S · V" },
          { k: "Net to ledger", v: net, d: recovered ? `Fee ${fee}` : "Pending" },
        ].map((k, i) => {
          const lgRightBorder = i < 3;
          const smRightBorder = i % 2 === 0;
          return (
            <div
              key={k.k}
              className={`px-4 sm:px-5 py-4 sm:py-5 ${
                smRightBorder ? "border-r border-line lg:border-r" : ""
              } ${
                !lgRightBorder ? "lg:border-r-0" : ""
              } ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3 break-words">
                {k.k}
              </div>
              <div className="num mt-2 font-display text-2xl sm:text-3xl text-bone break-words">
                {k.v}
              </div>
              <div className="mt-1 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-ember">
                {k.d}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live transmissions */}
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
            Live activity
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
            <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
            Streaming
          </div>
        </div>

        <ol className="mt-5 relative">
          <span className="absolute left-[7px] top-2 bottom-2 w-px bg-line" aria-hidden />
          {operatorEvents.length === 0 && (
            <li className="py-8 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
              Press play to start the reminders
            </li>
          )}
          {operatorEvents
            .slice()
            .reverse()
            .map((e, idx, arr) => {
              const fresh = idx === 0 && cursor >= e.c && cursor - e.c < 4;
              return (
                <li
                  key={`${e.c}-${e.title}-${arr.length - idx}`}
                  className="relative pl-7 pr-2 py-3"
                >
                  <span
                    className={`absolute left-0 top-4 h-3.5 w-3.5 rounded-full border ${chDotCx(e.ch)} ${
                      fresh ? "shadow-[0_0_0_4px_rgba(227,106,44,0.18)]" : ""
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em]">
                    <span className={`${chTextCx(e.ch)} break-words min-w-0`}>
                      {labelCh(e.ch)} · {e.title}
                    </span>
                    <span className="text-bone-3 whitespace-nowrap">{fmtCursor(e.c)}</span>
                  </div>
                  <p className="mt-1 text-[13px] sm:text-[13.5px] leading-snug text-bone-2 break-words">
                    {e.body}
                  </p>
                  {e.meta && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                      {e.meta}
                    </p>
                  )}
                </li>
              );
            })}
        </ol>
      </div>
    </section>
  );
}

function ChannelBadges({ on }: { on: { E: boolean; S: boolean; V: boolean } }) {
  return (
    <span className="flex gap-1 font-mono text-[12px]">
      {(["E", "S", "V"] as const).map((m) => (
        <span
          key={m}
          className={`flex h-7 w-7 items-center justify-center border ${
            on[m] ? "border-bone text-bone" : "border-bone-3/30 text-bone-3/40"
          }`}
        >
          {m}
        </span>
      ))}
    </span>
  );
}

function chDotCx(ch: Channel) {
  switch (ch) {
    case "EMAIL": return "border-bone bg-bone";
    case "SMS": return "border-ember bg-ember";
    case "VOICE": return "border-moss bg-moss";
    case "PAY": return "border-ember bg-ember";
    case "SYSTEM": return "border-bone-3 bg-transparent";
  }
}
function chTextCx(ch: Channel) {
  switch (ch) {
    case "EMAIL": return "text-bone";
    case "SMS": return "text-bone-2";
    case "VOICE": return "text-ember";
    case "PAY": return "text-ember";
    case "SYSTEM": return "text-bone-3";
  }
}
function labelCh(ch: Channel) {
  return ch;
}
function fmtCursor(c: number) {
  const day = Math.floor(c / 24);
  const hr = c % 24;
  return `D${day} · ${String(hr).padStart(2, "0")}:00`;
}

/* ────────────────────────────────────────────────────────── */
/*  Debtor pane                                               */
/* ────────────────────────────────────────────────────────── */

function DebtorPane({ visible, cursor }: { visible: Ev[]; cursor: number }) {
  const debtorEvents = visible.filter((e) => e.who !== "operator");
  const { hh } = fmtClock(cursor);

  // Group by display item (each event is a card on the phone)
  const cards = debtorEvents
    .filter(
      (e) =>
        e.ch === "EMAIL" ||
        e.ch === "SMS" ||
        e.ch === "VOICE" ||
        e.ch === "PAY",
    )
    .slice()
    .reverse();

  const recovered = visible.some(
    (e) => e.ch === "PAY" && e.title.startsWith("Payment"),
  );

  return (
    <section className="order-1 lg:order-2 bg-ink-1/40">
      {/* Pane label */}
      <div className="border-b border-line bg-ink-1 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
          ▲ Customer view · Member · Alex Carter
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
          iPhone · Notifications
        </span>
      </div>

      {/* Phone */}
      <div className="flex justify-center px-4 py-8 sm:py-10">
        <div className="relative w-[360px] max-w-full">
          {/* device */}
          <div className="rounded-[42px] border border-bone-3/30 bg-ink p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative overflow-hidden rounded-[34px] bg-[#070809]">
              {/* status bar */}
              <div className="relative flex items-center justify-between px-7 pt-3 pb-2 font-mono text-[11px] text-bone num">
                <span>{hh}:00</span>
                <span className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
                <span className="flex items-center gap-1.5 text-bone-2">
                  <span>5G</span>
                  <span>·</span>
                  <span>96%</span>
                </span>
              </div>

              {/* notifications heading */}
              <div className="px-5 pt-4 pb-2">
                <div className="font-display text-2xl text-bone">
                  Notifications
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
                  Today · {fmtClock(cursor).label}
                </div>
              </div>

              {/* feed */}
              <div className="thin-scroll max-h-[600px] overflow-y-auto px-3 pb-6 space-y-2.5">
                {cards.length === 0 && (
                  <div className="px-3 py-10 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                    No notifications yet.
                  </div>
                )}
                {cards.map((e, i) => (
                  <PhoneCard key={`${e.c}-${i}`} ev={e} />
                ))}

                {recovered && (
                  <div className="rounded-2xl border border-moss bg-moss/40 p-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone">
                      <span className="h-1.5 w-1.5 rounded-full bg-bone" />
                      Apple Pay
                    </div>
                    <div className="mt-2 font-display text-xl text-bone">
                      $89.00 paid · Atlas Athletic
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-2">
                      Membership restored · Receipt sent
                    </div>
                  </div>
                )}
              </div>

              {/* home indicator */}
              <div className="flex justify-center pb-3">
                <span className="h-1 w-32 rounded-full bg-bone-3/60" />
              </div>
            </div>
          </div>

          {/* side rail caption */}
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
            What your customer sees, in real time, on their phone.
          </p>
        </div>
      </div>
    </section>
  );
}

function PhoneCard({ ev }: { ev: Ev }) {
  if (ev.ch === "EMAIL") {
    return (
      <div className="rounded-2xl bg-[#16191c] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
          <span>✉</span>
          <span>Mail</span>
          <span className="ml-auto text-bone-3">{fmtCursor(ev.c)}</span>
        </div>
        <div className="mt-2 font-medium text-bone text-[13px]">
          Atlas Athletic · {ev.title.replace(/^Email #\d+ · /, "")}
        </div>
        <p className="mt-1 text-[12.5px] leading-snug text-bone-2">{ev.body}</p>
      </div>
    );
  }
  if (ev.ch === "SMS") {
    return (
      <div className="rounded-2xl bg-[#16191c] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
          <span>◉</span>
          <span>Messages · Atlas Athletic</span>
          <span className="ml-auto">{fmtCursor(ev.c)}</span>
        </div>
        <div className="mt-3 max-w-[260px] rounded-2xl rounded-bl-md bg-[#1f242a] px-3.5 py-2.5 text-[12.5px] leading-snug text-bone">
          {ev.body}
        </div>
      </div>
    );
  }
  if (ev.ch === "VOICE") {
    const incoming = ev.title.includes("placed");
    return (
      <div className="rounded-2xl bg-[#16191c] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
          <span className="text-ember">●</span>
          <span>Phone · Atlas Athletic</span>
          <span className="ml-auto">{fmtCursor(ev.c)}</span>
        </div>
        <div className="mt-2 font-medium text-bone text-[13px]">
          {incoming ? "Incoming call" : "Call · 1m12s"}
        </div>
        <p className="mt-1 text-[12.5px] leading-snug text-bone-2 break-words">{ev.body}</p>
        {ev.meta && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
            {ev.meta}
          </p>
        )}
      </div>
    );
  }
  // PAY card
  const tapped = ev.title.includes("tapped");
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tapped
          ? "border-ember/40 bg-ember/10"
          : "border-moss bg-moss/30"
      }`}
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone">
        <span>{tapped ? "⌘" : "✓"}</span>
        <span>Wallet · Atlas Athletic</span>
        <span className="ml-auto text-bone-3">{fmtCursor(ev.c)}</span>
      </div>
      <div className="mt-2 font-display text-lg text-bone">
        {tapped ? "Authorized · $89.00" : "Paid · $89.00"}
      </div>
      <p className="mt-0.5 text-[12.5px] text-bone-2">{ev.body}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Footer event log                                          */
/* ────────────────────────────────────────────────────────── */

function EventLog({ visible }: { visible: Ev[] }) {
  return (
    <section className="border-t border-line bg-ink-1/30">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-bone-3">
            Event log · {visible.length} of {SCENARIO.length}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
            Signed, time-stamped, exportable as CSV
          </p>
        </div>
        {/* Mobile: stacked event cards */}
        <ul className="md:hidden mt-5 divide-y divide-line border-y border-line">
          {visible.map((e, i) => (
            <li key={i} className="px-3 sm:px-4 py-3.5">
              <div className="flex items-baseline justify-between font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] sm:tracking-[0.2em]">
                <span className={chTextCx(e.ch)}>{e.ch}</span>
                <span className="num text-bone-3">{fmtCursor(e.c)}</span>
              </div>
              <div className="mt-1 text-[13.5px] sm:text-[14px] text-bone leading-snug break-words">
                {e.title}
              </div>
              <p className="mt-0.5 text-[12.5px] text-bone-2 leading-snug break-words">
                {e.body}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                {e.who === "operator" ? "owner" : e.who === "debtor" ? "customer" : "both"}
              </p>
            </li>
          ))}
        </ul>

        {/* Tablet+: full table */}
        <div className="hidden md:block mt-5 overflow-x-auto thin-scroll">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3">
                <th className="px-3 py-3 font-medium">When</th>
                <th className="px-3 py-3 font-medium">Channel</th>
                <th className="px-3 py-3 font-medium">Side</th>
                <th className="px-3 py-3 font-medium">Event</th>
                <th className="px-3 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e, i) => (
                <tr key={i} className="row border-b border-line-soft">
                  <td className="num px-3 py-3 font-mono text-[12px] text-bone-3 whitespace-nowrap">
                    {fmtCursor(e.c)}
                  </td>
                  <td className={`px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] ${chTextCx(e.ch)}`}>
                    {e.ch}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
                    {e.who === "operator" ? "owner" : e.who === "debtor" ? "customer" : "both"}
                  </td>
                  <td className="px-3 py-3 text-bone">{e.title}</td>
                  <td className="px-3 py-3 text-bone-2">{e.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Top component                                             */
/* ────────────────────────────────────────────────────────── */

export function Demo() {
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCursor((c) => Math.min(c + speed, MAX));
    }, 200);
    return () => clearInterval(id);
  }, [playing, speed]);

  useEffect(() => {
    if (cursor >= MAX && playing) setPlaying(false);
  }, [cursor, playing]);

  const visible = useMemo(() => SCENARIO.filter((e) => e.c <= cursor), [cursor]);
  const status = useMemo(() => statusFor(visible), [visible]);

  return (
    <main className="min-h-screen">
      <ControlBar
        cursor={cursor}
        setCursor={setCursor}
        playing={playing}
        setPlaying={setPlaying}
        speed={speed}
        setSpeed={setSpeed}
      />
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
        <OperatorPane visible={visible} status={status} cursor={cursor} />
        <DebtorPane visible={visible} cursor={cursor} />
      </div>
      <EventLog visible={visible} />
    </main>
  );
}
