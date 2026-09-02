import type { Metadata } from "next";

import { TradeLensPage } from "@/components/tradelens/tradelens-page";

export const metadata: Metadata = {
  title: "TradeLens: Chart Analysis | Download Today",
  description:
    "Upload a chart and instantly receive a detailed technical analysis, clear long/short signals, and a complete trading plan.",
};

export default function Page() {
  return <TradeLensPage />;
}
