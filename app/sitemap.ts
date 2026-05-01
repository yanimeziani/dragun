import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://dragun.app";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/legal/disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/auth/sign-up`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/auth/sign-in`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
