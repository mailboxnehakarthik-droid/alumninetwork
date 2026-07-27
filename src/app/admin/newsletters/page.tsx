import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import NewsletterAdmin from "./NewsletterAdmin";
import { createClient } from "@/lib/supabase/server";
import type { Newsletter } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin · Newsletters — BMSCE Alumni Network",
};

export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (me?.role !== "admin") redirect("/");

  const { data: existing } = await supabase
    .from("newsletters")
    .select("*")
    .order("year", { ascending: false })
    .order("uploaded_at", { ascending: false })
    .returns<Newsletter[]>();

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
            <div className="flex items-center justify-between">
              <Eyebrow>Admin · Newsletters</Eyebrow>
              <Link
                href="/admin"
                className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-accent underline-offset-4 hover:text-maroon"
              >
                ← Verification
              </Link>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
              Upload a newsletter.
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/70">
              Add a past newsletter as a PDF and tag it with a year (and an
              optional title if there&rsquo;s more than one that year). It appears
              in the archive on the public{" "}
              <Link
                href="/newsletter"
                className="text-oxblood underline decoration-accent underline-offset-4 hover:text-maroon"
              >
                Newsletter page
              </Link>{" "}
              right away.
            </p>
            <div className="mt-10">
              <NewsletterAdmin existing={existing ?? []} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
