import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getCareersEnabled } from "@/lib/settings";

// Note: as of Next.js 16 this file convention is deprecated in favor of
// proxy.ts (`npx @next/codemod@canary middleware-to-proxy .` migrates it),
// but middleware.ts still works — Next only emits a build-time warning. Left
// as-is here since renaming/migrating is a separate concern from adding
// security headers, and Proxy defaults to the Node.js runtime rather than
// Edge, which is a behavior change worth its own review.

const SUPABASE_ORIGIN = "https://sujxfhpvbrhhlmvzbgwv.supabase.co";
const SUPABASE_WS_ORIGIN = "wss://sujxfhpvbrhhlmvzbgwv.supabase.co";

function buildCsp(nonce: string) {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
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
}

export async function middleware(request: NextRequest) {
  // Nonce-based CSP, following Next.js's documented pattern: generate a
  // per-request nonce, forward it as a request header (so Server Components
  // can read it via headers(), and so Next's own framework-injected scripts
  // pick up the matching nonce automatically once it parses the CSP response
  // header), and set the CSP as the actual enforced response header.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  // Rebuild the request with the augmented headers so every downstream call
  // below — including updateSession's own NextResponse.next({ request }) —
  // forwards x-nonce/CSP into the render context.
  const nextRequest = new NextRequest(request, { headers: requestHeaders });

  // Careers is gated by the admin-controlled `careers_enabled` flag. While it's
  // off, any /careers subpage (jobs, internships, mentorship, post,
  // my-postings, openings/[id], …) is sent to the /careers "not available"
  // page. Flipping the flag on in /admin re-opens them, no deploy needed.
  const { pathname } = nextRequest.nextUrl;
  if (pathname.startsWith("/careers/")) {
    const enabled = await getCareersEnabled();
    if (!enabled) {
      const response = NextResponse.redirect(
        new URL("/careers", nextRequest.url)
      );
      response.headers.set("Content-Security-Policy", csp);
      return response;
    }
  }

  const response = await updateSession(nextRequest);
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
