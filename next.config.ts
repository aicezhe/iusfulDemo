import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        // HTML pages: never let the browser keep a disk copy at all. Mobile
        // Safari has a known bug mismatching cached vs. revalidated HTML for
        // "no-cache" responses (confirmed here: reopening the same link
        // breaks in normal browsing but not in Private Browsing, where no
        // persistent disk cache exists) — "no-store" removes the ambiguity
        // by forbidding any cache write in the first place.
        source: "/",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        // Hashed static assets are safe to cache for a long time — the same
        // filename never changes content, a new deploy just uses new hashes.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
