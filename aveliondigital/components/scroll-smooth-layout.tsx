"use client";

import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

import { resetPageScroll } from "@/lib/smooth-scroll";

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
  const pathname = usePathname();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    resetPageScroll();

    ScrollTrigger.config({ ignoreMobileResize: true });

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      const raf = requestAnimationFrame(() => {
        resetPageScroll();
        ScrollTrigger.refresh();
      });
      return () => {
        cancelAnimationFrame(raf);
        resetPageScroll();
      };
    }

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const scrollEvent = new Event("avelion:scroll");
    let scrollPending = false;

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: prefersReduced ? 0 : 0.8,
      ease: prefersReduced ? undefined : "power2.out",
      smoothTouch: 0,
      effects: false,
      // Intercepts wheel/trackpad so the document never elastic-overscrolls.
      // Do not set overscroll-behavior on #smooth-wrapper — that eats mouse-wheel.
      normalizeScroll: prefersReduced
        ? false
        : { debounce: false, allowNestedScroll: true },
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

    smoother.scrollTo(0, false);

    const raf = requestAnimationFrame(() => {
      resetPageScroll();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      smoother.kill();
      resetPageScroll();
    };
  }, [pathname]);

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content" className="w-full">
        {children}
      </div>
    </div>
  );
}
