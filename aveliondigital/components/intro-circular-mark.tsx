"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";

const LOGO_SRC = "/brand/aveliondigital_intro_mark.svg";

/** Etwas schneller als zuvor — weiterhin sehr ruhig. */
const RING_ROTATION_SEC = 78;

/**
 * Ein Umlauf: AVELION + Wortabstand + DIGITAL + gleich großer „Wrap“-Abstand
 * (leerer Slot) vor dem erneuten A — sonst klemmt L↔A, während N↔D den Space hat.
 */
function buildRingSlots(): (string | null)[] {
  return [...("AVELION".split("")), " ", ...("DIGITAL".split("")), null];
}

const VB = 400;
const CX = VB / 2;
const CY = VB / 2;

/** Stabile SVG-Strings für SSR/Client (sonst Hydration-Mismatch bei Float-Kosinus). */
function rSvg(n: number, decimals = 3): string {
  const f = 10 ** decimals;
  return String(Math.round(n * f) / f);
}

const logoMaskStyle: React.CSSProperties = {
  WebkitMaskImage: `url(${LOGO_SRC})`,
  maskImage: `url(${LOGO_SRC})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  /** Schwarze Glyphen bleiben sichtbar; Luminanz-Maske würde Schwarz als „Loch“ interpretieren. */
  maskType: "alpha",
};

export function IntroCircularMark() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const ringWrapRef = React.useRef<HTMLDivElement>(null);

  const slots = React.useMemo(() => buildRingSlots(), []);
  const n = slots.length;

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const ring = ringWrapRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced && ring) {
        gsap.set(ring, { transformOrigin: "50% 50%" });
        gsap.to(ring, {
          rotation: 360,
          duration: RING_ROTATION_SEC,
          ease: "none",
          repeat: -1,
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto aspect-square w-full max-w-[min(88vw,320px)] sm:max-w-[340px] lg:mx-0 lg:max-w-[360px]"
    >
      <div
        ref={ringWrapRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <svg className="size-full" viewBox={`0 0 ${VB} ${VB}`}>
          <g transform={`translate(${CX},${CY})`}>
            {slots.map((ch, i) => {
              if (ch === null) {
                return null;
              }

              const angle =
                -Math.PI / 2 + (i + 0.5) * ((2 * Math.PI) / n);
              const r = 148;
              const x = r * Math.cos(angle);
              const y = r * Math.sin(angle);
              const deg = (angle * 180) / Math.PI + 90;
              const xs = rSvg(x);
              const ys = rSvg(y);
              const degs = rSvg(deg, 2);

              return (
                <text
                  key={i}
                  x={xs}
                  y={ys}
                  className="fill-neutral-900 font-dm-sans-hero select-none"
                  fontSize={28}
                  fontWeight={700}
                  letterSpacing="0.02em"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${degs}, ${xs}, ${ys})`}
                >
                  {ch === " " ? "\u00A0" : ch}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="absolute inset-[20%] flex items-center justify-center sm:inset-[21%]">
        <div
          className="relative isolate flex size-full max-h-[8.75rem] max-w-[8.75rem] items-center justify-center overflow-hidden sm:max-h-[9.5rem] sm:max-w-[9.5rem]"
          style={logoMaskStyle}
        >
          <Image
            src={LOGO_SRC}
            alt="Avelion Digital"
            width={1500}
            height={1500}
            className="relative z-[1] size-full object-contain"
            unoptimized
          />
          <div
            className="avelion-intro-logo-sheen motion-reduce:hidden"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
