"use client";

import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

type ScrollSmoothLayoutProps = {
  children: React.ReactNode;
};

/**
 * Desktop: ScrollSmoother — weiches Transform-basiertes Scrollen.
 * Mobile:  ScrollSmoother komplett deaktiviert — nativer Browser-Scroll
 *          ist auf Touch bereits smooth und fühlt sich besser an.
 *          ScrollTrigger.normalizeScroll() stabilisiert die URL-Bar.
 */
export function ScrollSmoothLayout({ children }: ScrollSmoothLayoutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch        = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      /*
       * Mobile path — no ScrollSmoother.
       * The wrapper/content divs are plain block elements; native window
       * scroll works unhindered. ScrollTrigger pin/snap works correctly
       * with native scroll.
       *
       * normalizeScroll prevents the mobile URL-bar (which dynamically
       * resizes the viewport by ~56px) from causing position:fixed pinned
       * elements to jitter.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizer: any = !prefersReduced ? ScrollTrigger.normalizeScroll(true) : null;

      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(raf);
        normalizer?.kill?.();
      };
    }

    /*
     * Desktop path — full ScrollSmoother.
     * Cache the event object to avoid allocating a new Event() on every
     * scroll frame. RAF-flag prevents dispatching more than once per frame.
     */
    const scrollEvent  = new Event("avelion:scroll");
    let scrollPending  = false;

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: prefersReduced ? 0 : 1,
      ease:   prefersReduced ? undefined : "power2.out",
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
