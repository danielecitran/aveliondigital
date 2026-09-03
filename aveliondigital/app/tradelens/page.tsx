import type { Metadata } from "next";

import { StructuredData } from "@/components/structured-data";
import { TradeLensPage } from "@/components/tradelens/tradelens-page";
import {
  faqJsonLd,
  TRADELENS_DESCRIPTION,
  TRADELENS_FAQ,
  TRADELENS_KEYWORDS,
  TRADELENS_NAME,
  TRADELENS_PATH,
  tradelensSoftwareJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "TradeLens App | Chart Analysis",
  },
  description: TRADELENS_DESCRIPTION,
  keywords: [...TRADELENS_KEYWORDS],
  alternates: { canonical: TRADELENS_PATH },
  openGraph: {
    title: "TradeLens App | Chart Analysis",
    description: TRADELENS_DESCRIPTION,
    url: TRADELENS_PATH,
    type: "website",
    images: [
      {
        url: "/tradelens.png",
        alt: "TradeLens App",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TradeLens App | Chart Analysis",
    description: TRADELENS_DESCRIPTION,
    images: ["/tradelens.png"],
  },
};

export default function Page() {
  return (
    <>
      <StructuredData
        data={[
          webPageJsonLd({
            path: TRADELENS_PATH,
            title: `${TRADELENS_NAME} App | Chart Analysis`,
            description: TRADELENS_DESCRIPTION,
          }),
          tradelensSoftwareJsonLd(),
          faqJsonLd(TRADELENS_FAQ),
        ]}
      />
      <TradeLensPage />
    </>
  );
}
