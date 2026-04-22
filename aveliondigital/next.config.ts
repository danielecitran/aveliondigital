import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats (AVIF first, WebP as fallback) for any future
    // raster images. SVGs served via next/image are unaffected.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
