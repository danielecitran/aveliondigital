import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CursorFollower } from "@/components/cursor-follower";
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
  title: "Daverion Digital – Premium Creative & Tech Agency",
  description:
    "Swiss creative and technology agency building apps, websites, brands and digital products. High-performance, conversion-driven and AI-powered.",
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
        <CursorFollower />
      </body>
    </html>
  );
}
