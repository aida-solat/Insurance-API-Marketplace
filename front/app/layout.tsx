import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis — Enterprise Insurance Decision Platform",
  description:
    "Audit-grade AI for underwriting and claims operations. Deterministic rules, explainable LLM rationale, and an immutable decision log built for North American carriers.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://insurance.deciwa.com",
  ),
  openGraph: {
    title: "Aegis — Enterprise Insurance Decision Platform",
    description:
      "Audit-grade AI for underwriting and claims operations, built for North American carriers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
