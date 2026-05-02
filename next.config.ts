import type { NextConfig } from "next";

// Static security headers applied to every response.
//   - HSTS pins TLS for 2 years; `preload` directive allows submission to
//     hstspreload.org once the header has been live ≥14 days (manops §1.1).
//   - X-Frame-Options DENY is a belt-and-braces fallback; `frame-ancestors
//     'none'` in the CSP (set per-request in proxy.ts) is the modern
//     equivalent.
//   - COOP/CORP isolate this origin from any popup or cross-origin embed.
//   - Permissions-Policy denies the three APIs we never use.
//
// CSP is set in proxy.ts because it needs a per-request nonce.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
