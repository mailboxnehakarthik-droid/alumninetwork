import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth redirect target. Exchanges the code for a session, then sends the user
// to onboarding (first login) or their intended destination.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const type = searchParams.get("type");

  // Behind a proxy (Vercel/Netlify/etc.) `origin` can be an internal host or
  // http. Honour the forwarded host so post-login redirects land on the real
  // public domain instead of localhost / an internal URL.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const isLocal = process.env.NODE_ENV === "development";
  const base =
    !isLocal && forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Password recovery: session is established; send them straight to the
      // reset form regardless of onboarding state.
      if (type === "recovery") {
        return NextResponse.redirect(`${base}${next}`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", user.id)
          .single();

        const dest = profile?.onboarded ? next : "/onboarding";
        return NextResponse.redirect(`${base}${dest}`);
      }
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
