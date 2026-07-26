import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getCareersEnabled } from "@/lib/settings";

export async function middleware(request: NextRequest) {
  // Careers is gated by the admin-controlled `careers_enabled` flag. While it's
  // off, any /careers subpage (jobs, internships, mentorship, post,
  // my-postings, openings/[id], …) is sent to the /careers "not available"
  // page. Flipping the flag on in /admin re-opens them, no deploy needed.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/careers/")) {
    const enabled = await getCareersEnabled();
    if (!enabled) {
      return NextResponse.redirect(new URL("/careers", request.url));
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
