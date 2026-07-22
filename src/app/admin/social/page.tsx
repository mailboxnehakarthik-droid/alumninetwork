import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import AddSocialPost from "./AddSocialPost";
import { createClient } from "@/lib/supabase/server";
import type { SocialPost } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin · Social posts — BMS Alumni Network",
};

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
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

  const { data: recent } = await supabase
    .from("social_posts")
    .select("*")
    .eq("post_type", "Manual")
    .order("created_at", { ascending: false })
    .limit(20)
    .returns<SocialPost[]>();

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
            <div className="flex items-center justify-between">
              <Eyebrow>Admin · Social</Eyebrow>
              <Link
                href="/admin"
                className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-gold underline-offset-4 hover:text-maroon"
              >
                ← Verification
              </Link>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
              Add an Instagram post.
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/70">
              Paste a post&rsquo;s Instagram link (and optionally an image and
              caption). It appears in the &ldquo;From our Instagram&rdquo;
              section on the Events page. The 168 historical posts are already
              imported and aren&rsquo;t listed here.
            </p>
            <div className="mt-10">
              <AddSocialPost recent={recent ?? []} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
