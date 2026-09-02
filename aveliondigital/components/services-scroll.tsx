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

const SERVICE_TITLE_STYLE = {
  fontSize: "clamp(2.15rem, 4.2vw, 5.5rem)",
  lineHeight: 1.04,
  letterSpacing: "-0.03em",
} as const;

const SERVICE_NUM_STYLE = {
  fontSize: "clamp(8.5rem, 19vw, 25rem)",
  letterSpacing: "-0.04em",
  lineHeight: 0.92,
} as const;

/** Scroll progress 0→1 maps to (TOTAL−1) snap segments; 4 ticks split the last segment in half. */
function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getScrollScaled(progress: number) {
  return progress * (TOTAL - 1);
}

function getServiceIndex(progress: number) {
  if (progress >= 1) return TOTAL - 1;
  const scaled = getScrollScaled(progress);
  if (scaled < 1) return 0;
  if (scaled < 2) return 1;
  if (scaled < 2.5) return 2;
  return TOTAL - 1;
}

function getTickFill(tickIndex: number, progress: number) {
  const scaled = getScrollScaled(progress);
  if (tickIndex < TOTAL - 2) {
    return clamp01(scaled - tickIndex);
  }
  if (tickIndex === TOTAL - 2) {
    return clamp01((scaled - 2) * 2);
  }
  return clamp01((scaled - 2.5) * 2);
}

function getActiveTickIndex(progress: number) {
  for (let i = 0; i < TOTAL; i++) {
    if (getTickFill(i, progress) < 0.999) return i;
  }
  return TOTAL - 1;
}

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
  const descRefs  = React.useRef<(HTMLDivElement | null)[]>([]);
  const numRefs   = React.useRef<(HTMLSpanElement | null)[]>([]);
  const tickFillRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const tickTrackRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const currentIdxRef = React.useRef(0);

  React.useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /*
     * On mobile, GSAP snap animates window.scrollTo() which conflicts with the
     * browser's own touch-momentum scroll — causing the "fight" that makes scroll
     * feel janky. Disable snap on touch devices and let the user scroll freely;
     * content still transitions at the midpoint via onUpdate.
     */
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

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

    const activeTickRef = { current: 0 };
    const handoffTlRef = { current: null as gsap.core.Timeline | null };
    const tickQuickTos: Array<((value: number) => void) | null> = [];

    tickTrackRefs.current.forEach((track) => {
      if (!track) return;
      gsap.set(track, {
        scale: 1,
        y: 0,
        transformOrigin: "left center",
        force3D: true,
      });
    });

    tickFillRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        scaleX: getTickFill(i, 0),
        force3D: true,
        transformOrigin: "left center",
      });
      if (!reduced) {
        tickQuickTos[i] = gsap.quickTo(el, "scaleX", {
          duration: 0.2,
          ease: "power1.out",
        });
      }
    });

    function animateTickHandoff(from: number, to: number) {
      if (reduced || from === to) return;

      handoffTlRef.current?.kill();

      const prevTrack = tickTrackRefs.current[from];
      if (prevTrack) {
        gsap.killTweensOf(prevTrack);
        gsap.set(prevTrack, { scale: 1, y: 0 });
      }

      const nextTrack = tickTrackRefs.current[to];
      if (!nextTrack) return;

      gsap.killTweensOf(nextTrack);
      gsap.set(nextTrack, { scale: 1, y: 0, transformOrigin: "left center" });

      handoffTlRef.current = gsap
        .timeline()
        .to(nextTrack, {
          scale: 1.07,
          y: -1.5,
          duration: 0.2,
          ease: "power1.out",
        })
        .to(nextTrack, {
          scale: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
        });
    }

    function updateTickProgress(progress: number) {
      const active = getActiveTickIndex(progress);
      if (active !== activeTickRef.current) {
        animateTickHandoff(activeTickRef.current, active);
        activeTickRef.current = active;
      }

      tickFillRefs.current.forEach((el, i) => {
        if (!el) return;
        const fill = getTickFill(i, progress);
        if (reduced) {
          gsap.set(el, { scaleX: fill, force3D: true });
          return;
        }
        tickQuickTos[i]?.(fill);
      });
    }

    updateTickProgress(0);

    // ── Animate between two service indices ─────────────────────────────────
    function animateToService(from: number, to: number) {
      if (from === to) return;

      const dir = to > from ? 1 : -1;

      [
        ...titleRefs.current,
        ...descRefs.current,
        ...numRefs.current,
      ].forEach((el) => el && gsap.killTweensOf(el));

      const tl = gsap.timeline();

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

      tl.to(descRefs.current[from], { opacity: 0, duration: 0.2 }, 0);
      tl.to(descRefs.current[to],   { opacity: 1, duration: 0.28 }, 0.22);

      tl.to(numRefs.current[from], { opacity: 0,     duration: 0.28 }, 0);
      tl.to(numRefs.current[to],   { opacity: 0.055, duration: 0.32 }, 0.16);

    }

    // ── ScrollTrigger: pin + snap ────────────────────────────────────────────
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: () => `+=${(TOTAL - 1) * window.innerHeight}`,
        pin: stage,
        pinSpacing: true,
        /*
         * Snap only on desktop. On mobile, snap fights touch-momentum scroll
         * (browser and GSAP both try to control scroll position simultaneously)
         * which causes the jittery/stuck feeling. Native touch scroll is smooth
         * and the content transitions correctly via onUpdate midpoint detection.
         */
        snap: isMobile ? undefined : {
          snapTo: 1 / (TOTAL - 1),
          duration: { min: 0.3, max: 0.45 },
          ease: "power3.inOut",
          delay: 0.05,
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateTickProgress(self.progress);
          if (reduced) return;
          const newIdx = getServiceIndex(self.progress);
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
    <div
      ref={outerRef}
      id="services"
      className="scroll-mt-[5.5rem] bg-neutral-100"
      aria-label="Our services"
    >
      <div
        ref={stageRef}
        className="relative flex w-full flex-col overflow-hidden bg-neutral-100 will-change-transform"
        style={{ height: "100svh" }}
      >
        {/* ── Decorative background ────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 select-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 4% 8%, rgba(0,0,0,0.028) 0%, transparent 100%), " +
              "radial-gradient(ellipse 55% 48% at 96% 92%, rgba(0,0,0,0.022) 0%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[24%] select-none"
          aria-hidden
          style={{ background: "linear-gradient(to bottom, #ffffff 0%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 select-none text-black sm:h-28"
          aria-hidden
        >
          <WaveBottom className="h-full w-full drop-shadow-[0_-10px_30px_rgba(0,0,0,0.18)]" />
        </div>

        {/* ── Section header ──────────────────────────────────────────────── */}
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
          <div className="mx-auto mt-5 h-px w-10 rounded-full bg-neutral-200" />
        </div>

        {/* ── Max-width content wrapper ────────────────────────────────────── */}
        <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-0 sm:px-10 lg:px-16 lg:pb-[6vh]">

          {/* Content band — number + title/description share one vertical axis */}
          <div className="relative py-2 sm:py-4 lg:py-6">
            <div
              className="pointer-events-none absolute inset-0 select-none overflow-x-clip"
              aria-hidden
            >
              {SERVICES.map((s, i) => (
                <span
                  key={s.num}
                  ref={(el) => { numRefs.current[i] = el; }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 will-change-[opacity] font-playfair font-medium italic text-neutral-950 lg:right-[-0.5%]"
                  style={SERVICE_NUM_STYLE}
                >
                  {s.num}
                </span>
              ))}
            </div>

            <div className="relative grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-7 xl:gap-x-9">

              {/* Title column — overflow-y clips slide animation */}
              <div className="relative overflow-x-visible overflow-y-hidden will-change-transform lg:col-span-7">
                <div className="pointer-events-none select-none opacity-0" aria-hidden>
                  <h2 className="font-playfair font-medium italic" style={SERVICE_TITLE_STYLE}>
                    {LONGEST_TITLE.map((line, li) => (
                      <span key={li} className="block pr-[0.05em]">{line}</span>
                    ))}
                  </h2>
                </div>

                {SERVICES.map((s, i) => (
                  <div
                    key={s.num}
                    ref={(el) => { titleRefs.current[i] = el; }}
                    className="absolute inset-0 flex items-center will-change-transform"
                  >
                    <h2
                      className="font-playfair font-medium italic text-neutral-950"
                      style={SERVICE_TITLE_STYLE}
                    >
                      {s.title.map((line, li) => (
                        <span key={li} className="block pr-[0.05em]">{line}</span>
                      ))}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Description column — sits above the background number */}
              <div className="relative z-10 lg:col-span-5">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.num}
                    ref={(el) => { descRefs.current[i] = el; }}
                    className={i > 0 ? "absolute inset-0 flex flex-col justify-center" : "flex flex-col justify-center"}
                  >
                    <p className="font-dm-sans-hero max-w-[22rem] text-[14px] leading-[1.82] text-neutral-500 sm:text-[15px] lg:max-w-none lg:text-base">
                      {s.body}
                    </p>
                    <p className="font-dm-sans-hero mt-4 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 sm:text-[11px]">
                      {s.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="relative mt-10 h-px w-full lg:mt-12">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neutral-300 to-transparent"
              style={{ width: "clamp(12rem, 38%, 48rem)" }}
            />
          </div>

          {/* Scroll progress — one segment per service, fills smoothly toward the next */}
          <div
            className="mt-8 flex items-center gap-3 lg:mt-10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOTAL}
            aria-label="Service scroll progress"
          >
            {SERVICES.map((_, di) => (
              <span
                key={di}
                ref={(el) => { tickTrackRefs.current[di] = el; }}
                className="relative inline-block h-[2px] w-11 origin-left will-change-transform sm:h-[3px] sm:w-12"
              >
                <span
                  className="absolute inset-0 rounded-full bg-neutral-400/80"
                  aria-hidden
                />
                <span
                  ref={(el) => { tickFillRefs.current[di] = el; }}
                  className="absolute inset-0 origin-left rounded-full bg-neutral-900 will-change-transform"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
