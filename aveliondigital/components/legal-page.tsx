"use client";

import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

import { Header } from "@/components/ui/header-2";
import { ScrollSmoothLayout } from "@/components/scroll-smooth-layout";
import { SiteFooter } from "@/components/site-footer";
import { resetPageScroll } from "@/lib/smooth-scroll";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    resetPageScroll();
    const raf = requestAnimationFrame(() => resetPageScroll());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <>
      <Header />
      <ScrollSmoothLayout key={pathname}>
        <div className="min-h-screen bg-[#050508]">
          <main className="px-6 pb-24 pt-32 sm:px-10 sm:pb-28 sm:pt-36 lg:px-16 lg:pt-40">
            <h1
              className="font-playfair font-medium tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(2.35rem, 5vw, 4.5rem)" }}
            >
              {title}
            </h1>
            {children ? (
              <div className="mt-14 max-w-3xl sm:mt-16 lg:mt-20">{children}</div>
            ) : null}
          </main>
          <div className="bg-[#f4f1ea]">
            <SiteFooter />
          </div>
        </div>
      </ScrollSmoothLayout>
    </>
  );
}
