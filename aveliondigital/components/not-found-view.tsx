"use client";

import * as React from "react";
import gsap from "gsap";

import { Header } from "@/components/ui/header-2";
import { ScrollSmoothLayout } from "@/components/scroll-smooth-layout";
import { SiteFooter } from "@/components/site-footer";
import { INK_FILL_SIZE, useInkFill } from "@/components/use-ink-fill";
import { cn } from "@/lib/utils";

export function NotFoundView() {
  const mainRef = React.useRef<HTMLElement>(null);
  const ink = useInkFill();

  React.useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mark = el.querySelector("[data-404-mark]");
    const items = el.querySelectorAll("[data-404-item]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mark,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
      );
      gsap.fromTo(
        items,
        { opacity: 0, y: 16, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.12,
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <ScrollSmoothLayout>
        <div className="min-h-screen bg-[#050508]">
          <main
            ref={mainRef}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32 text-center sm:px-10 sm:pb-28 sm:pt-36 lg:px-16 lg:pt-40"
          >
            <span
              data-404-mark
              aria-hidden
              className="font-playfair pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none font-medium leading-none tracking-[-0.06em] text-white/[0.06]"
              style={{ fontSize: "clamp(8rem, 28vw, 22rem)" }}
            >
              404
            </span>

            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.045), transparent 42%)," +
                  "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "auto, 28px 28px",
              }}
            />

            <div className="relative flex max-w-xl flex-col items-center">
              <p
                data-404-item
                className="font-dm-sans-hero text-[11px] font-medium uppercase text-white/38"
              >
                Page not found
              </p>
              <h1
                data-404-item
                className="font-playfair mt-5 font-medium tracking-[-0.03em] text-white"
                style={{ fontSize: "clamp(2.35rem, 5vw, 4.5rem)" }}
              >
                This page does not exist.
              </h1>
              <p
                data-404-item
                className="font-dm-sans-hero mt-6 max-w-md text-[15px] leading-[1.85] text-white/55"
              >
                The route was never part of the site. What you are looking for is
                probably on the homepage.
              </p>
              <a
                data-404-item
                href="/"
                className={cn(
                  "font-dm-sans-hero group relative mt-10 inline-flex max-w-full overflow-hidden rounded-full",
                  "border border-white/20 bg-white/[0.05] px-10 py-3.5 sm:px-12 sm:py-4",
                  "text-[11px] font-semibold uppercase tracking-[0.26em] text-white/95 sm:text-xs sm:tracking-[0.28em]",
                  "transition-colors duration-500 ease-out hover:border-white/55 hover:text-neutral-950",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90",
                )}
                onPointerMove={ink.onPointerMove}
                onPointerEnter={ink.onPointerEnter}
                onPointerLeave={ink.onPointerLeave}
              >
                <span
                  ref={ink.fillRef}
                  className="pointer-events-none absolute left-0 top-0 rounded-full bg-white"
                  aria-hidden
                  style={{
                    width: INK_FILL_SIZE,
                    height: INK_FILL_SIZE,
                    marginLeft: -INK_FILL_SIZE / 2,
                    marginTop: -INK_FILL_SIZE / 2,
                    willChange: "transform",
                  }}
                />
                <span className="relative z-10 truncate">Back home</span>
              </a>
            </div>
          </main>
          <div className="bg-[#f4f1ea]">
            <SiteFooter />
          </div>
        </div>
      </ScrollSmoothLayout>
    </>
  );
}
