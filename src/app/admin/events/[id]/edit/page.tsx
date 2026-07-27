import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import EventForm from "../../EventForm";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Edit event — BMSCE Alumni Network",
};

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle<EventRow>();
  if (!event) notFound();

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
                className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-accent underline-offset-4 hover:text-maroon"
              >
                ← All events
              </Link>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
              Edit event.
            </h1>
            <div className="mt-10">
              <EventForm event={event} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
