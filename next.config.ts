import type { NextConfig } from "next";

// Content-Security-Policy is set per-request in src/middleware.ts (it needs a
// fresh nonce each time), not here — next.config.js headers() can't vary per
// request. These are the remaining, static security headers.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Belt-and-suspenders for older browsers that don't support the CSP
  // frame-ancestors directive above; frame-ancestors 'none' supersedes it in
  // modern browsers.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  images: {
    // Gallery thumbnails/medium images live in Supabase Storage — next/image
    // needs the host allowlisted to optimize/serve them.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sujxfhpvbrhhlmvzbgwv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
