import { ScrollSmoother } from "gsap/ScrollSmoother";

/** Fixed header clearance when scrolling to in-page sections. */
const HEADER_OFFSET = "top 5.5rem";

export function resetPageScroll() {
  try {
    ScrollSmoother.get()?.scrollTo(0, false);
  } catch {
    /* ScrollSmoother not active */
  }

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const wrapper = document.getElementById("smooth-wrapper");
  if (wrapper) wrapper.scrollTop = 0;
}

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
