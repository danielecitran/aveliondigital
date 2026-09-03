"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";

import { HeaderLogoAnimatedSvg } from "@/components/header-logo-animated-svg";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import { useScroll } from "@/components/use-scroll";
import { scrollToSection } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", sectionId: "about" },
  { label: "Services", sectionId: "services" },
  { label: "Our Work", sectionId: "work" },
  { label: "Contact", sectionId: "contact" },
] as const;

/**
 * macOS/iOS elastic overscroll applies a temporary transform on <html>.
 * That makes every `position: fixed` element a descendant of a transformed
 * ancestor, so the header slides with the bounce — only at the page edges.
 * Each frame we measure the drift and invert it.
 */
function useStickToViewport(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let correction = 0;
    let raf = 0;

    const apply = () => {
      el.style.transform =
        Math.abs(correction) < 0.5 ? "" : `translate3d(0, ${correction}px, 0)`;
    };

    const tick = () => {
      apply();
      const top = el.getBoundingClientRect().top;
      if (Math.abs(top) >= 0.5) {
        correction -= top;
        apply();
      } else if (Math.abs(correction) < 0.5) {
        correction = 0;
        apply();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, []);
}

export function Header() {
  const navRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const pathname = usePathname();

  useStickToViewport(headerRef);

  React.useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const logo = nav.querySelector("[data-header-logo]");
    const links = Array.from(nav.querySelectorAll("[data-header-link]"));
    const burger = nav.querySelector("[data-header-burger]");

    const ctx = gsap.context(() => {
      gsap.set([logo, ...links, burger], {
        willChange: "transform, opacity",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          logo,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6 },
          0,
        )
        .fromTo(
          links,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.055 },
          0.08,
        )
        .fromTo(
          burger,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.55 },
          0.16,
        );
    }, nav);

    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onNavClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      setOpen(false);
      if (pathname !== "/") return;
      e.preventDefault();
      scrollToSection(sectionId);
    },
    [pathname],
  );

  const linkClass = cn(
    "font-dm-sans-hero text-[11px] font-medium uppercase tracking-[0.2em] text-white/68 sm:text-xs sm:tracking-[0.22em]",
    "rounded-full px-3 py-2 transition-colors duration-300 hover:text-white",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/75",
  );

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-6 pt-[max(1rem,env(safe-area-inset-top))] sm:px-10 lg:px-14"
      >
        <div
          className={cn(
            "pointer-events-auto w-full max-w-5xl border",
            "transition-[background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
            "rounded-2xl md:rounded-3xl",
            !scrolled && !open && "border-transparent bg-transparent",
            (scrolled || open) &&
              "border-white/12 bg-[#050508]/90 shadow-[0_20px_50px_-22px_rgba(0,0,0,0.55)]",
          )}
        >
          <nav
            ref={navRef}
            className="flex h-14 items-center justify-between gap-4 px-4 md:h-14 md:px-5 lg:px-6"
            aria-label="Hauptnavigation"
          >
            <Link
              href="/"
              className={cn(
                "inline-flex shrink-0 items-center leading-none",
                "transition-opacity hover:opacity-90",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/75",
              )}
              aria-label="Startseite"
            >
              <span data-header-logo className="inline-flex items-center leading-none">
                <HeaderLogoAnimatedSvg />
              </span>
            </Link>

            <div className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.sectionId}
                  href={`/#${link.sectionId}`}
                  className={linkClass}
                  data-header-link
                  onClick={(e) => onNavClick(e, link.sectionId)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:hidden",
                "border border-white/35 bg-white/[0.06] text-white",
                "transition-[border-color,background-color] duration-300 hover:border-white/55 hover:bg-white/[0.1]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
              )}
              data-header-burger
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setOpen((v) => !v)}
            >
              <MenuToggleIcon open={open} className="size-5" duration={300} />
            </button>
          </nav>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-[65] md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none invisible opacity-0",
          "transition-opacity duration-300",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/75"
          aria-label="Menü schließen"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <div className="relative mx-auto mt-[5.25rem] w-full max-w-5xl px-6">
          <nav
            className="flex flex-col gap-1 rounded-2xl border border-white/12 bg-[#050508]/95 px-2 py-3"
            aria-label="Mobile Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.sectionId}
                href={`/#${link.sectionId}`}
                className={cn(
                  linkClass,
                  "block rounded-xl px-4 py-3.5 text-left text-[12px] tracking-[0.18em] hover:bg-white/[0.06]",
                )}
                onClick={(e) => onNavClick(e, link.sectionId)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
