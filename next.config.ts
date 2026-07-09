import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        // HTML pages: always revalidate so a returning visitor never gets an
        // old page referencing JS chunks a newer deploy has removed.
        source: "/",
        headers: [
          { key: "Cache-Control", value: "no-cache, must-revalidate" },
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
