import * as React from "react";

export function PortfolioSection() {
  return (
    <section
      aria-labelledby="portfolio-title"
      className="relative z-20 -mt-px bg-black text-white"
    >
      {/* Subtle depth + texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 52%)," +
            "radial-gradient(circle at 85% 35%, rgba(255,255,255,0.06), transparent 48%)," +
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 26px 26px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-24 lg:px-16 lg:pb-28 lg:pt-28">
        <p className="font-dm-sans-hero text-[10px] font-medium uppercase tracking-[0.35em] text-white/60 sm:text-[11px]">
          Portfolio
        </p>
        <h2
          id="portfolio-title"
          className="mt-3 font-playfair text-[clamp(2.25rem,4.6vw,4.25rem)] font-medium italic leading-[0.95] tracking-[-0.03em] text-white"
        >
          Portfolio Titel (Platzhalter)
        </h2>

        <div className="mt-8 max-w-2xl">
          <p className="font-dm-sans-hero text-[14px] leading-[1.85] text-white/70 sm:text-[15px] lg:text-base">
            Hier kommt später deine Portfolio-Logik rein. Für den Moment ist das
            nur ein Platzhalter-Block mit dem neuen schwarzen Look &amp; Wave-Übergang.
          </p>
        </div>

        {/* Placeholder grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.07] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)] transition hover:-translate-y-0.5 hover:bg-white/[0.11] hover:border-white/[0.18]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-dm-sans-hero text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">
                    Projekt
                  </p>
                  <p className="mt-2 font-dm-sans-hero text-base font-semibold tracking-[-0.02em] text-white">
                    Platzhalter #{String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition group-hover:bg-white/10">
                  →
                </span>
              </div>

              <div className="mt-5 h-[140px] rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-white/65">
                  Tag
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-white/65">
                  Tag
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-white/65">
                  Tag
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

