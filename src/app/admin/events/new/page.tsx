import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import EventForm from "../EventForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New event — BMSCE Alumni Network",
};

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
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

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
            <div className="flex items-center justify-between">
              <Eyebrow>Admin · Events</Eyebrow>
              <Link
                href="/admin/events"
                className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-gold underline-offset-4 hover:text-maroon"
              >
                ← All events
              </Link>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
              Create an event.
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/70">
              Only a title and a date are required — fill in the rest if you
              have it.
            </p>
            <div className="mt-10">
              <EventForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
