"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";

const LOGO_SRC = "/brand/aveliondigital_header.svg";

function prefixSvgIds(markup: string, prefix: string) {
  return markup
    .replace(/id="([^"]+)"/g, (_, id: string) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${prefix}${id})`);
}

function recolorFills(root: SVGSVGElement, color: string) {
  root.querySelectorAll("[fill]").forEach((node) => {
    const v = node.getAttribute("fill");
    if (!v || v === "none" || v === "transparent") return;
    node.setAttribute("fill", color);
  });
}

export function HeaderLogoAnimatedSvg() {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = React.useState(false);

  React.useLayoutEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setUseFallback(true));
      return;
    }

    let disposed = false;
    let ctx: gsap.Context | null = null;

    void (async () => {
      try {
        const res = await fetch(LOGO_SRC);
        if (!res.ok) throw new Error(String(res.status));
        const raw = await res.text();
        if (disposed) return;

        const prefix = `hl-${Math.random().toString(36).slice(2, 9)}-`;
        const svgMarkup = prefixSvgIds(raw, prefix);
        const doc = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
        const parsed = doc.querySelector("svg");
        if (!parsed) throw new Error("no svg");

        mount.innerHTML = "";

        const stage = document.createElement("div");
        stage.className =
          "relative isolate h-7 w-auto max-w-[min(72vw,15rem)] sm:h-8 sm:max-w-[18rem]";

        const mkLayer = (z: number, ariaHidden: boolean) => {
          const svg = parsed.cloneNode(true) as SVGSVGElement;
          svg.setAttribute("class", "pointer-events-none block h-full w-auto");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
          svg.setAttribute("width", "750");
          svg.setAttribute("height", "150");
          svg.style.position = z === 30 ? "relative" : "absolute";
          if (z !== 30) svg.style.inset = "0";
          svg.style.zIndex = String(z);
          if (ariaHidden) svg.setAttribute("aria-hidden", "true");
          return svg;
        };

        const base = mkLayer(30, false);
        const cyan = mkLayer(20, true);
        const rose = mkLayer(10, true);

        recolorFills(cyan, "#5ee7ff");
        recolorFills(rose, "#fda4e3");

        cyan.style.mixBlendMode = "plus-lighter";
        rose.style.mixBlendMode = "plus-lighter";
        cyan.style.opacity = "0.46";
        rose.style.opacity = "0.4";

        stage.appendChild(rose);
        stage.appendChild(cyan);
        stage.appendChild(base);
        mount.appendChild(stage);

        if (disposed) {
          mount.innerHTML = "";
          return;
        }

        gsap.set([cyan, rose], {
          transformOrigin: "50% 50%",
          force3D: true,
        });

        ctx = gsap.context(() => {
          gsap.from([base, cyan, rose], {
            opacity: 0,
            y: 8,
            scale: 0.985,
            duration: 0.7,
            stagger: 0.035,
            ease: "power2.out",
          });

          const paths = base.querySelectorAll("path");
          if (paths.length) {
            gsap.from(paths, {
              opacity: 0,
              duration: 0.32,
              stagger: { each: 0.01, from: "random" },
              ease: "power1.out",
              delay: 0.12,
            });
          }

          // Loop: gleiche Dauer für Chrom + Base, weiche sine-Kurven, kein
          // harter Micro-Jitter — wirkt ruhiger, bleibt aber sichtbar „glitchy“.
          gsap
            .timeline({ repeat: -1, defaults: { ease: "none" as const } })
            .to({}, { duration: 1.25 })
            .to(cyan, {
              x: 5.2,
              y: 0.72,
              opacity: 0.68,
              duration: 0.26,
              ease: "sine.out",
            })
            .to(
              rose,
              {
                x: -5.6,
                y: -0.62,
                opacity: 0.64,
                duration: 0.26,
                ease: "sine.out",
              },
              "<",
            )
            .to(base, { opacity: 0.9, duration: 0.26, ease: "sine.out" }, "<")
            .to({}, { duration: 0.1 })
            .to(cyan, {
              x: 0,
              y: 0,
              opacity: 0.46,
              duration: 0.44,
              ease: "sine.inOut",
            })
            .to(
              rose,
              {
                x: 0,
                y: 0,
                opacity: 0.4,
                duration: 0.44,
                ease: "sine.inOut",
              },
              "<",
            )
            .to(base, { opacity: 1, duration: 0.44, ease: "sine.inOut" }, "<")
            .to({}, { duration: 0.95 })
            .to(cyan, { skewX: 0.72, duration: 0.2, ease: "sine.out" })
            .to(rose, { skewX: -0.66, duration: 0.2, ease: "sine.out" }, "<")
            .to({}, { duration: 0.08 })
            .to(cyan, { skewX: 0, duration: 0.34, ease: "sine.inOut" })
            .to(rose, { skewX: 0, duration: 0.34, ease: "sine.inOut" }, "<")
            .to({}, { duration: 1.35 });
        }, mount);
      } catch {
        if (!disposed) setUseFallback(true);
      }
    })();

    return () => {
      disposed = true;
      ctx?.revert();
      mount.innerHTML = "";
    };
  }, []);

  if (useFallback) {
    return (
      <span className="inline-flex origin-center items-center leading-none">
        <Image
          src={LOGO_SRC}
          alt="Avelion Digital"
          width={750}
          height={150}
          className="block h-7 w-auto max-w-[min(72vw,15rem)] object-contain object-left sm:h-8 sm:max-w-[18rem]"
          unoptimized
          priority
        />
      </span>
    );
  }

  return (
    <div
      ref={mountRef}
      className="inline-flex min-h-[1.75rem] items-center leading-none sm:min-h-8"
      role="img"
      aria-label="Avelion Digital"
    />
  );
}
