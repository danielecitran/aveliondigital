import type { ReactNode } from "react";

export default function TradeLensLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-[#010101]">{children}</div>;
}
