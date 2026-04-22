import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { CursorFollower } from "@/components/cursor-follower";
import "./globals.css";

/*
 * Only load what is actually used:
 * – Playfair Display: exclusively "500 italic" across the entire site
 *   (hero h1, services titles, portfolio heading).
 *   Reduced from 8 variants (4 weights × 2 styles) → 1. Saves 7 font file requests.
 * – Geist / Geist_Mono removed: Geist Mono was unused template bloat.
 *   DM Sans covers all body/UI copy. Fallback to system-ui keeps render instant.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avelion Digital — Premium Creative & Tech Agency",
  description:
    "Swiss creative and technology agency building apps, websites, brands and digital products. High-performance, conversion-driven, AI-powered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CursorFollower />
      </body>
    </html>
  );
}
