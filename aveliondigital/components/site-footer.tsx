"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrollToSection } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

const exploreLinks = [
  { label: "About", sectionId: "about" },
  { label: "Services", sectionId: "services" },
  { label: "Our Work", sectionId: "work" },
  { label: "Contact", sectionId: "contact" },
] as const;

const legalLinks = [
  { label: "Imprint", href: "/imprint" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

const linkClass = cn(
  "font-dm-sans-hero mx-auto w-fit text-[12px] font-medium uppercase tracking-[0.18em] text-white/55 lg:mx-0",
  "transition-colors duration-300 hover:text-white",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70",
);

const colTitleClass =
  "font-dm-sans-hero flex h-14 items-end justify-center text-[11px] font-medium uppercase tracking-normal text-white/35 lg:justify-start";

export function SiteFooter() {
  const rootRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const onExploreClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    if (pathname !== "/") return;
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <footer ref={rootRef} className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16 sm:px-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pt-20 lg:px-8 lg:pb-8 lg:pt-24">
      <div
        className={cn(
          "relative overflow-hidden bg-[#050508] text-white",
          "rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.05), transparent 42%)," +
              "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "auto, 28px 28px",
          }}
        />

        <div className="relative px-7 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-[4.25rem]">
          <div className="flex w-full flex-col items-center gap-12 text-center lg:flex-row lg:items-start lg:gap-28 lg:text-left">
            <div className="max-w-[20rem] shrink-0">
              <div className="flex h-14 items-end justify-center lg:justify-start">
                <a
                  href="/"
                  aria-label="Back to home"
                  className="inline-flex rounded-sm transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                >
                  <img
                    src="/brand/aveliondigital_intro_mark.svg"
                    alt="Daverion Digital"
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain brightness-0 invert"
                  />
                </a>
              </div>
              <p className="font-dm-sans-hero mt-8 text-[13px] leading-[1.8] text-white/48">
                You have reached the bottom. That means you are serious. We partner with
                brands that value long-term thinking, distinctive design and technical
                excellence. If that sounds like you, let&apos;s talk.
              </p>
            </div>

            <div className="grid min-w-0 w-full flex-1 grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3 lg:gap-x-10">
              <div>
                <p className={colTitleClass}>Explore</p>
                <nav aria-label="Explore" className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                  {exploreLinks.map((link) => (
                    <a
                      key={link.sectionId}
                      href={`/#${link.sectionId}`}
                      onClick={(e) => onExploreClick(e, link.sectionId)}
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div>
                <p className={colTitleClass}>Legal</p>
                <nav aria-label="Legal" className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                  {legalLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <address className="not-italic">
                <p className={colTitleClass}>Company</p>
                <p className="font-playfair mt-8 text-[1.15rem] leading-none tracking-[-0.02em] text-white">
                  Daverion Digital KLG
                </p>
                <p className="font-dm-sans-hero mt-4 text-[13px] leading-[1.8] text-white/48">
                  Stockenstrasse 1
                  <br />
                  8802 Kilchberg ZH
                  <br />
                  Switzerland
                </p>
              </address>
            </div>
          </div>

          <p className="font-dm-sans-hero mt-16 text-center text-[11px] font-medium uppercase tracking-normal text-white/32 sm:mt-20">
            © {new Date().getFullYear()} Daverion Digital
          </p>
        </div>
      </div>
    </footer>
  );
}
