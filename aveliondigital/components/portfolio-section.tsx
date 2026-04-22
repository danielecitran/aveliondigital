"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

type Project = {
  id: "tradelens" | "quizgpt";
  category: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: readonly string[];
  icon: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const PROJECTS: readonly Project[] = [
  {
    id: "tradelens",
    category: "iOS Application",
    year: "2026",
    title: "TradeLens",
    subtitle: "Chart Analysis",
    description:
      "A native iOS app that turns any chart screenshot into a clear, AI-powered trading analysis. Built for traders who need institutional-grade insight in seconds — not hours.",
    tags: ["iOS Native", "AI Vision", "SwiftUI", "Fintech"],
    icon: "/brand/tradelens-chart-analysis.png",
    primaryCta: {
      label: "View on App Store",
      href: "https://apps.apple.com/app/id6753321240",
    },
    secondaryCta: { label: "Read case study", href: "#" },
  },
  {
    id: "quizgpt",
    category: "Chrome Extension",
    year: "2025",
    title: "QuizGPT",
    subtitle: "Kahoot Auto Answer",
    description:
      "The most advanced Kahoot assistant on the market. An AI-powered browser extension that reads questions in real-time and delivers the correct answer — already used by thousands of students worldwide.",
    tags: ["Chrome Extension", "AI", "Real-time", "EdTech"],
    icon: "/brand/QuizGPT.png",
    primaryCta: { label: "Visit quizgpt.site", href: "https://quizgpt.site/" },
    secondaryCta: { label: "Read case study", href: "#" },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Ink-fill primary CTA — matches hero styling
// ────────────────────────────────────────────────────────────────────────────
function PrimaryCta({ href, label }: { href: string; label: string }) {
  const fillRef = React.useRef<HTMLSpanElement>(null);
  const isExternal = href.startsWith("http");

  const animateFill = React.useCallback((r: number) => {
    const fill = fillRef.current;
    if (!fill) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.killTweensOf(fill);
    gsap.to(fill, {
      duration: r === 0 ? 0.7 : 0.95,
      ease: r === 0 ? "power2.out" : "expo.out",
      overwrite: true,
      "--r": `${r}px`,
    } as gsap.TweenVars);
  }, []);

  const updateCoords = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      onPointerMove={updateCoords}
      onPointerEnter={(e) => {
        updateCoords(e);
        const r = e.currentTarget.getBoundingClientRect();
        const maxR = Math.hypot(r.width, r.height);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(fillRef.current, { "--r": `${maxR}px` } as gsap.TweenVars);
          return;
        }
        if (fillRef.current) {
          gsap.killTweensOf(fillRef.current);
          gsap.set(fillRef.current, { "--r": "0px" } as gsap.TweenVars);
        }
        animateFill(maxR);
      }}
      onPointerLeave={() => animateFill(0)}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full",
        "bg-white/[0.05] px-7 py-3.5 ring-1 ring-inset ring-white/20",
        "font-dm-sans-hero text-[11px] font-semibold uppercase tracking-[0.26em] text-white",
        "shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_-1px_0_rgba(0,0,0,0.18)_inset]",
        "transition-[color,box-shadow] duration-[580ms] ease-[cubic-bezier(0.33,1,0.68,1)]",
        "hover:text-neutral-950 hover:ring-white/55",
        "hover:shadow-[0_22px_56px_-20px_rgba(255,255,255,0.32),0_0_0_1px_rgba(255,255,255,0.14)_inset]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90",
      )}
      style={
        {
          ["--mx" as never]: "50%",
          ["--my" as never]: "50%",
        } as React.CSSProperties
      }
    >
      <span
        ref={fillRef}
        className="pointer-events-none absolute inset-0 rounded-full"
        aria-hidden
        style={{
          background: "white",
          clipPath: "circle(var(--r, 0px) at var(--mx, 50%) var(--my, 50%))",
        }}
      />
      <span className="relative z-10">{label}</span>
      <svg
        className="relative z-10 size-3.5 transition-transform duration-500 group-hover:translate-x-0.5"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function SecondaryCta({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(
        "group inline-flex items-center gap-2 font-dm-sans-hero",
        "text-[11px] font-semibold uppercase tracking-[0.26em] text-white/70",
        "transition-colors hover:text-white",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 focus-visible:rounded-sm",
      )}
    >
      <span className="relative">
        {label}
        <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-white/60 transition-transform duration-[520ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-x-100" />
      </span>
      <svg
        className="size-3 transition-transform duration-500 group-hover:translate-x-0.5"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TradeLens preview — raw mockup video + floating app icon
// ────────────────────────────────────────────────────────────────────────────
function TradeLensPreview({ paused }: { paused: boolean }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) {
      v.pause();
    } else {
      v.play().catch(() => {
        /* autoplay is muted; rare to be blocked */
      });
    }
  }, [paused]);

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* soft glow behind the device */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 scale-[1.15] blur-2xl"
        aria-hidden
        style={{
          background:
            "radial-gradient(55% 55% at 50% 50%, rgba(255,255,255,0.14), transparent 70%)",
        }}
      />

      <video
        ref={videoRef}
        className="block h-auto max-h-[640px] w-auto max-w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
        src="/vid/mockup1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* Floating app-icon — alone, no text */}
      <div
        className={cn(
          "absolute -bottom-2 right-2 size-[72px] overflow-hidden rounded-[1.35rem] sm:-bottom-3 sm:right-3 sm:size-[80px]",
          "ring-1 ring-white/15",
          "shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        )}
      >
        <Image
          src="/brand/tradelens-chart-analysis.png"
          alt="TradeLens"
          fill
          className="object-cover"
          sizes="80px"
          priority
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// QuizGPT preview — minimal Chrome-extension popup
// ────────────────────────────────────────────────────────────────────────────
function QuizGPTPreview() {
  return (
    <div className="relative mx-auto w-[min(84vw,380px)] sm:w-[380px] lg:w-[400px]">
      {/* glow */}
      <div
        className="pointer-events-none absolute -inset-[14%] -z-10 rounded-full"
        aria-hidden
        style={{
          background:
            "radial-gradient(55% 55% at 50% 40%, rgba(229,57,53,0.18), transparent 70%)",
        }}
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.4rem] bg-[#0b0b0f]",
          "border border-white/10",
          "shadow-[0_50px_100px_-28px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        )}
      >
        {/* Top bar */}
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <div className="ml-3 flex-1 rounded-full bg-white/[0.04] px-3 py-1 ring-1 ring-inset ring-white/[0.04]">
            <p className="font-dm-sans-hero truncate text-[10px] tracking-[0.04em] text-white/45">
              chrome-extension://quizgpt
            </p>
          </div>
        </div>

        {/* Body — minimal splash */}
        <div className="relative flex flex-col items-center px-7 pb-9 pt-11 sm:px-8 sm:pt-12">
          <div className="relative size-[76px] overflow-hidden rounded-[1.35rem] ring-1 ring-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]">
            <Image
              src="/brand/QuizGPT.png"
              alt=""
              fill
              className="object-cover"
              sizes="76px"
            />
          </div>

          <p className="mt-6 font-dm-sans-hero text-xl font-semibold tracking-[-0.015em] text-white">
            QuizGPT
          </p>
          <p className="mt-1.5 font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.28em] text-white/45">
            Kahoot Auto Answer
          </p>

          <div className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-neutral-950">
            <svg
              className="size-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path
                d="M4 3l9 5-9 5V3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-dm-sans-hero text-[11px] font-semibold uppercase tracking-[0.24em]">
              Start auto-answer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main section
// ────────────────────────────────────────────────────────────────────────────
export function PortfolioSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const selectorRef = React.useRef<HTMLDivElement>(null);

  const infoRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const previewRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const floatRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const tabTickRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const [active, setActive] = React.useState(0);
  const lastActive = React.useRef(0);

  // ─── Initial states + scroll-in reveal + idle float ────────────────────────
  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    infoRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 18 });
    });
    previewRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        opacity: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 18,
        scale: i === 0 ? 1 : 0.985,
      });
    });
    tabTickRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        width: i === 0 ? 44 : 14,
        backgroundColor:
          i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)",
      });
    });

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(
        [
          headerRef.current,
          selectorRef.current,
          previewRefs.current[0],
          infoRefs.current[0],
        ].filter(Boolean) as Element[],
        {
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
          y: 36,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.08,
        },
      );

      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        // TradeLens (index 0) shows a real mockup video — keep it rock-steady.
        if (PROJECTS[i]?.id === "tradelens") return;
        gsap.to(el, {
          y: i % 2 === 0 ? "+=10" : "+=8",
          duration: 4.2 + i * 0.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ─── Switch animation ─────────────────────────────────────────────────────
  const animateTo = React.useCallback((to: number) => {
    const from = lastActive.current;
    if (from === to) return;
    lastActive.current = to;
    setActive(to);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      infoRefs.current.forEach((el, i) =>
        el ? gsap.set(el, { opacity: i === to ? 1 : 0 }) : undefined,
      );
      previewRefs.current.forEach((el, i) =>
        el ? gsap.set(el, { opacity: i === to ? 1 : 0 }) : undefined,
      );
      tabTickRefs.current.forEach((el, i) =>
        el
          ? gsap.set(el, {
              width: i === to ? 44 : 14,
              backgroundColor:
                i === to
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.22)",
            })
          : undefined,
      );
      return;
    }

    const targets = [
      ...infoRefs.current,
      ...previewRefs.current,
      ...tabTickRefs.current,
    ];
    targets.forEach((el) => el && gsap.killTweensOf(el));

    const tl = gsap.timeline();

    tl.to(
      [infoRefs.current[from], previewRefs.current[from]].filter(
        Boolean,
      ) as Element[],
      { opacity: 0, y: -14, duration: 0.36, ease: "power2.inOut" },
      0,
    );

    tl.fromTo(
      [infoRefs.current[to], previewRefs.current[to]].filter(
        Boolean,
      ) as Element[],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
      },
      0.26,
    );

    tabTickRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(
        el,
        {
          width: i === to ? 44 : 14,
          backgroundColor:
            i === to ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)",
          duration: 0.36,
          ease: "power3.out",
        },
        0.05,
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="portfolio-title"
      className="relative z-20 -mt-px overflow-hidden bg-black text-white"
    >
      {/* background grain + radial washes */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 8%, rgba(255,255,255,0.08), transparent 52%)," +
            "radial-gradient(circle at 86% 42%, rgba(255,255,255,0.06), transparent 48%)," +
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 26px 26px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(0,0,0,0.9), transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-24 pt-20 sm:px-10 sm:pb-28 sm:pt-24 lg:px-16 lg:pb-32 lg:pt-28">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl">
          <p className="font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.35em] text-white/60 sm:text-[11px]">
            Portfolio
          </p>
          <h2
            id="portfolio-title"
            className="mt-3 font-playfair text-[clamp(2.25rem,4.6vw,4.25rem)] font-medium italic leading-[0.95] tracking-[-0.03em] text-white"
          >
            Selected Work
          </h2>
          <p className="mt-5 max-w-xl font-dm-sans-hero text-[14px] leading-[1.85] text-white/60 sm:text-[15px]">
            A small, focused list — each project shipped end-to-end, built to
            perform in the real world.
          </p>
        </div>

        {/* Project selector — moved above the stage */}
        <div
          ref={selectorRef}
          className="mt-12 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 lg:gap-5"
        >
          {PROJECTS.map((p, i) => {
            const isActive = active === i;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => animateTo(i)}
                aria-pressed={isActive}
                aria-label={`Show ${p.title} — ${p.category}`}
                className={cn(
                  "group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-left",
                  "border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm",
                  "transition-[border-color,background-color,transform] duration-[420ms] ease-[cubic-bezier(0.33,1,0.68,1)]",
                  "hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.05]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60",
                  isActive && "border-white/25 bg-white/[0.05]",
                )}
              >
                <span
                  ref={(el) => {
                    tabTickRefs.current[i] = el;
                  }}
                  className="block h-px shrink-0 rounded-full"
                  style={{
                    width: 14,
                    backgroundColor: "rgba(255,255,255,0.22)",
                  }}
                  aria-hidden
                />

                <div className="relative size-10 shrink-0 overflow-hidden rounded-[0.85rem] ring-1 ring-white/10">
                  <Image
                    src={p.icon}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-dm-sans-hero text-[9px] font-medium uppercase tracking-[0.3em] text-white/45">
                    {p.category}
                  </p>
                  <p className="mt-1 truncate font-dm-sans-hero text-[14px] font-semibold tracking-[-0.01em] text-white">
                    {p.title}
                    <span className="ml-2 font-normal text-white/45">
                      {p.subtitle}
                    </span>
                  </p>
                </div>

                <span
                  className={cn(
                    "ml-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full",
                    "border border-white/10 bg-white/[0.03] text-white/70",
                    "transition-[background-color,color,border-color,transform] duration-[420ms] ease-[cubic-bezier(0.33,1,0.68,1)]",
                    "group-hover:bg-white/10 group-hover:text-white",
                    isActive &&
                      "border-white/40 bg-white text-neutral-950 group-hover:bg-white",
                  )}
                  aria-hidden
                >
                  <svg
                    className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="relative mt-14 h-px w-full lg:mt-16">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/20 to-transparent"
            style={{ width: "clamp(12rem, 38%, 48rem)" }}
          />
        </div>

        {/* Stage */}
        <div className="relative mt-14 grid grid-cols-1 items-start gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
          {/* Info column */}
          <div className="relative order-2 lg:order-1 lg:col-span-5">
            <div className="relative min-h-[340px] sm:min-h-[380px] lg:min-h-[440px]">
              {PROJECTS.map((p, i) => {
                const isActive = active === i;
                return (
                  <div
                    key={p.id}
                    ref={(el) => {
                      infoRefs.current[i] = el;
                    }}
                    className={cn(
                      "will-change-transform",
                      i === 0 ? "relative" : "absolute inset-0",
                      !isActive && "pointer-events-none",
                    )}
                    aria-hidden={!isActive}
                  >
                    <p className="font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.35em] text-white/55 sm:text-[11px]">
                      {p.category}
                      <span className="mx-3 text-white/20">/</span>
                      {p.year}
                    </p>

                    <h3 className="mt-5 font-dm-sans-hero text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-dm-sans-hero text-[clamp(1rem,1.4vw,1.3rem)] font-medium tracking-[-0.01em] text-white/65">
                      {p.subtitle}
                    </p>

                    <p className="mt-7 max-w-[30rem] font-dm-sans-hero text-[14px] leading-[1.85] text-white/65 sm:text-[15px] lg:text-base">
                      {p.description}
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <li
                          key={t}
                          className="font-dm-sans-hero rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1 text-[11px] tracking-[0.02em] text-white/65"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <PrimaryCta
                        href={p.primaryCta.href}
                        label={p.primaryCta.label}
                      />
                      <SecondaryCta
                        href={p.secondaryCta.href}
                        label={p.secondaryCta.label}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview column */}
          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <div className="relative flex min-h-[480px] items-center justify-center py-8 sm:min-h-[540px] lg:min-h-[620px]">
              {PROJECTS.map((p, i) => {
                const isActive = active === i;
                return (
                  <div
                    key={p.id}
                    ref={(el) => {
                      previewRefs.current[i] = el;
                    }}
                    className={cn(
                      "flex items-center justify-center will-change-transform",
                      i === 0 ? "relative" : "absolute inset-0",
                      !isActive && "pointer-events-none",
                    )}
                    aria-hidden={!isActive}
                  >
                    <div
                      ref={(el) => {
                        floatRefs.current[i] = el;
                      }}
                      className="will-change-transform"
                    >
                      {p.id === "tradelens" ? (
                        <TradeLensPreview paused={!isActive} />
                      ) : (
                        <QuizGPTPreview />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
