 "use client";

 import * as React from "react";
import Link from "next/link";
 import gsap from "gsap";

import { cn } from "@/lib/utils";

import HeroWave from "@/components/dynamic-wave-canvas-background";

export function Hero() {
   const rootRef = React.useRef<HTMLElement>(null);
   const kickerRef = React.useRef<HTMLParagraphElement>(null);
   const titleRef = React.useRef<HTMLHeadingElement>(null);
   const subRef = React.useRef<HTMLParagraphElement>(null);
   const ctaRef = React.useRef<HTMLAnchorElement>(null);
   const washRef = React.useRef<HTMLDivElement>(null);
  const ctaFillRef = React.useRef<HTMLSpanElement>(null);

  const onCtaPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x.toFixed(2)}%`);
      el.style.setProperty("--my", `${y.toFixed(2)}%`);
    },
    [],
  );

  const animateCtaFillTo = React.useCallback((radius: number) => {
    const fill = ctaFillRef.current;
    if (!fill) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.killTweensOf(fill);
    gsap.to(fill, {
      // langsamer + weicher = premium (kein „snap“)
      duration: radius === 0 ? 0.8 : 1.05,
      ease: radius === 0 ? "power2.out" : "expo.out",
      overwrite: true,
      "--r": `${radius}px`,
    } as gsap.TweenVars);
  }, []);

  const onCtaPointerEnter = React.useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x.toFixed(2)}%`);
      el.style.setProperty("--my", `${y.toFixed(2)}%`);

      const maxR = Math.hypot(r.width, r.height);
      // Start klein am Cursorpunkt, dann expand.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(ctaFillRef.current, { "--r": `${maxR}px` } as gsap.TweenVars);
      } else {
        // Reset erzwingen (auch wenn gerade ein Leave-Tween läuft),
        // damit der Fill immer am neuen Punkt sauber „neu startet“.
        if (ctaFillRef.current) {
          gsap.killTweensOf(ctaFillRef.current);
          gsap.set(ctaFillRef.current, { "--r": "0px" } as gsap.TweenVars);
        }
        animateCtaFillTo(maxR);
      }
    },
    [animateCtaFillTo],
  );

  const onCtaPointerLeave = React.useCallback(() => {
    if (ctaFillRef.current) {
      gsap.killTweensOf(ctaFillRef.current);
    }
    animateCtaFillTo(0);
  }, [animateCtaFillTo]);

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

       const animatedEls = [kickerRef.current, ...titleLines, subRef.current, ctaRef.current];

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

       gsap
         .timeline({ defaults: { ease: "power3.out" } })
         .fromTo(
           kickerRef.current,
           { opacity: 0, y: 10, filter: "blur(6px)" },
           { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65 },
           0,
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
          "flex flex-col items-center text-center lg:items-start lg:text-left",
        )}
      >
       <p
         ref={kickerRef}
          className={cn(
            "font-dm-sans-hero mb-4 max-w-md text-[11px] font-medium uppercase tracking-[0.24em] text-white/65 sm:mb-5 sm:text-xs",
            "lg:max-w-none",
          )}
        >
          WE CREATE, SO YOU CAN GROW
        </p>

       <h1
         ref={titleRef}
          id="hero-heading"
          className={cn(
            "hero-display mb-3 text-[clamp(2.4rem,4vw+1rem,4.25rem)] font-medium italic leading-[1.05] tracking-[-0.03em] text-white",
            "drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]",
          )}
        >
          <span className="hero-display block font-medium sm:whitespace-nowrap">
            Premium creative &amp;
          </span>
          <span className="hero-display mt-1 block font-medium sm:mt-1.5">
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

       <Link
         ref={ctaRef}
          href="#kontakt"
          className={cn(
            "font-dm-sans-hero group relative inline-flex max-w-full rounded-full",
            // modern idle: softer ring + inset highlight (statt „harte“ Border)
            "bg-white/[0.05] px-10 py-3.5 sm:px-12 sm:py-4",
            "ring-1 ring-inset ring-white/20",
            "text-[11px] font-semibold uppercase tracking-[0.26em] text-white/95 sm:text-xs sm:tracking-[0.28em]",
            "shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_-1px_0_rgba(0,0,0,0.18)_inset]",
            "overflow-hidden",
            "transition-[box-shadow,color,border-color] duration-[580ms] ease-[cubic-bezier(0.33,1,0.68,1)]",
            "hover:ring-white/55 hover:text-neutral-950",
            "hover:shadow-[0_22px_56px_-20px_rgba(255,255,255,0.32),0_0_0_1px_rgba(255,255,255,0.14)_inset]",
            "active:duration-200",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90",
          )}
          style={
            {
              ["--mx" as never]: "50%",
              ["--my" as never]: "50%",
            } as React.CSSProperties
          }
          onPointerMove={onCtaPointerMove}
          onPointerEnter={onCtaPointerEnter}
          onPointerLeave={onCtaPointerLeave}
        >
          <span
            ref={ctaFillRef}
            className="pointer-events-none absolute inset-0 rounded-full"
            aria-hidden
            style={{
              background: "white",
              clipPath: "circle(var(--r, 0px) at var(--mx, 50%) var(--my, 50%))",
            }}
          />
          <span
            className="hero-cta-ripple pointer-events-none absolute inset-0 rounded-full"
            aria-hidden
          />
          <span className="relative z-10 truncate">LET&apos;S TALK</span>
        </Link>
      </div>
    </section>
  );
}
