"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";
import { INK_FILL_SIZE, useInkFill } from "@/components/use-ink-fill";

type Project = {
  id: string;
  index: string;
  category: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: readonly string[];
  icon: string;
  preview: { type: "video"; src: string } | { type: "image"; src: string; alt: string };
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const PROJECTS: readonly Project[] = [
  {
    id: "tradelens",
    index: "01",
    category: "iOS Application",
    year: "2026",
    title: "TradeLens",
    subtitle: "Chart Analysis",
    description:
      "An iOS app that turns any chart screenshot into a clear, AI-powered trading analysis. Built for traders who need institutional-grade insight in seconds.",
    tags: ["iOS", "AI Vision", "React Native"],
    icon: "/brand/tradelens-chart-analysis.png",
    preview: { type: "video", src: "/vid/mockup1.mp4" },
    primaryCta: {
      label: "View on Apple App Store",
      href: "https://apps.apple.com/app/id6753321240",
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// CTAs — ink-fill primary matches hero
// ────────────────────────────────────────────────────────────────────────────
function PrimaryCta({ href, label }: { href: string; label: string }) {
  const ink = useInkFill();
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      onPointerMove={ink.onPointerMove}
      onPointerEnter={ink.onPointerEnter}
      onPointerLeave={ink.onPointerLeave}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full",
        "bg-white/[0.05] px-7 py-3.5",
        "border border-white/20",
        "font-dm-sans-hero text-[11px] font-semibold uppercase tracking-[0.26em] text-white",
        "transition-colors duration-500 ease-out",
        "hover:border-white/55 hover:text-neutral-950",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90",
      )}
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
// Cinematic preview stage
// ────────────────────────────────────────────────────────────────────────────
function ProjectPreview({
  project,
  paused,
}: {
  project: Project;
  paused: boolean;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || project.preview.type !== "video") return;
    if (paused) {
      v.pause();
    } else {
      v.play().catch(() => undefined);
    }
  }, [paused, project.preview]);

  return (
    <div className="relative mx-auto flex w-full max-w-[52rem] justify-center">
      <div className="relative inline-block max-w-full">
        {/*
         * Nur ein hauchdünner Kanten-Glow — negativer Spread, kein Rechteck-Halo.
         */}
        <div
          className="overflow-hidden rounded-[1.25rem] sm:rounded-[1.4rem]"
          style={{
            boxShadow: "0 0 20px -13px rgba(59,130,246,0.28)",
          }}
        >
          {project.preview.type === "video" ? (
            <video
              ref={videoRef}
              className="block h-auto max-h-[min(68vh,560px)] w-auto max-w-full"
              src={project.preview.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={`${project.title} product preview`}
            />
          ) : (
            <Image
              src={project.preview.src}
              alt={project.preview.alt}
              width={1200}
              height={800}
              className="block h-auto max-h-[min(68vh,560px)] w-auto max-w-full object-contain"
            />
          )}
        </div>

        {/* floating app icon */}
        <div
          className={cn(
            "absolute -bottom-3 -right-2 z-10 size-[4.25rem] overflow-hidden rounded-[1.15rem] sm:-bottom-4 sm:-right-3 sm:size-[4.75rem]",
            "ring-1 ring-white/12",
            "shadow-[0_28px_56px_-14px_rgba(0,0,0,0.75)]",
          )}
        >
          <Image
            src={project.icon}
            alt={project.title}
            fill
            className="object-cover"
            sizes="76px"
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Single project showcase — stacked vertically when multiple exist
// ────────────────────────────────────────────────────────────────────────────
function ProjectShowcase({
  project,
  position,
  isLast,
}: {
  project: Project;
  position: number;
  isLast: boolean;
}) {
  const articleRef = React.useRef<HTMLElement>(null);
  const metaRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const indexRef = React.useRef<HTMLSpanElement>(null);

  const [previewPaused, setPreviewPaused] = React.useState(true);
  const reversed = position % 2 === 1;

  React.useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduced) {
      if (indexRef.current) {
        gsap.set(indexRef.current, { opacity: 1 });
      }
      setPreviewPaused(false);
      return;
    }

    const ctx = gsap.context(() => {
      const revealTargets = [
        metaRef.current,
        titleRef.current,
        bodyRef.current,
        previewRef.current,
      ].filter(Boolean) as Element[];

      gsap.set(revealTargets, { opacity: 0, y: 32 });
      gsap.set(indexRef.current, { opacity: 0, x: reversed ? 24 : -24 });
      gsap.set(previewRef.current, { scale: 0.96 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: article,
            start: "top 82%",
            once: true,
          },
          onComplete: () => setPreviewPaused(false),
        })
        .to(indexRef.current, {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power3.out",
        })
        .to(
          metaRef.current,
          { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
          0.08,
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            filter: "blur(0px)",
          },
          0.14,
        )
        .to(
          bodyRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.22,
        )
        .to(
          previewRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          },
          0.12,
        );

      ScrollTrigger.create({
        trigger: article,
        start: "top 90%",
        end: "bottom 10%",
        onEnter: () => setPreviewPaused(false),
        onLeave: () => setPreviewPaused(true),
        onEnterBack: () => setPreviewPaused(false),
        onLeaveBack: () => setPreviewPaused(true),
      });
    }, article);

    return () => ctx.revert();
  }, [reversed]);

  return (
    <article
      ref={articleRef}
      aria-labelledby={`project-${project.id}-title`}
      className={cn(
        "relative overflow-visible",
        !isLast && "pb-24 sm:pb-28 lg:pb-36",
      )}
    >
      <div
        className={cn(
          "relative z-[1] grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-x-10 xl:gap-x-14",
          reversed && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        )}
      >
        {/* copy column — block centered in the half, type left-aligned */}
        <div className="relative z-10 flex justify-center">
          <div className="relative w-full max-w-[32rem] text-center lg:text-left">
            <span
              ref={indexRef}
              className={cn(
                "pointer-events-none absolute z-0 w-max max-w-none select-none whitespace-nowrap font-playfair font-medium italic",
                "left-1/2 -translate-x-1/2 lg:translate-x-0",
                reversed ? "lg:left-auto lg:right-[-2%]" : "lg:left-[-2%]",
                "-top-4 sm:-top-6",
              )}
              style={{
                fontSize: "clamp(7rem, 18vw, 22rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: "#fff",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.075) 0%, rgba(0,0,0,0.075) 44%, transparent 86%)",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.075) 0%, rgba(0,0,0,0.075) 44%, transparent 86%)",
              }}
              aria-hidden
            >
              {project.index}
            </span>

            <div className="relative z-[1]">
              <div ref={metaRef} className="flex items-stretch justify-center gap-3.5 lg:justify-start">
                <span
                  className="w-px shrink-0 bg-gradient-to-b from-white/0 via-white/45 to-white/0"
                  aria-hidden
                />
                <div>
                  <p className="font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.35em] text-white/50 sm:text-[11px]">
                    {project.category}
                  </p>
                  <p className="mt-1 font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
                    {project.year}
                  </p>
                </div>
              </div>

              <div ref={titleRef} className="mt-8 sm:mt-10">
                <h3
                  id={`project-${project.id}-title`}
                  className="hero-display font-semibold leading-[0.98] tracking-[-0.03em] text-white"
                  style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.5rem)" }}
                >
                  {project.title}
                </h3>
                <p
                  className="mt-3 font-dm-sans-hero font-medium tracking-[-0.02em] text-white/55"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.35rem)" }}
                >
                  {project.subtitle}
                </p>
              </div>

              <div ref={bodyRef}>
                <p className="mt-7 font-dm-sans-hero text-[14px] leading-[1.88] text-white/62 sm:mt-8 sm:text-[15px] lg:text-base">
                  {project.description}
                </p>

                <ul className="mt-7 flex flex-wrap justify-center gap-2 sm:mt-8 lg:justify-start">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="font-dm-sans-hero rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55 sm:text-[11px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:mt-10 lg:justify-start">
                  <PrimaryCta
                    href={project.primaryCta.href}
                    label={project.primaryCta.label}
                  />
                  {project.secondaryCta && project.secondaryCta.href !== "#" ? (
                    <SecondaryCta
                      href={project.secondaryCta.href}
                      label={project.secondaryCta.label}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* preview column */}
        <div ref={previewRef} className="relative flex items-center justify-center">
          <ProjectPreview project={project} paused={previewPaused} />
        </div>
      </div>

      {!isLast ? (
        <div className="relative mt-24 h-px w-full sm:mt-28 lg:mt-36">
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent"
            style={{ width: "min(100%, 56rem)" }}
          />
        </div>
      ) : null}
    </article>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main section
// ────────────────────────────────────────────────────────────────────────────
export function PortfolioSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced || !headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
        y: 40,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        ease: "power3.out",
        clearProps: "filter",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-labelledby="portfolio-title"
      className="relative z-20 -mt-3 scroll-mt-[5.5rem] overflow-x-clip bg-[#050508] text-white"
    >
      {/* top fade from services wave */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent sm:h-32"
        aria-hidden
      />

      {/* atmospheric background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 6%, rgba(255,255,255,0.07), transparent 48%)," +
            "radial-gradient(circle at 88% 28%, rgba(255,255,255,0.05), transparent 44%)," +
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 28px 28px",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-28 pt-24 sm:px-10 sm:pb-32 sm:pt-28 lg:px-16 lg:pb-36 lg:pt-32">
        {/* header */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <p className="font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.35em] text-white/55 sm:text-[11px]">
            Portfolio
          </p>
          <h2
            id="portfolio-title"
            className="mt-4 font-playfair font-medium leading-[0.95] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.35rem, 5vw, 4.5rem)" }}
          >
            Selected Work
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-dm-sans-hero text-[14px] leading-[1.85] text-white/55 sm:text-[15px]">
            End-to-end digital products.
            <br />
            Designed, built and shipped with the
            same precision as the rest of our work.
          </p>
          <div className="mx-auto mt-6 h-px w-10 rounded-full bg-white/20" />
        </div>

        {/* vertical project stack */}
        <div className="relative mt-20 overflow-visible sm:mt-24 lg:mt-28">
          {PROJECTS.map((project, i) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              position={i}
              isLast={i === PROJECTS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
