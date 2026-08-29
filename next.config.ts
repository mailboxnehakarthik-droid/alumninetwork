import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const SUPABASE_ORIGIN = "https://sujxfhpvbrhhlmvzbgwv.supabase.co";
const SUPABASE_WS_ORIGIN = "wss://sujxfhpvbrhhlmvzbgwv.supabase.co";

// Nonce-based CSP was dropped: Next's own framework/boundary scripts
// (createComponentStylesAndScripts, used for loading/not-found/error
// segments) don't get the nonce threaded onto them in this Next version
// (vercel/next.js#96063, #95433, open PR #92803), so 'strict-dynamic' blocked
// those scripts outright. SRI lets scripts stay static and be trusted by
// content hash instead of a per-request nonce, so no per-request header is
// needed and this can live as a static header here.
const cspHeader = [
  `default-src 'self'`,
  `script-src 'self'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind/inline styles need this; style injection is much lower-risk
  // than script injection, so this is an acceptable tradeoff.
  `style-src 'self' 'unsafe-inline'`,
  // Broad https: because admin-pasted Instagram post images and Wikimedia
  // chapter photos come from arbitrary domains — images can't execute
  // script, so this doesn't weaken XSS protection.
  `img-src 'self' data: blob: https:`,
  // Fonts are self-hosted via next/font/google (no runtime Google Fonts request).
  `font-src 'self'`,
  `connect-src 'self' ${SUPABASE_ORIGIN} ${SUPABASE_WS_ORIGIN}`,
  `frame-src 'none'`,
  `frame-ancestors 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
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
  experimental: {
    sri: {
      algorithm: "sha256",
    },
  },
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
