import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import LoginButtons from "./LoginButtons";
import EmailAuth from "./EmailAuth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in — BMSCE Alumni Network",
};

type Props = {
  searchParams: Promise<{ as?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { as, error } = await searchParams;
  const isStudent = as === "student";

  // Already signed in? Skip the login screen.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();
    redirect(profile?.onboarded ? "/" : "/onboarding");
  }

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto flex max-w-md flex-col px-6 pb-24 pt-20 md:pt-28">
            <Reveal>
              <Eyebrow>{isStudent ? "For students" : "Members"}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
                {isStudent ? "Find a mentor." : "Welcome back."}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 font-sans text-base leading-relaxed text-ink/70">
                {isStudent
                  ? "Sign in to connect with BMS alumni who can guide you. Current students welcome."
                  : "Sign in to reach the network — the directory, chapters, events, and mentorship."}
              </p>
            </Reveal>

            {error && (
              <Reveal delay={200}>
                <p className="mt-6 rounded-sm border border-oxblood/30 bg-oxblood/5 px-4 py-3 font-sans text-sm text-oxblood">
                  Something went wrong signing you in. Please try again.
                </p>
              </Reveal>
            )}

            <Reveal delay={240}>
              <div className="mt-10">
                <LoginButtons userType={isStudent ? "student" : "alumni"} />
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-gold/30" />
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
                  or with email
                </span>
                <span className="h-px flex-1 bg-gold/30" />
              </div>
            </Reveal>

            <Reveal delay={300}>
              <EmailAuth userType={isStudent ? "student" : "alumni"} />
            </Reveal>

            <Reveal delay={320}>
              <p className="mt-8 font-sans text-sm text-ink/60">
                {isStudent ? (
                  <>
                    Are you an alumnus?{" "}
                    <Link
                      href="/login"
                      className="border-b border-gold pb-0.5 text-oxblood transition-colors hover:border-oxblood"
                    >
                      Sign in here
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Current BMS student looking for a mentor?{" "}
                    <Link
                      href="/login?as=student"
                      className="border-b border-gold pb-0.5 text-oxblood transition-colors hover:border-oxblood"
                    >
                      Start here
                    </Link>
                    .
                  </>
                )}
              </p>
            </Reveal>

            <Reveal delay={360}>
              <p className="mt-6 font-sans text-xs leading-relaxed text-ink/45">
                By continuing you agree to be part of the BMSCE Alumni Network
                community. Alumni profiles are reviewed before appearing in the
                directory.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
