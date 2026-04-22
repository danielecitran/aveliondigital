"use client";

import { ScrollSmoother } from "gsap/ScrollSmoother";
import * as React from "react";

const SCROLL_EVT = "avelion:scroll";

/**
 * Returns the current visual scroll position, regardless of whether
 * GSAP ScrollSmoother is active or native scroll is used.
 *
 * - Desktop (ScrollSmoother active): smoother.scrollTop() gives the lerped
 *   position that matches what the user sees.
 * - Mobile / fallback:               window.scrollY.
 */
function getScrollY(): number {
  if (typeof window === "undefined") return 0;
  try {
    const smoother = ScrollSmoother.get();
    if (smoother) return smoother.scrollTop();
  } catch {
    /* ScrollSmoother not registered yet */
  }
  return window.scrollY;
}

/**
 * Returns true once the scroll position exceeds `threshold` pixels.
 * Listens to both the native `scroll` event (mobile / no ScrollSmoother)
 * and the custom `avelion:scroll` event dispatched by ScrollSmoother's onUpdate.
 */
export function useScroll(threshold: number): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      const next = getScrollY() > threshold;
      setScrolled((prev) => (prev === next ? prev : next));
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll",   update, { passive: true });
    window.addEventListener("resize",   update, { passive: true });
    window.addEventListener(SCROLL_EVT, update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll",   update);
      window.removeEventListener("resize",   update);
      window.removeEventListener(SCROLL_EVT, update);
    };
  }, [threshold]);

  return scrolled;
}
