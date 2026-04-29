import type { Metadata } from "next";
import {
  Instrument_Serif,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dragun — Automated debt recovery for SMBs",
  description:
    "Dragun is the back-office that brings your money home. Automated recovery for small and medium businesses across email, SMS and voice — without sounding like a debt collector.",
  metadataBase: new URL("https://dragun.app"),
  openGraph: {
    title: "Dragun — Money owed, brought home.",
    description:
      "Automated debt recovery for SMBs — across email, SMS and voice. Private alpha now onboarding.",
    type: "website",
    siteName: "Dragun",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragun — Money owed, brought home.",
    description:
      "Automated debt recovery for SMBs across email, SMS and voice.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
