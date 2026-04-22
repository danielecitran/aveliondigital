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

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: prefersReduced ? 0 : 1,
      ease: prefersReduced ? undefined : "power2.out",
      /*
       * smoothTouch:0.5 gibt Mobile ein spürbares Smooth-Scroll-Gefühl.
       * Wert < 1 damit es sich nicht träge anfühlt, > 0 damit ScrollSmoother
       * aktiv ist und pin:true / normalizeScroll korrekt zusammenarbeiten.
       */
      smoothTouch: prefersReduced ? 0 : 0.5,
      /*
       * normalizeScroll:true funktioniert korrekt wenn smoothTouch > 0 gesetzt ist.
       * Verhindert Viewport-Sprünge durch die mobile URL-Bar (zeigt/versteckt sich
       * beim Scrollen und ändert die Viewport-Höhe um ~56px).
       */
      normalizeScroll: !prefersReduced,
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
