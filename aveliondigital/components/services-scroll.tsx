"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SERVICES = [
  {
    num: "01",
    title: ["App", "Development"],
    body: "We build high-performance mobile and web apps that are built to scale and designed to convert.",
    tags: ["Mobile", "Cross-platform"],
  },
  {
    num: "02",
    title: ["Web Design &", "Development"],
    body: "Custom websites that combine striking design with technical precision, optimised for speed and results.",
    tags: ["Design", "Development"],
  },
  {
    num: "03",
    title: ["Marketing", "& Ads"],
    body: "Marketing strategies and ad campaigns that drive traffic, generate leads and grow your revenue.",
    tags: ["Paid Ads", "SEO"],
  },
  {
    num: "04",
    title: ["E-Commerce"],
    body: "End-to-end e-commerce solutions built to sell, from storefront design to conversion optimisation.",
    tags: ["Shopify", "Optimisation"],
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

/** Ghost index behind the copy — keep it present, not competing. */
const NUM_OPACITY = 0.028;

/** Active tick is slightly thicker than the idle 2px / 3px track. */
const TICK_ACTIVE_SCALE_Y = 1.35;

/** Scroll progress 0→1 maps to (TOTAL−1) segments; 4 ticks split the last segment in half. */
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

const WAVE_PATH =
  "M0,86 C110,58 220,48 340,66 C460,84 545,132 690,130 C835,128 945,62 1085,56 C1225,50 1325,92 1440,76 L1440,170 L0,170 Z";

function WaveBottom({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 170"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={WAVE_PATH} fill="currentColor" />
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    currentIdxRef.current = 0;

    // ── Initial states ──────────────────────────────────────────────────────
    titleRefs.current.forEach((el, i) =>
      el && gsap.set(el, { yPercent: i === 0 ? 0 : 110 }),
    );
    descRefs.current.forEach((el, i) =>
      el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }),
    );
    numRefs.current.forEach((el, i) =>
      el && gsap.set(el, { opacity: i === 0 ? NUM_OPACITY : 0 }),
    );

    const activeTickRef = { current: 0 };
    const tickQuickTos: Array<((value: number) => void) | null> = [];

    tickTrackRefs.current.forEach((track, i) => {
      if (!track) return;
      gsap.set(track, {
        scaleX: 1,
        scaleY: i === 0 ? TICK_ACTIVE_SCALE_Y : 1,
        transformOrigin: "center center",
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
      if (from === to) return;

      const prevTrack = tickTrackRefs.current[from];
      if (prevTrack) {
        gsap.killTweensOf(prevTrack);
        gsap.to(prevTrack, {
          scaleY: 1,
          duration: reduced ? 0 : 0.28,
          ease: "power2.out",
        });
      }

      const nextTrack = tickTrackRefs.current[to];
      if (!nextTrack) return;

      gsap.killTweensOf(nextTrack);
      gsap.to(nextTrack, {
        scaleY: TICK_ACTIVE_SCALE_Y,
        duration: reduced ? 0 : 0.32,
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

    const serviceTlRef = { current: null as gsap.core.Timeline | null };

    // ── Animate between two service indices ─────────────────────────────────
    function animateToService(from: number, to: number) {
      if (from === to) return;

      const dir = to > from ? 1 : -1;

      serviceTlRef.current?.kill();

      titleRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el);
        if (i !== from && i !== to) {
          // Park skipped/stale titles fully off-screen so fast scrolling
          // cannot leave them mid-slide and overlapping.
          gsap.set(el, { yPercent: i < to ? -110 : 110, force3D: true });
        }
      });
      descRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el);
        if (i !== from && i !== to) gsap.set(el, { opacity: 0 });
      });
      numRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el);
        if (i !== from && i !== to) gsap.set(el, { opacity: 0 });
      });

      const tl = gsap.timeline();
      serviceTlRef.current = tl;

      tl.to(
        titleRefs.current[from],
        { yPercent: -110 * dir, duration: 0.52, ease: "power3.inOut", force3D: true, overwrite: true },
        0,
      );
      tl.set(titleRefs.current[to], { yPercent: 110 * dir, force3D: true }, 0);
      tl.to(
        titleRefs.current[to],
        { yPercent: 0, duration: 0.52, ease: "power3.inOut", force3D: true, overwrite: true },
        0,
      );

      tl.to(descRefs.current[from], { opacity: 0, duration: 0.2, overwrite: true }, 0);
      tl.to(descRefs.current[to],   { opacity: 1, duration: 0.28, overwrite: true }, 0.22);

      tl.to(numRefs.current[from], { opacity: 0,     duration: 0.28, overwrite: true }, 0);
      tl.to(numRefs.current[to],   { opacity: NUM_OPACITY, duration: 0.32, overwrite: true }, 0.16);
    }

    // ── ScrollTrigger: pin, free scroll (no snap) ────────────────────────────
    let cancelled = false;
    const ctx = gsap.context(() => {}, outer);

    // Child layout effects run before the parent ScrollSmoother is created.
    // Wait one frame so pinType / scrollerProxy are already in place.
    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      ctx.add(() => {
        ScrollTrigger.create({
          trigger: outer,
          start: "top top",
          end: () => `+=${(TOTAL - 1) * window.innerHeight}`,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
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
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      serviceTlRef.current?.kill();
      ctx.revert();
    };
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
        className="relative flex w-full flex-col overflow-x-hidden bg-neutral-100"
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
          {/* Caps the grey stage so a 1px pin/smoother gap never flashes neutral-100. */}
          <div
            className="absolute inset-x-0 bottom-0 h-6 bg-black"
            style={{ boxShadow: "0 16px 0 0 #000" }}
          />
          {/* Soft shadow as a blurred copy — SVG drop-shadow draws a Safari hairline. */}
          <WaveBottom className="absolute inset-x-0 bottom-0 h-[120%] w-full origin-bottom scale-y-110 opacity-25 blur-2xl" />
          <WaveBottom className="relative h-full w-full" />
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

            <div className="relative grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-center">

              {/* Title — centered in the left half */}
              <div className="relative overflow-x-visible overflow-y-hidden text-center will-change-transform lg:col-span-6">
                <div className="pointer-events-none select-none opacity-0" aria-hidden>
                  <h2 className="font-playfair font-medium italic" style={SERVICE_TITLE_STYLE}>
                    {LONGEST_TITLE.map((line, li) => (
                      <span key={li} className="block px-[0.05em]">{line}</span>
                    ))}
                  </h2>
                </div>

                {SERVICES.map((s, i) => (
                  <div
                    key={s.num}
                    ref={(el) => { titleRefs.current[i] = el; }}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                  >
                    <h2
                      className="font-playfair font-medium italic text-neutral-950"
                      style={SERVICE_TITLE_STYLE}
                    >
                      {s.title.map((line, li) => (
                        <span key={li} className="block px-[0.05em]">{line}</span>
                      ))}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Description — left edge matches the right rule below */}
              <div className="relative z-10 lg:col-span-5 lg:col-start-8">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.num}
                    ref={(el) => { descRefs.current[i] = el; }}
                    className={i > 0 ? "absolute inset-0 flex flex-col items-center justify-center lg:items-start" : "flex flex-col items-center justify-center lg:items-start"}
                  >
                    <p className="font-dm-sans-hero max-w-[22rem] text-center text-[14px] leading-[1.82] text-neutral-500 sm:text-[15px] lg:max-w-none lg:text-left lg:text-base">
                      {s.body}
                    </p>
                    <ul className="mt-5 flex flex-wrap justify-center gap-1.5 lg:justify-start">
                      {s.tags.map((tag) => (
                        <li
                          key={tag}
                          className="font-dm-sans-hero rounded-full border border-neutral-950/10 bg-white/50 px-3 py-[5px] text-[11px] tracking-[0.01em] text-neutral-500"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rule + ticks — right wing starts on the same column as the description */}
          <div className="relative mt-10 lg:mt-12">
            <div className="hidden grid-cols-12 items-center lg:grid" aria-hidden>
              <div className="col-span-6 h-px bg-gradient-to-r from-transparent to-neutral-300" />
              <div className="col-span-5 col-start-8 h-px bg-gradient-to-l from-transparent to-neutral-300" />
            </div>
            <div className="flex items-center gap-4 lg:absolute lg:inset-0 lg:justify-center lg:gap-0">
              <div
                className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent to-neutral-300 lg:hidden"
                aria-hidden
              />
              <div
                className="flex shrink-0 items-center gap-3 bg-neutral-100 px-4 sm:px-5"
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
              <div
                className="h-px min-w-0 flex-1 bg-gradient-to-l from-transparent to-neutral-300 lg:hidden"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
