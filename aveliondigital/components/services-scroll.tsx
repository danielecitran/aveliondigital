"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SERVICES = [
  {
    num: "01",
    title: ["App", "Development"],
    body: "We build high-performance mobile and web apps that are built to scale and designed to convert.",
    hint: "Mobile · Web · Cross-platform",
  },
  {
    num: "02",
    title: ["Web Design &", "Development"],
    body: "Custom websites that combine striking design with technical precision, optimised for speed and results.",
    hint: "Design · Development · CMS",
  },
  {
    num: "03",
    title: ["Marketing", "& Ads"],
    body: "AI-powered marketing strategies and ad campaigns that drive traffic, generate leads and grow your revenue.",
    hint: "Paid Ads · SEO · AI Strategy",
  },
  {
    num: "04",
    title: ["E-Commerce"],
    body: "End-to-end e-commerce solutions built to sell, from storefront design to conversion optimisation.",
    hint: "Shopify · Conversions · Scale",
  },
] as const;

const TOTAL = SERVICES.length;

// Longest title lines — used by the invisible spacer to size the overflow:hidden wrapper.
const LONGEST_TITLE = ["Web Design &", "Development"] as const;

function WaveBottom({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 170"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0,86
           C110,58 220,48 340,66
           C460,84 545,132 690,130
           C835,128 945,62 1085,56
           C1225,50 1325,92 1440,76
           L1440,170 L0,170 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ServicesScroll() {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);

  const titleRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const tickRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  // Tracks the index of the currently visible service (no React state → no re-renders)
  const currentIdxRef = React.useRef(0);

  React.useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Initial states ──────────────────────────────────────────────────────
    titleRefs.current.forEach((el, i) =>
      el && gsap.set(el, { yPercent: i === 0 ? 0 : 110 }),
    );
    descRefs.current.forEach((el, i) =>
      el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }),
    );
    numRefs.current.forEach((el, i) =>
      el && gsap.set(el, { opacity: i === 0 ? 0.055 : 0 }),
    );
    tickRefs.current.forEach((el, i) =>
      el &&
      gsap.set(el, {
        width: i === 0 ? 36 : 16,
        backgroundColor: i === 0 ? "rgb(23 23 23)" : "rgb(212 212 212)",
      }),
    );

    // ── Animate between two service indices ─────────────────────────────────
    function animateToService(from: number, to: number) {
      if (from === to) return;

      const dir = to > from ? 1 : -1;

      // Kill any in-flight tweens on these elements first
      [
        ...titleRefs.current,
        ...descRefs.current,
        ...numRefs.current,
        ...tickRefs.current,
      ].forEach((el) => el && gsap.killTweensOf(el));

      const tl = gsap.timeline();

      /*
       * Both titles use the SAME easing (power3.inOut) and start at the same
       * time. With a symmetric inOut easing, the gap between them is constant
       * at ~10% throughout — they never touch or overlap.
       *
       * Using power3.in (exit) + power3.out (enter) caused the bug: the entering
       * title accelerated while the exiting barely moved, creating a large overlap.
       */
      tl.to(
        titleRefs.current[from],
        { yPercent: -110 * dir, duration: 0.52, ease: "power3.inOut", force3D: true },
        0,
      );
      tl.set(titleRefs.current[to], { yPercent: 110 * dir, force3D: true }, 0);
      tl.to(
        titleRefs.current[to],
        { yPercent: 0, duration: 0.52, ease: "power3.inOut", force3D: true },
        0,
      );

      // Description: fade out → fade in
      tl.to(descRefs.current[from], { opacity: 0, duration: 0.2 }, 0);
      tl.to(descRefs.current[to],   { opacity: 1, duration: 0.28 }, 0.22);

      // Background number: crossfade
      tl.to(numRefs.current[from], { opacity: 0,     duration: 0.28 }, 0);
      tl.to(numRefs.current[to],   { opacity: 0.055, duration: 0.32 }, 0.16);

      // Progress ticks
      tickRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(
          el,
          {
            width: i === to ? 36 : 16,
            backgroundColor: i === to ? "rgb(23 23 23)" : "rgb(212 212 212)",
            duration: 0.28,
          },
          0.08,
        );
      });
    }

    // ── ScrollTrigger: pin + snap + onUpdate threshold trigger ──────────────
    //
    // No scrub — content never shows a mid-transition state while scrolling.
    // onUpdate fires on every scroll tick. When Math.round(progress*(N-1))
    // changes, the user has crossed the midpoint between two services and the
    // switch is forced immediately. Snap then stabilises the scroll position.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: () => `+=${(TOTAL - 1) * window.innerHeight}`,
        pin: stage,
        pinSpacing: true,
        snap: {
          snapTo: 1 / (TOTAL - 1),
          duration: { min: 0.3, max: 0.45 },
          ease: "power3.inOut",
          delay: 0.05,
        },
        invalidateOnRefresh: true,
        onUpdate: reduced
          ? undefined
          : (self) => {
              const newIdx = Math.round(self.progress * (TOTAL - 1));
              if (newIdx !== currentIdxRef.current) {
                animateToService(currentIdxRef.current, newIdx);
                currentIdxRef.current = newIdx;
              }
            },
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    /*
     * relative z-10 matches IntroSection's stacking level so the dark
     * parent background (bg-[#050508]) never shows through as a grey
     * border — even during ScrollSmoother's transform-based scrolling.
     */
    <div ref={outerRef} className="bg-neutral-100" aria-label="Our services">
      <div
        ref={stageRef}
        className="relative flex h-screen w-full flex-col overflow-hidden bg-neutral-100 will-change-transform"
      >
        {/* ── Decorative background layer ─────────────────────────────────── */}

        {/* Fine dot grid — adds tactile texture without competing with content */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Corner gradient washes — soft depth, completely neutral */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 4% 8%, rgba(0,0,0,0.028) 0%, transparent 100%), " +
              "radial-gradient(ellipse 55% 48% at 96% 92%, rgba(0,0,0,0.022) 0%, transparent 100%)",
          }}
        />

        {/* Top fade — blends dot grid smoothly into the plain white intro section */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[24%] select-none"
          aria-hidden
          style={{
            background: "linear-gradient(to bottom, #ffffff 0%, transparent 100%)",
          }}
        />

        {/* Bottom wave — always visible while the section is pinned */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 select-none text-black sm:h-28"
          aria-hidden
        >
          {/* Soft shadow into the white stage */}
          <WaveBottom className="h-full w-full drop-shadow-[0_-10px_30px_rgba(0,0,0,0.18)]" />
        </div>

        {/* ── Section header — positioned in the top quarter of the stage ── */}
        <div className="relative shrink-0 px-6 pb-4 pt-[18vh] text-center sm:px-10 lg:px-16">
          <p className="font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-400 sm:text-[11px]">
            Our services
          </p>
          <p
            className="font-dm-sans-hero mx-auto mt-2.5 font-semibold tracking-[-0.025em] text-neutral-950"
            style={{ fontSize: "clamp(1.1rem, 1.75vw, 1.85rem)" }}
          >
            Your long-term digital partner
          </p>
          {/* Thin accent rule below header */}
          <div className="mx-auto mt-5 h-px w-10 rounded-full bg-neutral-200" />
        </div>

        {/* ── Max-width content wrapper — fills remaining height ── */}
        <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-0 sm:px-10 lg:px-16 lg:pb-[8vh]">

          {/*
           * Background numbers — positioned to sit BEHIND the description
           * column text. DOM order (before the grid) ensures the grid paints
           * on top without explicit z-index.
           */}
          <div
            className="pointer-events-none absolute inset-0 select-none overflow-hidden"
            aria-hidden
          >
            {SERVICES.map((s, i) => (
              <span
                key={s.num}
                ref={(el) => { numRefs.current[i] = el; }}
                className="absolute right-0 top-[38%] -translate-y-1/2 will-change-[opacity] font-playfair font-medium italic leading-none text-neutral-950 lg:top-[36%]"
                style={{
                  fontSize: "clamp(10rem, 28vw, 34rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                {s.num}
              </span>
            ))}
          </div>

          {/* ── 12-col editorial grid ── */}
          <div className="relative grid grid-cols-1 items-end gap-y-8 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">

            {/* Title column — 7/12, overflow:hidden clips the slide */}
            <div className="relative overflow-hidden will-change-transform lg:col-span-7">
              {/* Ghost spacer: renders longest title invisibly to set wrapper height */}
              <div className="pointer-events-none select-none opacity-0" aria-hidden>
                <h2
                  className="font-playfair font-medium italic leading-[0.93] tracking-[-0.035em]"
                  style={{ fontSize: "clamp(2.8rem, 6.5vw, 8rem)" }}
                >
                  {LONGEST_TITLE.map((line, li) => (
                    <span key={li} className="block">{line}</span>
                  ))}
                </h2>
              </div>

              {/* All service titles — absolute, GSAP animates yPercent */}
              {SERVICES.map((s, i) => (
                <div
                  key={s.num}
                  ref={(el) => { titleRefs.current[i] = el; }}
                  className="absolute inset-0 flex items-end will-change-transform"
                >
                  <h2
                    className="font-playfair font-medium italic leading-[0.93] tracking-[-0.035em] text-neutral-950"
                    style={{ fontSize: "clamp(2.8rem, 6.5vw, 8rem)" }}
                  >
                    {s.title.map((line, li) => (
                      <span key={li} className="block">{line}</span>
                    ))}
                  </h2>
                </div>
              ))}
            </div>

            {/* Description column — 5/12 */}
            <div className="relative lg:col-span-5 lg:pb-[0.4em]">
              {SERVICES.map((s, i) => (
                <div
                  key={s.num}
                  ref={(el) => { descRefs.current[i] = el; }}
                  className={i > 0 ? "absolute inset-0" : undefined}
                >
                  <p className="font-dm-sans-hero text-[14px] leading-[1.82] text-neutral-500 sm:text-[15px] lg:text-base">
                    {s.body}
                  </p>
                  <p className="font-dm-sans-hero mt-4 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 sm:text-[11px]">
                    {s.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="relative mt-10 h-px w-full lg:mt-12">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neutral-300 to-transparent"
              style={{ width: "clamp(12rem, 38%, 48rem)" }}
            />
          </div>

          {/* Progress ticks */}
          <div className="mt-8 flex items-center gap-2.5 lg:mt-10">
            {SERVICES.map((_, di) => (
              <span
                key={di}
                ref={(el) => { tickRefs.current[di] = el; }}
                className="block h-px rounded-full"
                style={{ width: 16, backgroundColor: "rgb(212 212 212)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
