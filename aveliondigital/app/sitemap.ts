import type { MetadataRoute } from "next";

import { SITEMAP_ROUTES, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITEMAP_ROUTES.map((route) => ({
    url: route.path ? `${SITE_URL}${route.path}` : SITE_URL,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
