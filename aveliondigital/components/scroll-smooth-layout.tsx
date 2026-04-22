"use client";

import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

type ScrollSmoothLayoutProps = {
  children: React.ReactNode;
};

/**
 * ScrollSmoother: weiches Scrollen über transformierten Content.
 * Header bleibt außerhalb (sibling), damit `position: fixed` zuverlässig bleibt.
 *
 * Auf Touch-Geräten wird ScrollSmoother komplett übersprungen:
 * – smoothTouch:0 machte es sowieso zum No-Op
 * – ScrollSmoother's wrapper/content-Transforms können GSAP pins auf Mobile stören
 * – Stattdessen: nativer Scroll + ScrollTrigger.normalizeScroll() verhindert
 *   URL-Bar-bedingte Viewport-Sprünge bei position:fixed Elementen
 */
export function ScrollSmoothLayout({ children }: ScrollSmoothLayoutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Detect touch/mobile — any coarse-pointer device (phone, tablet)
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      /*
       * Mobile path: no ScrollSmoother.
       * The wrapper/content divs are plain block elements — native window scroll
       * works normally. ScrollTrigger pins (position:fixed) work correctly here.
       *
       * normalizeScroll prevents the mobile browser URL-bar from causing
       * viewport-height jumps that make position:fixed pinned elements jitter.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizer: any = ScrollTrigger.normalizeScroll(true);

      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(raf);
        // normalizer is a Normalizer instance — kill it on cleanup
        normalizer?.kill?.();
      };
    }

    /*
     * Desktop path: full ScrollSmoother.
     * smooth: ~1.0 is a good balance between feel and responsiveness.
     * ease: power2.out reacts more directly than the default "expo".
     */
    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: prefersReduced ? 0 : 1,
      ease: prefersReduced ? undefined : "power2.out",
      smoothTouch: 0,
      effects: false,
      onUpdate: () => {
        window.dispatchEvent(new Event("avelion:scroll"));
      },
    });

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

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
