import Link from "next/link";

import { cn } from "@/lib/utils";

import HeroWave from "@/components/dynamic-wave-canvas-background";

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-svh w-full items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeroWave />
      </div>
      <div
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
          className={cn(
            "font-dm-sans-hero mb-4 max-w-md text-[11px] font-medium uppercase tracking-[0.24em] text-white/65 sm:mb-5 sm:text-xs",
            "lg:max-w-none",
          )}
        >
          WE CREATE, SO YOU CAN GROW
        </p>

        <h1
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
          className={cn(
            "font-dm-sans-hero mb-8 max-w-xl text-[11px] font-normal leading-relaxed tracking-[0.14em] text-white/55 sm:mb-9 sm:text-xs sm:tracking-[0.15em] lg:mb-10",
          )}
        >
          Apps | Websites | Marketing &amp; Ads | E-Commerce
        </p>

        <Link
          href="#kontakt"
          className={cn(
            "font-dm-sans-hero group relative inline-flex max-w-full rounded-full",
            "border border-white/35 bg-white/[0.06] px-10 py-3.5 sm:px-12 sm:py-4",
            "text-[11px] font-semibold uppercase tracking-[0.26em] text-white/95 sm:text-xs sm:tracking-[0.28em]",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
            "transition-[box-shadow,background-color,color,border-color] duration-[580ms] ease-[cubic-bezier(0.33,1,0.68,1)]",
            "hover:border-white/85 hover:bg-white hover:text-neutral-950",
            "hover:shadow-[0_22px_56px_-20px_rgba(255,255,255,0.32),0_0_0_1px_rgba(255,255,255,0.14)_inset]",
            "active:duration-200",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90",
          )}
        >
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
