import { ScrollSmoother } from "gsap/ScrollSmoother";

/** Fixed header clearance when scrolling to in-page sections. */
const HEADER_OFFSET = "top 5.5rem";

export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    const smoother = ScrollSmoother.get();
    if (smoother && !reduced) {
      smoother.scrollTo(target, true, HEADER_OFFSET);
      return;
    }
  } catch {
    /* ScrollSmoother not active (e.g. mobile / SSR) */
  }

  target.scrollIntoView({
    behavior: reduced ? "instant" : "smooth",
    block: "start",
  });
}
