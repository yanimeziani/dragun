import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="#f4ede2"
          strokeWidth="1.6"
          strokeLinecap="square"
        >
          <path d="M3.5 4.5 H20.5" />
          <path d="M12 4.5 V19.5" />
          <path d="M6 13 L12 19.5 L18 13" />
          <circle cx="12" cy="9" r="1.1" fill="#f4ede2" stroke="none" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
