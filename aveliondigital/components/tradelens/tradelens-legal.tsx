import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export function TradeLensLegalChrome({
  breadcrumb,
  eyebrow,
  pageTitle,
  provider,
  date,
  children,
}: {
  breadcrumb: string;
  eyebrow: string;
  pageTitle: string;
  provider: string;
  date: string;
  children: ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <div
      style={{
        fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
        background: "#010101",
        color: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 24px" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 68,
          }}
        >
          <Link
            href="/tradelens"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            aria-label="TradeLens"
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <Image src="/tradelens.png" alt="TradeLens" width={34} height={34} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              TradeLens
            </span>
          </Link>
          <span
            style={{
              marginLeft: 16,
              paddingLeft: 16,
              borderLeft: "1px solid rgba(255,255,255,0.12)",
              fontSize: 14,
              color: "#7f7f7f",
            }}
          >
            {breadcrumb}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 120px" }}>
        <div
          style={{
            marginBottom: 56,
            paddingBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#3B82F6",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            {pageTitle}
          </h1>
          <p style={{ fontSize: 15, color: "#7f7f7f", margin: "0 0 4px" }}>{provider}</p>
          <p style={{ fontSize: 14, color: "#7f7f7f", margin: 0 }}>{date}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>{children}</div>

        <div style={{ marginTop: 64, textAlign: "center" }}>
          <Link
            href="/tradelens"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#3B82F6",
              textDecoration: "none",
            }}
          >
            ← Back to TradeLens
          </Link>
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px",
          textAlign: "center",
          fontSize: 13,
          color: "#7f7f7f",
        }}
      >
        <a
          href="/"
          className="text-[#7f7f7f] no-underline transition-colors hover:text-white"
        >
          © {year} Daverion Digital
        </a>
      </footer>
    </div>
  );
}

export function DocSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}
      >
        {heading}
      </h2>
      <div style={{ fontSize: 15, color: "#b6b6b6", lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "12px 0", paddingLeft: 22, listStyleType: "disc" }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 15,
            color: "#b6b6b6",
            lineHeight: 1.7,
            marginBottom: 6,
            display: "list-item",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function AddressBlock({ lines, email }: { lines: string[]; email: string }) {
  return (
    <p style={{ margin: "14px 0 0", fontSize: 15, color: "#b6b6b6", lineHeight: 1.55 }}>
      {lines.map((line) => (
        <span key={line}>
          {line}
          <br />
        </span>
      ))}
      <a href={`mailto:${email}`} style={{ color: "#3B82F6", textDecoration: "none" }}>
        {email}
      </a>
    </p>
  );
}

export function Callout({
  variant,
  badge,
  children,
}: {
  variant: "warning" | "info";
  badge: string;
  children: ReactNode;
}) {
  const warn = variant === "warning";
  return (
    <div
      style={{
        borderLeft: `3px solid ${warn ? "rgba(239,68,68,0.7)" : "rgba(59,130,246,0.7)"}`,
        background: warn ? "rgba(239,68,68,0.05)" : "rgba(59,130,246,0.05)",
        borderRadius: "0 10px 10px 0",
        padding: "16px 20px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: warn ? "#fca5a5" : "#93c5fd",
          background: warn ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.12)",
          border: `1px solid ${warn ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
          borderRadius: 100,
          padding: "2px 10px",
          marginBottom: 10,
        }}
      >
        {badge}
      </span>
      <p style={{ fontSize: 15, color: "#b6b6b6", lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  );
}

export function ThirdPartyBox({
  name,
  rows,
}: {
  name: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div
      style={{
        margin: "14px 0",
        borderLeft: "3px solid rgba(59,130,246,0.5)",
        background: "rgba(59,130,246,0.04)",
        borderRadius: "0 10px 10px 0",
        padding: "16px 20px",
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#93c5fd",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {name}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#7f7f7f",
                minWidth: 120,
                paddingTop: 2,
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: 14, color: "#b6b6b6", lineHeight: 1.6 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
