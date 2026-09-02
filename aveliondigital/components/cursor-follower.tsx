"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

type Point = { x: number; y: number };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="submit"]):not([type="button"]),textarea,select,[data-cursor-hide]';

const CLICKABLE_SELECTOR =
  'a,button,[role="button"],[role="link"],input[type="checkbox"],input[type="submit"],input[type="button"]';

export function CursorFollowerHost() {
  const pathname = usePathname();
  if (pathname.startsWith("/tradelens")) return null;
  return <CursorFollower />;
}

export function CursorFollower() {
  const reducedMotion = usePrefersReducedMotion();

  const dotRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);

  const target = React.useRef<Point>({ x: -9999, y: -9999 });
  const current = React.useRef<Point>({ x: -9999, y: -9999 });
  const visible = React.useRef(false);
  const suppressed = React.useRef(false);
  const clickable = React.useRef(false);
  const lastVisible = React.useRef<boolean | null>(null);
  const lastClickable = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const ease = reducedMotion ? "none" : "180ms cubic-bezier(0.22, 1, 0.36, 1)";
    dot.style.transition = `opacity ${ease}`;
    if (scaleRef.current) {
      scaleRef.current.style.transition = reducedMotion
        ? "none"
        : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1)";
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      const d = dotRef.current;
      if (!d) return;

      const speed = reducedMotion ? 1 : 0.18;
      current.current.x = lerp(current.current.x, target.current.x, speed);
      current.current.y = lerp(current.current.y, target.current.y, speed);

      d.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      if (lastVisible.current !== visible.current) {
        d.style.opacity = visible.current ? "1" : "0";
        lastVisible.current = visible.current;
      }
      if (lastClickable.current !== clickable.current) {
        const inner = scaleRef.current;
        if (inner) {
          inner.style.transform = clickable.current ? "scale(2.15)" : "scale(1)";
          inner.style.boxShadow = clickable.current
            ? "0 0 0 1.5px rgba(59,130,246,0.45), 0 12px 28px -14px rgba(59,130,246,0.9)"
            : "0 10px 30px -18px rgba(59,130,246,0.9), 0 0 0 1px rgba(255,255,255,0.12) inset";
        }
        lastClickable.current = clickable.current;
      }

      rafRef.current = window.requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      visible.current = !suppressed.current;
    };

    const onLeave = () => {
      visible.current = false;
      clickable.current = false;
    };

    const setFromTarget = (el: Element | null) => {
      if (!el) {
        suppressed.current = false;
        clickable.current = false;
        return;
      }
      if (el.closest(TEXT_SELECTOR)) {
        suppressed.current = true;
        clickable.current = false;
        visible.current = false;
        return;
      }
      suppressed.current = false;
      clickable.current = Boolean(el.closest(CLICKABLE_SELECTOR));
      visible.current = true;
    };

    const onPointerOver = (e: PointerEvent) => {
      setFromTarget(e.target as Element | null);
    };

    const onPointerOut = (e: PointerEvent) => {
      const to = (e.relatedTarget as Element | null) ?? null;
      if (!to) {
        clickable.current = false;
        return;
      }
      setFromTarget(to);
    };

    const onSelectionChange = () => {
      const sel = window.getSelection();
      const hasSelection = Boolean(sel && sel.type === "Range" && sel.toString().trim().length);
      if (hasSelection) {
        suppressed.current = true;
        visible.current = false;
        clickable.current = false;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    rafRef.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <div
        ref={scaleRef}
        className="h-3 w-3 rounded-full"
        style={{
          background: "#3B82F6",
          boxShadow:
            "0 10px 30px -18px rgba(59,130,246,0.9), 0 0 0 1px rgba(255,255,255,0.12) inset",
          willChange: "transform, box-shadow",
        }}
      />
    </div>
  );
}
