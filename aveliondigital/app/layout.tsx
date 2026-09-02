import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CursorFollowerHost } from "@/components/cursor-follower";
import "./globals.css";

/*
 * Typografie-Stack (Plus Jakarta Sans als Anker):
 * – Plus Jakarta Sans: Display-Headlines (Hero, Services, Portfolio)
 * – Inter: Body, Labels, UI — klassische Sans-Paarung zu Plus Jakarta Sans
 * – IBM Plex Mono: Monospace für Code/technische Akzente
 */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daverion Digital | Premium Creative & Tech Agency",
  description:
    "Swiss creative and technology agency building apps, websites, brands and digital products. High-performance, conversion-driven and AI-powered.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CursorFollowerHost />
      </body>
    </html>
  );
}
