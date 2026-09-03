import type { Metadata } from "next";

import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { IntroSection } from "@/components/intro-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ScrollSmoothLayout } from "@/components/scroll-smooth-layout";
import { ServicesScroll } from "@/components/services-scroll";
import { StructuredData } from "@/components/structured-data";
import { Header } from "@/components/ui/header-2";
import {
  faqJsonLd,
  HOME_FAQ,
  SITE_DESCRIPTION,
  SITE_NAME,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Software Development, App & E-Commerce Agency`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Software Development, App & E-Commerce Agency`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData
        data={[
          webPageJsonLd({
            path: "/",
            title: `${SITE_NAME} | Software Development, App & E-Commerce Agency`,
            description: SITE_DESCRIPTION,
          }),
          faqJsonLd(HOME_FAQ),
        ]}
      />
      <Header />
      <ScrollSmoothLayout>
        <div className="relative bg-[#050508]">
          <Hero />
          <div className="bg-white">
            <IntroSection />
          </div>
          <ServicesScroll />
          <PortfolioSection />
          <ContactSection />
        </div>
      </ScrollSmoothLayout>
    </>
  );
}
