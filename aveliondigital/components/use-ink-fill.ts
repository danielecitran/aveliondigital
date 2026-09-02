"use client";

import * as React from "react";
import gsap from "gsap";

/** Base circle size — scaled up to cover the button. Larger = less upscale blur. */
export const INK_FILL_SIZE = 64;

export function useInkFill() {
  const fillRef = React.useRef<HTMLSpanElement>(null);
  const xTo = React.useRef<((value: number) => gsap.core.Tween) | null>(null);
  const yTo = React.useRef<((value: number) => gsap.core.Tween) | null>(null);

  React.useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    gsap.set(fill, { x: 0, y: 0, scale: 0, force3D: true });
    xTo.current = gsap.quickTo(fill, "x", { duration: 0.14, ease: "power3.out" });
    yTo.current = gsap.quickTo(fill, "y", { duration: 0.14, ease: "power3.out" });

    return () => {
      gsap.killTweensOf(fill);
      xTo.current = null;
      yTo.current = null;
    };
  }, []);

  const pointFromEvent = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      cover: Math.hypot(r.width, r.height) / (INK_FILL_SIZE / 2),
    };
  };

  const onPointerMove = React.useCallback((e: React.PointerEvent<HTMLElement>) => {
    const { x, y } = pointFromEvent(e);
    xTo.current?.(x);
    yTo.current?.(y);
  }, []);

  const onPointerEnter = React.useCallback((e: React.PointerEvent<HTMLElement>) => {
    const fill = fillRef.current;
    if (!fill) return;
    const { x, y, cover } = pointFromEvent(e);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.killTweensOf(fill, "scale");
    gsap.set(fill, { x, y, scale: reduced ? cover : 0 });
    xTo.current?.(x);
    yTo.current?.(y);
    if (reduced) return;

    gsap.to(fill, {
      scale: cover,
      duration: 0.65,
      ease: "expo.out",
      overwrite: "auto",
      force3D: true,
    });
  }, []);

  const onPointerLeave = React.useCallback(() => {
    const fill = fillRef.current;
    if (!fill) return;
    gsap.killTweensOf(fill, "scale");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(fill, { scale: 0 });
      return;
    }
    gsap.to(fill, {
      scale: 0,
      duration: 0.42,
      ease: "power2.out",
      overwrite: "auto",
      force3D: true,
    });
  }, []);

  return { fillRef, onPointerMove, onPointerEnter, onPointerLeave };
}
