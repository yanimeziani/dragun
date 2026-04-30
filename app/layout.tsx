import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dragun — Friendly invoice follow-up for small businesses",
  description:
    "Dragun is the gentle back-office that helps small businesses get paid on time — friendly reminders across email, SMS and voice, written to keep customers, not collect from them.",
  metadataBase: new URL("https://dragun.app"),
  openGraph: {
    title: "Dragun — Friendly invoice follow-up.",
    description:
      "Get paid on time without the awkward conversation. Friendly reminders across email, SMS and voice. Public alpha now open.",
    type: "website",
    siteName: "Dragun",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragun — Friendly invoice follow-up.",
    description:
      "Get paid on time across email, SMS and voice — without the awkward conversation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
