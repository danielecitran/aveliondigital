"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { T } from "@/components/tradelens/tradelens-copy";
import {
  CountUp,
  FadeUp,
  TradeLensMotionLiteContext,
  scrollToTradeLensSection,
  useTradeLensMotionLite,
  useTradeLensMotionLiteFlag,
} from "@/components/tradelens/tradelens-motion";

const APP_STORE_URL = "https://apps.apple.com/app/id6753321240";
const ICON_SRC = "/tradelens.png";

function AppStoreBadge({ large = false }: { large?: boolean }) {
  const t = T.appStore;
  const lite = useTradeLensMotionLite();
  return (
    <motion.a
      href={APP_STORE_URL}
      aria-label="Download TradeLens on the App Store"
      whileHover={
        lite
          ? undefined
          : { scale: 1.03, boxShadow: "0 0 28px rgba(59,130,246,0.45)" }
      }
      whileTap={lite ? { scale: 0.98 } : { scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: large ? 14 : 11,
        background: "#ffffff",
        borderRadius: 13,
        padding: large ? "13px 28px" : "10px 20px",
        textDecoration: "none",
        color: "#000",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={large ? 26 : 21}
        height={large ? 32 : 26}
        fill="#000"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.15,
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: large ? 11 : 10,
            fontWeight: 400,
            opacity: 0.65,
            letterSpacing: "0.05em",
          }}
        >
          {t.line1}
        </span>
        <span
          style={{
            fontSize: large ? 21 : 18,
            fontWeight: 700,
            letterSpacing: "-0.025em",
          }}
        >
          {t.line2}
        </span>
      </div>
    </motion.a>
  );
}

const FEATURE_ICONS = [
  <svg key="chart" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>,
  <svg key="news" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
  </svg>,
  <svg key="chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>,
  <svg key="arrows" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 11 12 6 7 11" />
    <polyline points="17 18 12 13 7 18" />
  </svg>,
  <svg key="globe" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>,
  <svg key="user" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>,
];

function TLNav() {
  const t = T.nav;
  const [scrolled, setScrolled] = useState(false);
  const lite = useTradeLensMotionLite();
  const prefersReducedMotion = useReducedMotion();

  const handleInPageAnchor = (
    e: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
    scrollToTradeLensSection(sectionId, behavior);
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        ...(lite
          ? {}
          : {
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }),
        background: lite
          ? scrolled
            ? "rgba(1,1,1,0.98)"
            : "rgba(1,1,1,0.96)"
          : scrolled
            ? "rgba(1,1,1,0.92)"
            : "rgba(1,1,1,0.55)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <Link
          href="/tradelens"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
          aria-label={t.ariaHome}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <Image src={ICON_SRC} alt="TradeLens App Icon" width={40} height={40} />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            TradeLens
          </span>
        </Link>

        <nav
          style={{ display: "flex", alignItems: "center", gap: 4 }}
          aria-label={t.ariaLabel}
        >
          <a
            href="#how-it-works"
            onClick={(e) => handleInPageAnchor(e, "how-it-works")}
            className="hidden md:inline-flex items-center text-[#b6b6b6] hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors duration-200"
          >
            {t.howItWorks}
          </a>
          <a
            href="#features"
            onClick={(e) => handleInPageAnchor(e, "features")}
            className="hidden md:inline-flex items-center text-[#b6b6b6] hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors duration-200"
          >
            {t.features}
          </a>
        </nav>
      </div>
    </header>
  );
}

function HeroSignalCard() {
  const t = T.hero;
  return (
    <>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "rgba(34,197,94,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          boxShadow: "0 0 18px rgba(34,197,94,0.12)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </div>
      <div style={{ fontSize: 11, color: "#7f7f7f", letterSpacing: "0.05em", marginBottom: 6 }}>
        {t.trendLabel}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#22C55E", letterSpacing: "-0.03em" }}>
        Long ↑
      </div>
      <div style={{ fontSize: 11, color: "#7f7f7f", marginTop: 6 }}>{t.confidence}</div>
    </>
  );
}

function HeroPlanCard() {
  const t = T.hero;
  return (
    <>
      <div style={{ fontSize: 10, color: "#3B82F6", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
        {t.aiLabel}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
        BTC / USD
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { label: "Entry", value: "$43,200", color: "#ffffff" },
          { label: "Stop-Loss", value: "$41,800", color: "#ef4444" },
          { label: "Target", value: "$46,500", color: "#22C55E" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#7f7f7f" }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function HeroNewsCard() {
  const t = T.hero;
  return (
    <>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "rgba(59,130,246,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          boxShadow: "0 0 18px rgba(59,130,246,0.14)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        </svg>
      </div>
      <div style={{ fontSize: 11, color: "#7f7f7f", letterSpacing: "0.05em", marginBottom: 6 }}>
        {t.newsLabel}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
        {t.sentiment}
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {["Bullish", "+2.3%", "100+ News"].map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 100,
              background: "rgba(59,130,246,0.1)",
              color: "#60A5FA",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

function TLHero() {
  const t = T.hero;
  const lite = useTradeLensMotionLite();
  const [heroCardIndex, setHeroCardIndex] = useState(1);

  const cardBodies = [<HeroSignalCard key="s" />, <HeroPlanCard key="p" />, <HeroNewsCard key="n" />];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 96px",
        textAlign: "center",
      }}
    >
      {lite ? (
        <>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(100vw, 800px)",
              height: 480,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(59,130,246,0.14) 0%, rgba(99,102,241,0.06) 45%, transparent 72%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      ) : (
        <>
          <motion.div
            animate={{ y: [0, -22, 0] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.09) 35%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
            style={{
              position: "absolute",
              top: "20%",
              right: "10%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
        <FadeUp>
          <h1
            style={{
              fontSize: "clamp(36px, 6.5vw, 70px)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.02,
              color: "#ffffff",
              margin: "0 0 24px",
            }}
          >
            {t.headlineL1}
            <br />
            {t.headlineL2}{" "}
            <span style={{ color: "#3B82F6" }}>{t.headlineAccent}</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#b6b6b6",
              maxWidth: 600,
              margin: "0 auto 44px",
            }}
          >
            {t.sub}
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="md:hidden">
              <AppStoreBadge />
            </div>
            <div className="hidden md:block">
              <AppStoreBadge large />
            </div>
          </div>
        </FadeUp>

        <div aria-hidden="true" style={{ height: 56 }} />

        <FadeUp delay={0.3}>
          <div
            className="md:hidden"
            style={{
              position: "relative",
              height: 196,
              width: "min(520px, 100%)",
              margin: "0 auto",
            }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                const swipe = info.offset.x + info.velocity.x * 0.15;
                if (swipe > 60) setHeroCardIndex((v) => Math.max(0, v - 1));
                if (swipe < -60) setHeroCardIndex((v) => Math.min(2, v + 1));
              }}
              style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}
            >
              {([0, 1, 2] as const).map((idx) => {
                const isCenter = idx === heroCardIndex;
                const isLeft = idx === heroCardIndex - 1;
                const isRight = idx === heroCardIndex + 1;
                const bgPrimary =
                  "linear-gradient(180deg, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.06) 45%, rgba(0,0,0,0) 100%), rgba(12,12,12,0.72)";
                const bgSecondary =
                  "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0) 100%), rgba(19,19,19,0.72)";
                const animate = isCenter
                  ? { x: 0, rotate: 0, scale: 1, opacity: 1, zIndex: 3 }
                  : isLeft
                    ? { x: -112, rotate: -8, scale: 0.92, opacity: 0.82, zIndex: 2 }
                    : isRight
                      ? { x: 112, rotate: 8, scale: 0.92, opacity: 0.82, zIndex: 2 }
                      : {
                          x: idx < heroCardIndex ? -180 : 180,
                          rotate: idx < heroCardIndex ? -10 : 10,
                          scale: 0.9,
                          opacity: 0,
                          zIndex: 1,
                        };

                return (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={animate}
                    transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      translate: "-50% 0",
                      borderRadius: 20,
                      textAlign: "left",
                      boxShadow: "0 14px 54px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.07)",
                      width: 238,
                      padding: "16px 16px",
                      cursor: "pointer",
                      userSelect: "none",
                      background: idx === 1 ? bgPrimary : bgSecondary,
                    } as CSSProperties}
                    onClick={() => setHeroCardIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Hero card ${idx + 1}`}
                    onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === "Enter" || e.key === " ") setHeroCardIndex(idx);
                      if (e.key === "ArrowLeft") setHeroCardIndex((v) => Math.max(0, v - 1));
                      if (e.key === "ArrowRight") setHeroCardIndex((v) => Math.min(2, v + 1));
                    }}
                  >
                    {cardBodies[idx]}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="mb-10 mt-16 hidden flex-wrap justify-center gap-4 md:flex">
            <motion.div
              animate={lite ? false : { y: [0, -10, 0] }}
              transition={lite ? undefined : { duration: 4.5, ease: "easeInOut", repeat: Infinity }}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0) 100%), rgba(19,19,19,0.72)",
                borderRadius: 20,
                padding: "20px 22px",
                width: 180,
                textAlign: "left",
                boxShadow: "0 10px 38px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <HeroSignalCard />
            </motion.div>
            <motion.div
              animate={lite ? false : { y: [0, -14, 0] }}
              transition={
                lite
                  ? undefined
                  : { duration: 5.5, ease: "easeInOut", repeat: Infinity, delay: 0.4 }
              }
              style={{
                background:
                  "linear-gradient(180deg, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.06) 45%, rgba(0,0,0,0) 100%), rgba(12,12,12,0.72)",
                borderRadius: 20,
                padding: "22px 26px",
                width: 210,
                textAlign: "left",
                boxShadow:
                  "0 14px 54px rgba(0,0,0,0.72), 0 0 44px rgba(59,130,246,0.10), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <HeroPlanCard />
            </motion.div>
            <motion.div
              animate={lite ? false : { y: [0, -9, 0] }}
              transition={
                lite
                  ? undefined
                  : { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.8 }
              }
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0) 100%), rgba(19,19,19,0.72)",
                borderRadius: 20,
                padding: "20px 22px",
                width: 180,
                textAlign: "left",
                boxShadow: "0 10px 38px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <HeroNewsCard />
            </motion.div>
          </div>
          <p style={{ marginTop: 12, fontSize: 11, color: "rgba(182,182,182,0.72)" }}>
            {t.exampleNote}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function TLHowItWorks() {
  const t = T.howItWorks;
  return (
    <section id="how-it-works" style={{ padding: "100px 24px", background: "#010101" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp className="mb-16 text-center">
          <span
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              color: "#3B82F6",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {t.eyebrow}
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              margin: 0,
            }}
          >
            {t.heading}
          </h2>
        </FadeUp>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          {t.steps.map((step, i) => (
            <FadeUp key={step.title} delay={i * 0.08}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "84px 1fr",
                  gap: 18,
                  alignItems: "start",
                  padding: i === t.steps.length - 1 ? "10px 0" : "10px 0 36px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} aria-hidden>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 9999,
                      display: "grid",
                      placeItems: "center",
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(96,165,250,0.20), rgba(59,130,246,0.07) 55%, rgba(0,0,0,0) 72%)",
                      boxShadow: "0 0 30px rgba(59,130,246,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", color: "#93c5fd" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {i !== t.steps.length - 1 ? (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        marginTop: 10,
                        background:
                          "linear-gradient(180deg, rgba(59,130,246,0.32) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%)",
                        minHeight: 44,
                      }}
                    />
                  ) : null}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: "-0.04em",
                      margin: "2px 0 10px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#b6b6b6", margin: 0, maxWidth: 640 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function TLFeatures() {
  const t = T.features;
  return (
    <section id="features" style={{ padding: "100px 24px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp className="mb-4 text-center">
          <span
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              color: "#3B82F6",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {t.eyebrow}
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              margin: "0 0 16px",
            }}
          >
            {t.heading}
          </h2>
          <p style={{ fontSize: 18, color: "#b6b6b6", maxWidth: 540, margin: "0 auto 60px" }}>
            {t.subtitle}
          </p>
        </FadeUp>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div className="grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
            {t.items.map((feat, i) => (
              <FadeUp key={feat.title} delay={i * 0.06}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, alignItems: "flex-start" }}>
                  <div aria-hidden style={{ paddingTop: 2 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9999,
                        display: "grid",
                        placeItems: "center",
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(96,165,250,0.16), rgba(59,130,246,0.07) 55%, rgba(0,0,0,0) 72%)",
                        boxShadow: "0 0 26px rgba(59,130,246,0.10)",
                      }}
                    >
                      {FEATURE_ICONS[i]}
                    </div>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "-0.03em",
                        margin: "0 0 8px",
                      }}
                    >
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#b6b6b6", margin: 0 }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TLValueProps() {
  const t = T.valueProps;
  return (
    <section style={{ padding: "100px 24px", background: "#010101" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp className="text-center">
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              maxWidth: 700,
              margin: "0 auto 56px",
            }}
          >
            {t.headingPart1}{" "}
            <span style={{ color: "#3B82F6" }}>{t.headingAccent}</span>
          </h2>
        </FadeUp>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-16">
            {t.items.map((vp, i) => (
              <FadeUp key={vp.label} delay={i * 0.08}>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 64,
                      fontWeight: 900,
                      letterSpacing: "-0.08em",
                      lineHeight: 0.98,
                      color: "#ffffff",
                      marginBottom: 10,
                    }}
                  >
                    {vp.stat}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "#ffffff",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 18,
                        height: 2,
                        borderRadius: 9999,
                        background: "rgba(59,130,246,0.9)",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "rgba(147,197,253,0.92)" }}>{vp.label}</span>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "#b6b6b6", margin: 0, maxWidth: 360 }}>
                    {vp.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TLDownloadCTA() {
  const t = T.cta;
  const lite = useTradeLensMotionLite();
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px",
        textAlign: "center",
        background: "#010101",
      }}
    >
      {lite ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(100vw, 640px)",
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(29,78,216,0.06) 45%, transparent 72%)",
            pointerEvents: "none",
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 700,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, rgba(29,78,216,0.1) 40%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
            style={{
              position: "absolute",
              top: "30%",
              left: "20%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
        <FadeUp>
          <div
            style={{
              fontSize: "clamp(14px, 2.5vw, 18px)",
              fontWeight: 700,
              color: "#3B82F6",
              letterSpacing: "-0.01em",
              marginBottom: 20,
            }}
          >
            {t.countPrefix} <CountUp target={35000} /> {t.countSuffix}
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2
            style={{
              fontSize: "clamp(30px, 5vw, 58px)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              color: "#ffffff",
              margin: "0 0 20px",
            }}
          >
            {t.heading}
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p style={{ fontSize: 18, color: "#b6b6b6", lineHeight: 1.65, margin: "0 auto 44px", maxWidth: 520 }}>
            {t.sub}
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="md:hidden">
              <AppStoreBadge />
            </div>
            <div className="hidden md:block">
              <AppStoreBadge large />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const lite = useTradeLensMotionLite();
  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={label}
      whileHover={lite ? undefined : { scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: 44,
        height: 44,
        borderRadius: 9999,
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b6b6b6",
        textDecoration: "none",
      }}
    >
      {children}
    </motion.a>
  );
}

function TLFooter() {
  const t = T.footer;
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background: "#010101",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "72px 24px 0",
      }}
      role="contentinfo"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
                }}
              >
                <Image src={ICON_SRC} alt="TradeLens" width={32} height={32} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                TradeLens
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#7f7f7f", lineHeight: 1.65, margin: 0, maxWidth: 200 }}>
              {t.tagline}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#7f7f7f",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {t.connectHeading}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <SocialButton href="https://www.tiktok.com/@tradelensapp" label={t.ariaTikTok}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1-.08z" />
                </svg>
              </SocialButton>
              <SocialButton href="mailto:tradelens@daverion.digital" label={t.ariaEmail}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </SocialButton>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#7f7f7f",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {t.legalHeading}
            </p>
            <nav aria-label={t.ariaLegal} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/tradelens/privacy" className="text-sm text-[#b6b6b6] no-underline transition-colors hover:text-white">
                {t.privacyPolicy}
              </Link>
              <Link href="/tradelens/terms" className="text-sm text-[#b6b6b6] no-underline transition-colors hover:text-white">
                {t.termsOfUse}
              </Link>
            </nav>
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#7f7f7f",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {t.contactHeading}
            </p>
            <a href="mailto:tradelens@daverion.digital" className="text-sm text-[#b6b6b6] no-underline transition-colors hover:text-white">
              tradelens@daverion.digital
            </a>
          </div>
        </div>
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            paddingBottom: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
            fontSize: 13,
            color: "#7f7f7f",
          }}
        >
          <a
            href="/"
            className="text-[#7f7f7f] no-underline transition-colors hover:text-white"
          >
            {t.copyright(year)}
          </a>
        </div>
      </div>
    </footer>
  );
}

export function TradeLensPage() {
  const motionLite = useTradeLensMotionLiteFlag();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = requestAnimationFrame(() => {
      scrollToTradeLensSection(hash, reduce ? "auto" : "smooth");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <TradeLensMotionLiteContext.Provider value={motionLite}>
      <div
        style={{
          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
          background: "#010101",
          color: "#ffffff",
          minHeight: "100vh",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(900px 600px at 12% 16%, rgba(59,130,246,0.10) 0%, rgba(0,0,0,0) 60%), radial-gradient(700px 480px at 88% 28%, rgba(99,102,241,0.08) 0%, rgba(0,0,0,0) 58%), radial-gradient(900px 520px at 50% 92%, rgba(34,197,94,0.05) 0%, rgba(0,0,0,0) 60%)",
            opacity: motionLite ? 0.55 : 0.8,
          }}
        />
        <TLNav />
        <main style={{ position: "relative", zIndex: 1 }}>
          <TLHero />
          <TLHowItWorks />
          <TLFeatures />
          <TLValueProps />
          <TLDownloadCTA />
        </main>
        <TLFooter />
      </div>
    </TradeLensMotionLiteContext.Provider>
  );
}
