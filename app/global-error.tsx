"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error-boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#101012",
          color: "#ECE4D2",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 640, padding: 32 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: "#E36A2C",
              margin: 0,
            }}
          >
            Fatal error
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 4rem)",
              lineHeight: 1.04,
              margin: "12px 0 0 0",
              fontWeight: 400,
            }}
          >
            We hit an error before the page loaded.
          </h1>
          <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.55 }}>
            Refresh, or write to founders@dragun.app with the reference below.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: 12,
                fontFamily: "monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#7c7264",
              }}
            >
              Ref · {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              background: "#E36A2C",
              color: "#101012",
              border: "none",
              padding: "14px 24px",
              fontFamily: "monospace",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              cursor: "pointer",
            }}
          >
            Try again →
          </button>
        </div>
      </body>
    </html>
  );
}
