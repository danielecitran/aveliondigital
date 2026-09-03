import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CursorFollowerHost } from "@/components/cursor-follower";
import { StructuredData } from "@/components/structured-data";
import {
  DEFAULT_OG_IMAGE,
  LEGAL_NAME,
  organizationJsonLd,
  peopleJsonLd,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  websiteJsonLd,
} from "@/lib/seo";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050508",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Software Development & E-Commerce Agency`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [
    { name: "Daniele Citran", url: SITE_URL },
    { name: "Erik Buser", url: SITE_URL },
  ],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CH",
    alternateLocale: ["de_CH", "en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Software Development & E-Commerce Agency`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — Swiss Tech Agency`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Software Development & E-Commerce Agency`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
      <body className="min-h-full">
        <StructuredData
          data={[organizationJsonLd(), websiteJsonLd(), ...peopleJsonLd()]}
        />
        {children}
        <CursorFollowerHost />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
