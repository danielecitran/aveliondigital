"use client";

import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

type Props = { children: React.ReactNode };

/**
 * Desktop: GSAP ScrollSmoother — premium lerp-based smooth scroll.
 *   smooth: 0.8  → spürbar smooth, aber weniger Lag-Akkumulation als 1.0.
 *                  Auf schwächerer Hardware kaum merklich, auf gutem Hardware premium.
 *
 * Mobile: kein ScrollSmoother. Nativer Scroll läuft auf dem Compositor-Thread
 *   (kein JS involviert) — fühlt sich auf Touch bereits perfekt smooth an.
 */
export function ScrollSmoothLayout({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch        = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      // Mobile: wrapper/content divs are plain block elements.
      // Native window scroll + ScrollTrigger pin/snap work perfectly.
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    }

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // Cached event object — reused each frame instead of allocating a new one.
    const scrollEvent = new Event("avelion:scroll");
    let scrollPending = false;

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      /*
       * 0.8 is the sweet spot: still feels distinctly smooth (the "GSAP feel"
       * the user wants), but half the lag accumulation of the original 1.0.
       * With the canvas now in a Web Worker the main thread has enough headroom
       * to consistently hit 60 fps even on mid-range laptops.
       */
      smooth: prefersReduced ? 0 : 0.8,
      ease: prefersReduced ? undefined : "power2.out",
      smoothTouch: 0,
      effects: false,
      onUpdate: () => {
        if (!scrollPending) {
          scrollPending = true;
          requestAnimationFrame(() => {
            window.dispatchEvent(scrollEvent);
            scrollPending = false;
          });
        }
      },
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      smoother.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content" className="w-full">
        {children}
      </div>
    </div>
  );
}
