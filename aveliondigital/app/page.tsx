import { Hero } from "@/components/hero";
import { IntroSection } from "@/components/intro-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ScrollSmoothLayout } from "@/components/scroll-smooth-layout";
import { ServicesScroll } from "@/components/services-scroll";
import { Header } from "@/components/ui/header-2";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollSmoothLayout>
        <div className="relative bg-[#050508]">
          <Hero />
          {/*
           * Shared white wrapper for all sections that have a white background.
           * Any sub-pixel gap between children (caused by ScrollSmoother's
           * translateY compositing) will show this white background instead of
           * the dark parent — eliminating the grey line artefact on scroll.
           */}
          <div className="bg-white">
            <IntroSection />
            <ServicesScroll />
          </div>
          <PortfolioSection />
        </div>
      </ScrollSmoothLayout>
    </>
  );
}
