import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dragun — Money owed, brought home.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0b0c",
          color: "#ece4d2",
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
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(227,106,44,0.45) 0%, rgba(227,106,44,0.10) 35%, rgba(0,0,0,0) 70%)",
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
            color: "#968f7e",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M3.5 4.5 H20.5" stroke="#ece4d2" strokeWidth="1.6" />
              <path d="M12 4.5 V19.5" stroke="#ece4d2" strokeWidth="1.6" />
              <path
                d="M6 13 L12 19.5 L18 13"
                stroke="#ece4d2"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="9" r="1.4" fill="#e36a2c" />
            </svg>
            <span style={{ color: "#ece4d2", letterSpacing: 2 }}>Dragun</span>
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
          <span style={{ color: "#ece4d2" }}>Money owed,</span>
          <span style={{ color: "#d4ccb6", fontStyle: "italic" }}>
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
            color: "#968f7e",
          }}
        >
          <div style={{ display: "flex" }}>
            Resend · Twilio · Dragun voice agent
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#e36a2c",
            }}
          >
            <span
              style={{
                display: "flex",
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#e36a2c",
              }}
            />
            Private alpha — Live
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
