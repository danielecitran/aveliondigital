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
 * smoothTouch: 0.5 — aktiviert smooth scrolling auch auf Mobile/Touch.
 * Das ist entscheidend: mit smoothTouch:0 (No-Op) + normalizeScroll gab es einen
 * Konflikt. Mit aktivem smoothTouch koordiniert ScrollSmoother Pin + Scroll korrekt.
 *
 * normalizeScroll: true — verhindert, dass die mobile URL-Bar (die die Viewport-Höhe
 * dynamisch ändert) pinned position:fixed Elemente zum Zittern bringt.
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

    /*
     * Detect touch/mobile — coarse pointer = finger, fine pointer = mouse.
     * normalizeScroll is only needed on touch devices (prevents URL-bar
     * viewport-height jumps from shaking position:fixed pinned elements).
     * On desktop it intercepts mouse-wheel events and causes choppiness.
     */
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    /*
     * Cache the scroll event object — avoids allocating a new Event() on every
     * scroll frame (which is up to 60× per second while scrolling).
     * RAF-throttle prevents dispatching more than once per animation frame.
     */
    const scrollEvent = new Event("avelion:scroll");
    let scrollPending = false;

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: prefersReduced ? 0 : 1,
      ease: prefersReduced ? undefined : "power2.out",
      /*
       * smoothTouch > 0 keeps ScrollSmoother active on touch so that
       * pin:true and scroll-linked animations work correctly on mobile.
       */
      smoothTouch: prefersReduced ? 0 : 0.5,
      /*
       * normalizeScroll only on touch — prevents mobile URL-bar jumps.
       * Must NOT be enabled on desktop (breaks mouse-wheel smoothness).
       */
      normalizeScroll: isTouch && !prefersReduced,
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
