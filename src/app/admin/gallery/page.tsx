import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import GalleryAdmin from "./GalleryAdmin";
import { createClient } from "@/lib/supabase/server";
import type { GalleryPhoto } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin · Gallery — BMSCE Alumni Network",
};

export const dynamic = "force-dynamic";

// How many recent photos the admin management list shows/lets you delete
// from here. The public gallery itself has no such cap — it paginates
// through everything via infinite scroll.
const RECENT_LIMIT = 60;

export default async function AdminGalleryPage() {
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
    .from("gallery_photos")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(RECENT_LIMIT)
    .returns<GalleryPhoto[]>();

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
            <div className="flex items-center justify-between">
              <Eyebrow>Admin · Gallery</Eyebrow>
              <Link
                href="/admin"
                className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-accent underline-offset-4 hover:text-maroon"
              >
                ← Verification
              </Link>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
              Upload photos.
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/70">
              Select or drag in as many photos as you like — they&rsquo;re
              resized and compressed in your browser before upload, so large
              batches upload reliably. They appear on the public{" "}
              <Link
                href="/gallery"
                className="text-oxblood underline decoration-accent underline-offset-4 hover:text-maroon"
              >
                Gallery page
              </Link>{" "}
              right away.
            </p>
            <div className="mt-10">
              <GalleryAdmin existing={existing ?? []} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
