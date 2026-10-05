import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workaround: Turbopack on Windows has a path separator bug in TS checking.
  // Type safety is enforced by `tsc --noEmit` / IDE instead.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // The client portal was deleted on 2026-10-05, but contact confirmation
  // emails sent before then link to /portal. Send those readers home.
  async redirects() {
    return [
      { source: "/portal", destination: "/", permanent: true },
      { source: "/portal/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
