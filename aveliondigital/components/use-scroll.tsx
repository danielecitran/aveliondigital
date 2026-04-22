"use client";

import { ScrollSmoother } from "gsap/ScrollSmoother";
import * as React from "react";

const SCROLL_EVT = "avelion:scroll";

function getScrollY() {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    return smoother.scrollTop();
  }
  return typeof window !== "undefined" ? window.scrollY : 0;
}

export function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      setScrolled((prev) => {
        const next = getScrollY() > threshold;
        return prev === next ? prev : next;
      });
    };

    const id = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener(SCROLL_EVT, update);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener(SCROLL_EVT, update);
    };
  }, [threshold]);

  return scrolled;
}
