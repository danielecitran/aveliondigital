import { Hero } from "@/components/hero";
import { IntroSection } from "@/components/intro-section";
import { ScrollSmoothLayout } from "@/components/scroll-smooth-layout";
import { Header } from "@/components/ui/header-2";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollSmoothLayout>
        <div className="relative bg-[#050508]">
          <Hero />
          <IntroSection />
        </div>
      </ScrollSmoothLayout>
    </>
  );
}
