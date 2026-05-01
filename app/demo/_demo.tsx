"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Channel,
  ClientFixture,
  ScenarioEvent,
} from "../_data/clients/types";

const h = (d: number, hr: number) => d * 24 + hr;
const MAX = h(14, 10);

type StatusKey =
  | "pending"
  | "drafted"
  | "followingUp"
  | "promised"
  | "paid"
  | "paidClosed";

const STATUS_CX: Record<StatusKey, string> = {
  pending: "border-bone-3/40 text-bone-3",
  drafted: "border-bone-3/40 text-bone-3",
  followingUp: "border-ember/60 text-ember",
  promised: "border-bone text-bone",
  paid: "bg-ember text-ink border-ember",
  paidClosed: "bg-moss text-bone border-moss",
};

function statusKeyFor(visible: ScenarioEvent[]): StatusKey {
  if (visible.some((e) => e.kind === "closed")) return "paidClosed";
  if (visible.some((e) => e.kind === "payReceived")) return "paid";
  if (visible.some((e) => e.kind === "callDuration")) return "promised";
  if (visible.some((e) => e.ch === "SMS")) return "followingUp";
  if (visible.some((e) => e.ch === "EMAIL")) return "drafted";
  return "pending";
}

function statusLabel(key: StatusKey, s: ClientFixture["strings"]) {
  switch (key) {
    case "pending":
      return s.statusPending;
    case "drafted":
      return s.statusDrafted;
    case "followingUp":
      return s.statusFollowingUp;
    case "promised":
      return s.statusPromised;
    case "paid":
      return s.statusPaid;
    case "paidClosed":
      return s.statusPaidClosed;
  }
}

function fmtClock(cursor: number) {
  const day = Math.floor(cursor / 24);
  const hr = cursor % 24;
  const hh = String(hr).padStart(2, "0");
  return { day, label: `D${day} · ${hh}:00`, hh };
}

function fmtCursor(c: number) {
  const day = Math.floor(c / 24);
  const hr = c % 24;
  return `D${day} · ${String(hr).padStart(2, "0")}:00`;
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
/*  Top bar + scrubber                                        */
/* ────────────────────────────────────────────────────────── */

function ControlBar({
  cursor,
  setCursor,
  playing,
  setPlaying,
  speed,
  setSpeed,
  fixture,
}: {
  cursor: number;
  setCursor: (n: number) => void;
  playing: boolean;
  setPlaying: (b: boolean) => void;
  speed: number;
  setSpeed: (n: number) => void;
  fixture: ClientFixture;
}) {
  const { label, day } = fmtClock(cursor);
  const s = fixture.strings;

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      {/* row 1 */}
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-x-4 gap-y-1 px-4 sm:px-6 py-3 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-bone-3">
        <a href="/" className="flex items-center gap-2 text-bone">
          <Mark className="h-4 w-4" />
          <span className="font-display text-base tracking-tight">Dragun</span>
          <span className="text-bone-3">/</span>
          <span>{s.liveDemo}</span>
        </a>
        <span className="hidden md:inline">{s.scenarioCaption}</span>
        <span className="ml-auto flex items-center gap-2 text-bone-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-ember pulse" : "bg-bone-3"}`}
          />
          {playing
            ? s.statusPlaying
            : cursor >= MAX
              ? s.statusComplete
              : s.statusPaused}
        </span>
        <a
          href="/"
          className="hidden md:inline border-b border-line pb-px text-bone-2 hover:text-bone hover:border-bone"
        >
          {s.backToSite}
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
            aria-label={playing ? s.statusPaused : s.statusPlaying}
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
            {s.reset}
          </button>
          <button
            type="button"
            onClick={() => {
              setCursor(MAX);
              setPlaying(false);
            }}
            className="inline-flex h-10 items-center gap-2 border border-line bg-transparent px-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-2 hover:border-bone hover:text-bone"
          >
            {s.skip}
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
          {[1, 4, 16].map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSpeed(sp)}
              className={`px-2 py-1 ${
                speed === sp ? "bg-bone text-ink" : "text-bone-3 hover:text-bone"
              }`}
            >
              {sp}×
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
          {fixture.scenario.map((e, i) => (
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
  statusKey,
  cursor,
  fixture,
}: {
  visible: ScenarioEvent[];
  statusKey: StatusKey;
  cursor: number;
  fixture: ClientFixture;
}) {
  const s = fixture.strings;
  const c = fixture.case;
  const channels = {
    E: visible.some((e) => e.ch === "EMAIL"),
    S: visible.some((e) => e.ch === "SMS"),
    V: visible.some((e) => e.ch === "VOICE"),
  };
  const recovered = visible.some((e) => e.kind === "payReceived");
  const ttp = recovered ? c.timeToPay : "—";
  const fee = recovered ? c.fee : "—";
  const net = recovered ? c.netToLedger : "—";

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
          app.dragun.io / customers / {c.ref}
        </div>
        <div className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-bone-3">
          {fixture.appHostHandle}
        </div>
      </div>

      {/* Operator pane label */}
      <div className="border-b border-line bg-ink-1 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
          {s.operatorViewLabel}
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
              {c.customerLine}
            </div>
            <div className="mt-2 font-display text-2xl sm:text-3xl text-bone break-words">
              {c.memberName}
            </div>
            <div className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-bone-3">
              {c.memberSince}
            </div>
          </div>
          <span
            className={`inline-flex border px-2.5 sm:px-3 py-1 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] ${STATUS_CX[statusKey]}`}
          >
            {statusLabel(statusKey, s)}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-line">
        {[
          { k: s.kpiAmount, v: c.amountDisplay, d: s.kpiAmountSubline },
          {
            k: s.kpiTtp,
            v: ttp,
            d: recovered ? s.kpiTtpPaid : s.kpiTtpOpen,
          },
          {
            k: s.kpiChannels,
            v: <ChannelBadges on={channels} />,
            d: s.kpiChannelsSubline,
          },
          {
            k: s.kpiNet,
            v: net,
            d: recovered ? `${s.kpiNetFeePrefix} ${fee}` : s.kpiNetPending,
          },
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
            {s.liveActivity}
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
            <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
            {s.streaming}
          </div>
        </div>

        <ol className="mt-5 relative">
          <span className="absolute left-[7px] top-2 bottom-2 w-px bg-line" aria-hidden />
          {operatorEvents.length === 0 && (
            <li className="py-8 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
              {s.pressPlay}
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
                      {s.channelLabels[e.ch]} · {e.title}
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
    case "EMAIL":
      return "border-bone bg-bone";
    case "SMS":
      return "border-ember bg-ember";
    case "VOICE":
      return "border-moss bg-moss";
    case "PAY":
      return "border-ember bg-ember";
    case "SYSTEM":
      return "border-bone-3 bg-transparent";
  }
}
function chTextCx(ch: Channel) {
  switch (ch) {
    case "EMAIL":
      return "text-bone";
    case "SMS":
      return "text-bone-2";
    case "VOICE":
      return "text-ember";
    case "PAY":
      return "text-ember";
    case "SYSTEM":
      return "text-bone-3";
  }
}

/* ────────────────────────────────────────────────────────── */
/*  Debtor pane                                               */
/* ────────────────────────────────────────────────────────── */

function DebtorPane({
  visible,
  cursor,
  fixture,
}: {
  visible: ScenarioEvent[];
  cursor: number;
  fixture: ClientFixture;
}) {
  const s = fixture.strings;
  const debtorEvents = visible.filter((e) => e.who !== "operator");
  const { hh, label } = fmtClock(cursor);

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

  const recovered = visible.some((e) => e.kind === "payReceived");

  return (
    <section className="order-1 lg:order-2 bg-ink-1/40">
      {/* Pane label */}
      <div className="border-b border-line bg-ink-1 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
          {s.customerViewLabel}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
          {s.iphoneNotifications}
        </span>
      </div>

      {/* Phone */}
      <div className="flex justify-center px-4 py-8 sm:py-10">
        <div className="relative w-[360px] max-w-full">
          <div className="rounded-[42px] border border-bone-3/30 bg-ink p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative overflow-hidden rounded-[34px] bg-[#070809]">
              <div className="relative flex items-center justify-between px-7 pt-3 pb-2 font-mono text-[11px] text-bone num">
                <span>{hh}:00</span>
                <span className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
                <span className="flex items-center gap-1.5 text-bone-2">
                  <span>5G</span>
                  <span>·</span>
                  <span>96%</span>
                </span>
              </div>

              <div className="px-5 pt-4 pb-2">
                <div className="font-display text-2xl text-bone">
                  {s.notifications}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
                  {s.today} · {label}
                </div>
              </div>

              <div className="thin-scroll max-h-[600px] overflow-y-auto px-3 pb-6 space-y-2.5">
                {cards.length === 0 && (
                  <div className="px-3 py-10 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-bone-3">
                    {s.noNotifications}
                  </div>
                )}
                {cards.map((e, i) => (
                  <PhoneCard key={`${e.c}-${i}`} ev={e} fixture={fixture} />
                ))}

                {recovered && (
                  <div className="rounded-2xl border border-moss bg-moss/40 p-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone">
                      <span className="h-1.5 w-1.5 rounded-full bg-bone" />
                      {s.applePayLabel}
                    </div>
                    <div className="mt-2 font-display text-xl text-bone">
                      {s.applePayHeadline}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-2">
                      {s.applePayCaption}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center pb-3">
                <span className="h-1 w-32 rounded-full bg-bone-3/60" />
              </div>
            </div>
          </div>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
            {s.phoneCaption}
          </p>
        </div>
      </div>
    </section>
  );
}

function PhoneCard({
  ev,
  fixture,
}: {
  ev: ScenarioEvent;
  fixture: ClientFixture;
}) {
  const s = fixture.strings;
  if (ev.ch === "EMAIL") {
    return (
      <div className="rounded-2xl bg-[#16191c] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-3">
          <span>✉</span>
          <span>{s.cardMail}</span>
          <span className="ml-auto text-bone-3">{fmtCursor(ev.c)}</span>
        </div>
        <div className="mt-2 font-medium text-bone text-[13px]">
          {fixture.displayName} · {ev.title}
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
          <span>{s.cardMessagesLabel}</span>
          <span className="ml-auto">{fmtCursor(ev.c)}</span>
        </div>
        <div className="mt-3 max-w-[260px] rounded-2xl rounded-bl-md bg-[#1f242a] px-3.5 py-2.5 text-[12.5px] leading-snug text-bone">
          {ev.body}
        </div>
      </div>
    );
  }
  if (ev.ch === "VOICE") {
    const placed = ev.kind === "callPlaced";
    return (
      <div className="rounded-2xl bg-[#16191c] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
          <span className="text-ember">●</span>
          <span>{s.cardPhoneLabel}</span>
          <span className="ml-auto">{fmtCursor(ev.c)}</span>
        </div>
        <div className="mt-2 font-medium text-bone text-[13px]">
          {placed ? s.cardIncomingCall : s.cardCallTitle}
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
  const tapped = ev.kind === "payAuthorized";
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tapped ? "border-ember/40 bg-ember/10" : "border-moss bg-moss/30"
      }`}
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bone">
        <span>{tapped ? "⌘" : "✓"}</span>
        <span>{s.cardWalletLabel}</span>
        <span className="ml-auto text-bone-3">{fmtCursor(ev.c)}</span>
      </div>
      <div className="mt-2 font-display text-lg text-bone">
        {tapped ? s.cardAuthorizedTitle : s.cardPaidTitle}
      </div>
      <p className="mt-0.5 text-[12.5px] text-bone-2">{ev.body}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Footer event log                                          */
/* ────────────────────────────────────────────────────────── */

function EventLog({
  visible,
  total,
  fixture,
}: {
  visible: ScenarioEvent[];
  total: number;
  fixture: ClientFixture;
}) {
  const s = fixture.strings;
  return (
    <section className="border-t border-line bg-ink-1/30">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-bone-3">
            {s.eventLogTitle} · {visible.length} {s.eventLogConnector} {total}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
            {s.eventLogCaption}
          </p>
        </div>
        {/* Mobile */}
        <ul className="md:hidden mt-5 divide-y divide-line border-y border-line">
          {visible.map((e, i) => (
            <li key={i} className="px-3 sm:px-4 py-3.5">
              <div className="flex items-baseline justify-between font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] sm:tracking-[0.2em]">
                <span className={chTextCx(e.ch)}>{s.channelLabels[e.ch]}</span>
                <span className="num text-bone-3">{fmtCursor(e.c)}</span>
              </div>
              <div className="mt-1 text-[13.5px] sm:text-[14px] text-bone leading-snug break-words">
                {e.title}
              </div>
              <p className="mt-0.5 text-[12.5px] text-bone-2 leading-snug break-words">
                {e.body}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-3">
                {sideLabel(e.who, s)}
              </p>
            </li>
          ))}
        </ul>

        {/* Tablet+ */}
        <div className="hidden md:block mt-5 overflow-x-auto thin-scroll">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.18em] text-bone-3">
                <th className="px-3 py-3 font-medium">{s.eventLogColWhen}</th>
                <th className="px-3 py-3 font-medium">{s.eventLogColChannel}</th>
                <th className="px-3 py-3 font-medium">{s.eventLogColSide}</th>
                <th className="px-3 py-3 font-medium">{s.eventLogColEvent}</th>
                <th className="px-3 py-3 font-medium">{s.eventLogColDetail}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e, i) => (
                <tr key={i} className="row border-b border-line-soft">
                  <td className="num px-3 py-3 font-mono text-[12px] text-bone-3 whitespace-nowrap">
                    {fmtCursor(e.c)}
                  </td>
                  <td
                    className={`px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] ${chTextCx(e.ch)}`}
                  >
                    {s.channelLabels[e.ch]}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
                    {sideLabel(e.who, s)}
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

function sideLabel(
  who: ScenarioEvent["who"],
  s: ClientFixture["strings"],
): string {
  if (who === "operator") return s.sideOwner;
  if (who === "debtor") return s.sideCustomer;
  return s.sideBoth;
}

/* ────────────────────────────────────────────────────────── */
/*  Top component                                             */
/* ────────────────────────────────────────────────────────── */

export function Demo({ fixture }: { fixture: ClientFixture }) {
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

  const visible = useMemo(
    () => fixture.scenario.filter((e) => e.c <= cursor),
    [cursor, fixture.scenario],
  );
  const statusKey = useMemo(() => statusKeyFor(visible), [visible]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <ControlBar
        cursor={cursor}
        setCursor={setCursor}
        playing={playing}
        setPlaying={setPlaying}
        speed={speed}
        setSpeed={setSpeed}
        fixture={fixture}
      />
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
        <OperatorPane
          visible={visible}
          statusKey={statusKey}
          cursor={cursor}
          fixture={fixture}
        />
        <DebtorPane visible={visible} cursor={cursor} fixture={fixture} />
      </div>
      <EventLog visible={visible} total={fixture.scenario.length} fixture={fixture} />
    </main>
  );
}
