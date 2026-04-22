 "use client";

 import * as React from "react";
 import gsap from "gsap";

import { IntroCircularMark } from "@/components/intro-circular-mark";
import { cn } from "@/lib/utils";

const bodyClass = cn(
  "font-dm-sans-hero text-[15px] leading-[1.72] text-neutral-600 sm:text-base sm:leading-[1.75]",
);


function SwissFlagMini() {
  return (
    <span
      className={cn(
        "avelion-swiss-badge relative inline-flex size-5 shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        "bg-[radial-gradient(120%_120%_at_30%_25%,#ff6b63_0%,#D52B1E_48%,#a31212_100%)]",
        "shadow-[0_18px_34px_-26px_rgba(0,0,0,0.45)] ring-1 ring-black/10",
      )}
      aria-hidden
      title="Switzerland"
    >
      <span className="relative block h-[11px] w-[11px] drop-shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <span className="absolute left-1/2 top-1/2 h-[9px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-white" />
        <span className="absolute left-1/2 top-1/2 h-[3px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-white" />
      </span>
    </span>
  );
}

/**
 * Drei-Spalten-Intro (Morpheon-artig): rundlaufender Markenring, Claim, Detailspalte.
 */
export function IntroSection() {
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y: 56,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
          delay: 0.12,
          clearProps: "transform,filter",
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative z-10 w-full bg-white text-neutral-950",
        "-mt-12 rounded-t-[2.25rem] sm:-mt-16 sm:rounded-t-[2.75rem] md:-mt-20 md:rounded-t-[3.25rem] lg:-mt-28 lg:rounded-t-[4rem]",
        "px-6 pb-20 pt-14 sm:px-10 sm:pt-16 md:px-14 md:pb-28 md:pt-20 lg:px-16 lg:pt-24",
      )}
      aria-labelledby="intro-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-0 xl:max-w-7xl xl:gap-x-16">
        <div className="flex justify-center lg:col-span-4 lg:justify-start">
          <IntroCircularMark />
        </div>

        <div className="lg:col-span-4">
          <h2
            id="intro-heading"
            className={cn(
              "sr-only",
            )}
          >
            Avelion Digital
          </h2>
          <p className={cn(bodyClass, "text-pretty text-neutral-700")}>
            Avelion Digital is a{" "}
            <span className="inline-flex items-center gap-1.5">
              <span className="font-semibold tracking-[-0.01em] text-[#D52B1E]">
                swiss
              </span>
              <span className="-ml-0.5">
                <SwissFlagMini />
              </span>
            </span>{" "}
            creative and technology company building apps, websites, brands and
            digital products for businesses and individuals who are ready to grow
            and stand out.
          </p>
        </div>

        <div className={cn(bodyClass, "space-y-6 text-pretty lg:col-span-4")}>
          <p>
            We deliver{" "}
            <strong className="font-semibold text-neutral-900">
              high-performance apps, conversion-driven websites and AI-powered
              marketing systems
            </strong>{" "}
            where quality, speed and measurable results are non-negotiable.
          </p>
          <p>
            Our work spans{" "}
            <strong className="font-semibold text-neutral-900">
              product development, e-commerce and brand building
            </strong>
            , engineered to scale from day one and built to outperform.
          </p>
        </div>
      </div>
    </section>
  );
}
