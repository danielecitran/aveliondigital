import type { Metadata } from "next";

import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "Page not found | Daverion Digital",
};

export default function NotFound() {
  return <NotFoundView />;
}
