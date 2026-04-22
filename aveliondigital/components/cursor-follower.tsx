 "use client";

import * as React from "react";

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

export function CursorFollower() {
  const reducedMotion = usePrefersReducedMotion();

  const dotRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);

  const target = React.useRef<Point>({ x: -9999, y: -9999 });
  const current = React.useRef<Point>({ x: -9999, y: -9999 });
  const visible = React.useRef(false);
  const suppressed = React.useRef(false);
  const lastVisible = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Kein Custom-Cursor auf Touch/Coarse Pointer.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    dot.style.transition = reducedMotion
      ? "none"
      : "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)";

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

      rafRef.current = window.requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      visible.current = !suppressed.current;
    };

    const onLeave = () => {
      visible.current = false;
    };

    const interactiveSelector =
      'a,button,input,select,textarea,label,[role="button"],[role="link"],[data-cursor-hide]';

    const setSuppressed = (next: boolean) => {
      suppressed.current = next;
      if (next) visible.current = false;
    };

    const onPointerOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest(interactiveSelector)) {
        setSuppressed(true);
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest(interactiveSelector)) {
        // Nur entsperren, wenn wir wirklich nicht mehr auf einem interaktiven Element sind.
        // (z.B. von Icon innerhalb eines Buttons zu Button selbst)
        const to = (e.relatedTarget as Element | null) ?? null;
        if (!to?.closest(interactiveSelector)) {
          setSuppressed(false);
        }
      }
    };

    const onSelectionChange = () => {
      const sel = window.getSelection();
      const hasSelection = Boolean(sel && sel.type === "Range" && sel.toString().trim().length);
      setSuppressed(hasSelection);
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
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: "#3B82F6",
        boxShadow:
          "0 10px 30px -18px rgba(59,130,246,0.9), 0 0 0 1px rgba(255,255,255,0.12) inset",
        opacity: 0,
        willChange: "transform, opacity",
      }}
    />
  );
}

