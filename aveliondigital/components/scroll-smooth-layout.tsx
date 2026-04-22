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

    /**
     * smooth: höher = spürbarer (Default GSAP ~0.8). ~1.0 ist ein guter Kompromiss.
     * ease: default wäre „expo“ — wirkt am Ende oft noch weich/zäh; power2.out reagiert direkter.
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
