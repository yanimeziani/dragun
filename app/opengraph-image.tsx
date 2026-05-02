import { ImageResponse } from "next/og";
import { tokens } from "./_lib/colors";

export const runtime = "edge";
export const alt = "Dragun — Money owed, brought home.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) doesn't read CSS variables, so we compose alphas locally
// from the canonical RGB. Update tokens once and these stay in sync.
const EMBER_RGB = "255,106,26";
const emberFloor = `radial-gradient(50% 50% at 50% 50%, rgba(${EMBER_RGB},0.45) 0%, rgba(${EMBER_RGB},0.10) 35%, rgba(0,0,0,0) 70%)`;

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: tokens.ink,
          color: tokens.bone,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* ember floor */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -260,
            height: 480,
            display: "flex",
            background: emberFloor,
          }}
        />

        {/* top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: tokens.bone3,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M3.5 4.5 H20.5" stroke={tokens.bone} strokeWidth="1.6" />
              <path d="M12 4.5 V19.5" stroke={tokens.bone} strokeWidth="1.6" />
              <path
                d="M6 13 L12 19.5 L18 13"
                stroke={tokens.bone}
                strokeWidth="1.6"
              />
              <circle cx="12" cy="9" r="1.4" fill={tokens.ember} />
            </svg>
            <span style={{ color: tokens.bone, letterSpacing: 2 }}>Dragun</span>
            <span>·</span>
            <span>Automated debt recovery for SMBs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>EST · 2026</div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 168,
            lineHeight: 0.94,
            letterSpacing: -3,
          }}
        >
          <span style={{ color: tokens.bone }}>Money owed,</span>
          <span style={{ color: tokens.bone2, fontStyle: "italic" }}>
            brought home.
          </span>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: tokens.bone3,
          }}
        >
          <div style={{ display: "flex" }}>
            Telnyx · Resend · Dragun voice agent
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: tokens.ember,
            }}
          >
            <span
              style={{
                display: "flex",
                width: 10,
                height: 10,
                borderRadius: 999,
                background: tokens.ember,
              }}
            />
            Live · Free to start
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
