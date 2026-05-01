import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://dragun.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/legal/privacy", "/legal/terms", "/legal/disclosures"],
        disallow: [
          "/app",
          "/app/",
          "/auth/",
          "/welcome",
          "/p/",
          "/u/",
          "/api/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
