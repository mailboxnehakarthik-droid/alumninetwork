import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import DirectoryBrowser, {
  type DirectoryAlum,
} from "@/components/DirectoryBrowser";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Directory — BMS Alumni Network",
  description:
    "Search the BMS alumni directory by batch, branch, city, or company. Find your people.",
};

// Always fetch fresh so a newly-verified member shows up on the next load.
export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alumni: DirectoryAlum[] = [];
  if (user) {
    // RLS also restricts this to verified alumni; the filters are explicit for
    // clarity and correctness.
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, full_name, graduation_year, branch, company, job_title, current_city, photo_url"
      )
      .eq("verification_status", "verified")
      .eq("user_type", "alumni")
      .order("full_name", { ascending: true });

    alumni = (data ?? []).map((p) => ({
      id: p.id as string,
      name: (p.full_name as string) ?? "BMS alum",
      batch: (p.graduation_year as number) ?? null,
      branch: (p.branch as string) ?? null,
      company: (p.company as string) ?? null,
      title: (p.job_title as string) ?? null,
      city: (p.current_city as string) ?? null,
      photoUrl: (p.photo_url as string) ?? null,
    }));
  }

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-7xl px-6 pb-6 pt-16 md:px-10 md:pb-8 md:pt-24">
            <Reveal>
              <Eyebrow>Directory</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] tracking-tight text-ink">
                Find your people.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/70 md:text-lg">
                Filter by batch, branch, city, or company to find who you are
                looking for.
              </p>
            </Reveal>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
            {user ? (
              <DirectoryBrowser alumni={alumni} />
            ) : (
              <div className="mt-4 border border-dashed border-gold/40 bg-ivory-dim/40 px-6 py-20 text-center">
                <p className="font-display text-2xl italic text-ink">
                  Sign in to browse the directory.
                </p>
                <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink/65">
                  The alumni directory is for members of the network. Sign in or
                  join to see who&rsquo;s here.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center justify-center rounded-sm bg-oxblood px-7 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
