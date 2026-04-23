import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis — AI Insurance Decision Platform",
  description:
    "Auditable, explainable AI for underwriting and claims triage. Hybrid rules + LLM. Runs offline out-of-the-box.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://insurance.deciwa.com",
  ),
  openGraph: {
    title: "Aegis — AI Insurance Decision Platform",
    description:
      "Auditable, explainable AI for underwriting and claims triage.",
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
