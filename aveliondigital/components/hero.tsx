 "use client";

 import * as React from "react";
 import gsap from "gsap";

import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/smooth-scroll";
import { INK_FILL_SIZE, useInkFill } from "@/components/use-ink-fill";

import HeroWave from "@/components/dynamic-wave-canvas-background";

export function Hero() {
   const rootRef = React.useRef<HTMLElement>(null);
   const kickerRef = React.useRef<HTMLDivElement>(null);
   const titleRef = React.useRef<HTMLHeadingElement>(null);
   const subRef = React.useRef<HTMLParagraphElement>(null);
   const ctaRef = React.useRef<HTMLAnchorElement>(null);
   const washRef = React.useRef<HTMLDivElement>(null);
  const ink = useInkFill();

   React.useLayoutEffect(() => {
     const root = rootRef.current;
     if (!root) return;

     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
       return;
     }

     const ctx = gsap.context(() => {
       const titleLines = titleRef.current
         ? Array.from(titleRef.current.querySelectorAll("span"))
         : [];

       const kickerAccent =
         kickerRef.current?.querySelector("[data-hero-kicker-accent]") ?? null;
       const kickerLines = kickerRef.current
         ? Array.from(kickerRef.current.querySelectorAll("[data-hero-kicker-line]"))
         : [];

       const animatedEls = [
         kickerAccent,
         ...kickerLines,
         ...titleLines,
         subRef.current,
         ctaRef.current,
       ].filter((el): el is Element => Boolean(el));

       /*
        * will-change promotes elements to GPU composite layers for the duration
        * of the entry animation. Clear it afterward so they don't permanently
        * consume GPU memory.
        */
       gsap.set(animatedEls, { willChange: "transform, opacity, filter" });

       gsap.fromTo(
         washRef.current,
         { opacity: 0 },
         { opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.05 },
       );

       const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

       if (kickerAccent) {
         intro.fromTo(
           kickerAccent,
           { scaleY: 0, opacity: 0 },
           {
             scaleY: 1,
             opacity: 1,
             duration: 0.55,
             ease: "power2.out",
             transformOrigin: "top center",
           },
           0,
         );
       }

       intro
         .fromTo(
           kickerLines,
           { opacity: 0, y: 8, filter: "blur(5px)" },
           {
             opacity: 1,
             y: 0,
             filter: "blur(0px)",
             duration: 0.62,
             stagger: 0.07,
           },
           0.05,
         )
         .fromTo(
           titleLines.length ? titleLines : titleRef.current,
           { opacity: 0, y: 16, filter: "blur(10px)" },
           {
             opacity: 1,
             y: 0,
             filter: "blur(0px)",
             duration: 0.85,
             stagger: 0.08,
           },
           0.08,
         )
         .fromTo(
           subRef.current,
           { opacity: 0, y: 10, filter: "blur(6px)" },
           { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
           0.28,
         )
         .fromTo(
           ctaRef.current,
           { opacity: 0, y: 10, scale: 0.985, filter: "blur(4px)" },
           { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.75 },
           0.42,
         )
         // Release GPU layers once the entry animation is complete.
         .call(() => gsap.set(animatedEls, { clearProps: "willChange" }));
     }, root);

     return () => ctx.revert();
   }, []);

  return (
    <section
       ref={rootRef}
      className="relative isolate flex min-h-svh w-full items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeroWave />
      </div>
     <div
       ref={washRef}
       className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/68"
       aria-hidden
     />
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-5xl px-6 py-24 sm:px-10 sm:py-28 lg:px-14 lg:py-32",
          "flex flex-col items-start text-left",
        )}
      >
       <div
         ref={kickerRef}
          className="mb-6 flex max-w-md items-stretch gap-3.5 sm:mb-7 lg:max-w-none"
          aria-label="Tagline"
        >
          <span
            data-hero-kicker-accent
            className="w-px shrink-0 bg-gradient-to-b from-white/0 via-white/55 to-white/0"
            aria-hidden
          />
          <div className="flex flex-col gap-1 text-left">
            <span
              data-hero-kicker-line
              className="hero-display text-[0.8125rem] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[0.9375rem]"
            >
              We create
            </span>
            <span
              data-hero-kicker-line
              className="hero-display text-[0.8125rem] font-normal italic leading-snug tracking-[-0.02em] text-white/48 sm:text-[0.9375rem]"
            >
              so you can grow
            </span>
          </div>
        </div>

       <h1
         ref={titleRef}
          id="hero-heading"
          className={cn(
            "hero-display mb-3 text-[clamp(2.5rem,4.5vw+1rem,4.75rem)] font-extrabold leading-[1.0] tracking-[-0.04em] text-white",
            "drop-shadow-[0_2px_32px_rgba(0,0,0,0.45)]",
          )}
        >
          <span className="hero-display block font-extrabold sm:whitespace-nowrap">
            Premium creative &amp;
          </span>
          <span className="hero-display mt-1 block font-extrabold sm:mt-1.5">
            tech agency
          </span>
        </h1>

       <p
         ref={subRef}
          className={cn(
            "font-dm-sans-hero mb-8 max-w-xl text-[11px] font-normal leading-relaxed tracking-[0.14em] text-white/55 sm:mb-9 sm:text-xs sm:tracking-[0.15em] lg:mb-10",
          )}
        >
          Apps | Websites | Marketing &amp; Ads | E-Commerce
        </p>

       <a
         ref={ctaRef}
          href="#contact"
          className={cn(
            "font-dm-sans-hero group relative mx-auto inline-flex max-w-full rounded-full lg:mx-0",
            "bg-white/[0.05] px-10 py-3.5 sm:px-12 sm:py-4",
            "border border-white/20",
            "text-[11px] font-semibold uppercase tracking-[0.26em] text-white/95 sm:text-xs sm:tracking-[0.28em]",
            "overflow-hidden",
            "transition-colors duration-500 ease-out",
            "hover:border-white/55 hover:text-neutral-950",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90",
          )}
          onPointerMove={ink.onPointerMove}
          onPointerEnter={ink.onPointerEnter}
          onPointerLeave={ink.onPointerLeave}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("contact");
          }}
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
          <span className="relative z-10 truncate">LET&apos;S TALK</span>
        </a>
      </div>
    </section>
  );
}
