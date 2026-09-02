"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const TradeLensMotionLiteContext = createContext(false);

function subscribeTradeLensMotionLite(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mqTouch = window.matchMedia("(hover: none)");
  const mqNarrow = window.matchMedia("(max-width: 768px)");
  const fire = () => onStoreChange();
  mqTouch.addEventListener("change", fire);
  mqNarrow.addEventListener("change", fire);
  return () => {
    mqTouch.removeEventListener("change", fire);
    mqNarrow.removeEventListener("change", fire);
  };
}

function getTradeLensMotionLiteSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function useTradeLensMotionLiteFlag(): boolean {
  const prefersReduced = useReducedMotion();
  const mediaLite = useSyncExternalStore(
    subscribeTradeLensMotionLite,
    getTradeLensMotionLiteSnapshot,
    () => false,
  );
  return Boolean(prefersReduced || mediaLite);
}

export function useTradeLensMotionLite(): boolean {
  return useContext(TradeLensMotionLiteContext);
}

const TL_NAV_ANCHOR_OFFSET_PX = 88;

export function scrollToTradeLensSection(
  elementId: string,
  behavior: ScrollBehavior = "smooth",
): void {
  const el = document.getElementById(elementId);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - TL_NAV_ANCHOR_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const lite = useTradeLensMotionLite();
  return (
    <motion.div
      ref={ref}
      initial={lite ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? (lite ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
      transition={
        lite
          ? { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay }
          : { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  target,
  duration = 2200,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString("en-US")}</span>;
}
