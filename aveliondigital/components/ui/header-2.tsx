"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";

import { HeaderLogoAnimatedSvg } from "@/components/header-logo-animated-svg";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import { useScroll } from "@/components/use-scroll";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#kontakt" },
] as const;

export function Header() {
  const navRef = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

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
        willChange: "transform, opacity, filter",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          logo,
          { opacity: 0, y: -10, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
          0,
        )
        .fromTo(
          links,
          { opacity: 0, y: -10, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            stagger: 0.055,
          },
          0.08,
        )
        .fromTo(
          burger,
          { opacity: 0, scale: 0.96, filter: "blur(6px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55 },
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

  const linkClass = cn(
    "font-dm-sans-hero text-[11px] font-medium uppercase tracking-[0.2em] text-white/68 sm:text-xs sm:tracking-[0.22em]",
    "rounded-full px-3 py-2 transition-colors duration-300 hover:text-white",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/75",
  );

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[70] flex justify-center px-6 pt-4 sm:px-10 lg:px-14",
        )}
      >
        <div
          className={cn(
            "w-full max-w-5xl border transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
            "rounded-2xl md:rounded-3xl",
            !scrolled && !open && "border-transparent bg-transparent",
            (scrolled || open) &&
              "border-white/12 bg-black/45 shadow-[0_20px_50px_-22px_rgba(0,0,0,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-black/38",
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
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass}
                  data-header-link
                >
                  {link.label}
                </Link>
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
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          aria-label="Menü schließen"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <div className="relative mx-auto mt-[5.25rem] w-full max-w-5xl px-6">
          <nav
            className="flex flex-col gap-1 rounded-2xl border border-white/12 bg-black/55 px-2 py-3 backdrop-blur-xl"
            aria-label="Mobile Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  linkClass,
                  "block rounded-xl px-4 py-3.5 text-left text-[12px] tracking-[0.18em] hover:bg-white/[0.06]",
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
