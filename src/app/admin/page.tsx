import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import AdminList from "./AdminList";
import { createClient } from "@/lib/supabase/server";
import type { Profile, VerificationStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin — BMS Alumni Network",
};

export const dynamic = "force-dynamic";

type Tab = "pending" | "rejected" | "verified";

const TABS: { key: Tab; label: string; status: VerificationStatus }[] = [
  { key: "pending", label: "Pending", status: "unverified" },
  { key: "rejected", label: "Rejected", status: "rejected" },
  { key: "verified", label: "Verified", status: "verified" },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (me?.role !== "admin") {
    return (
      <>
        <Nav />
        <main>
          <section id="top">
            <div className="mx-auto max-w-2xl px-6 py-32 text-center">
              <Eyebrow align="center">Admin</Eyebrow>
              <h1 className="mt-6 font-display text-4xl text-ink">
                Not authorized.
              </h1>
              <p className="mt-4 font-sans text-base text-ink/70">
                This area is for network administrators only.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex items-center justify-center rounded-sm bg-oxblood px-7 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon"
              >
                Back home
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const tabKey = ((await searchParams).tab ?? "pending") as Tab;
  const active = TABS.find((t) => t.key === tabKey) ?? TABS[0];

  // Counts for the tab labels.
  const counts: Record<Tab, number> = {
    pending: 0,
    rejected: 0,
    verified: 0,
  };
  await Promise.all(
    TABS.map(async (t) => {
      let q = supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("verification_status", t.status);
      if (t.key !== "rejected") q = q.eq("user_type", "alumni");
      const { count } = await q;
      counts[t.key] = count ?? 0;
    })
  );

  let listQuery = supabase
    .from("profiles")
    .select("*")
    .eq("verification_status", active.status)
    .order("created_at", { ascending: false });
  // Rejected can include students too; pending/verified lists are alumni.
  if (active.key !== "rejected") {
    listQuery = listQuery.eq("user_type", "alumni");
  }
  const { data: members } = await listQuery.returns<Profile[]>();
  const memberList = members ?? [];

  // Contact info lives in member_contacts now; admins may read all of it.
  const contacts: Record<
    string,
    { personal_email: string | null; college_email: string | null }
  > = {};
  if (memberList.length) {
    const { data: contactRows } = await supabase
      .from("member_contacts")
      .select("member_id, personal_email, college_email")
      .in(
        "member_id",
        memberList.map((m) => m.id)
      );
    for (const c of contactRows ?? [])
      contacts[c.member_id as string] = {
        personal_email: (c.personal_email as string) ?? null,
        college_email: (c.college_email as string) ?? null,
      };
  }

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
            <div className="flex items-center justify-between">
              <Eyebrow>Admin</Eyebrow>
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="/admin/events"
                  className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-gold underline-offset-4 hover:text-maroon"
                >
                  Events →
                </Link>
                <Link
                  href="/admin/reports"
                  className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-gold underline-offset-4 hover:text-maroon"
                >
                  Reports →
                </Link>
                <Link
                  href="/admin/social"
                  className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-gold underline-offset-4 hover:text-maroon"
                >
                  Social posts →
                </Link>
              </div>
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
              Member verification.
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/70">
              Review alumni who&rsquo;ve completed their profile. Approving adds
              them to the directory; rejecting hides them with an optional note.
            </p>

            {/* Tabs */}
            <div className="mt-10 flex gap-1 border-b border-gold/30">
              {TABS.map((t) => (
                <Link
                  key={t.key}
                  href={`/admin?tab=${t.key}`}
                  className={`-mb-px border-b-2 px-4 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
                    active.key === t.key
                      ? "border-oxblood text-oxblood"
                      : "border-transparent text-ink/55 hover:text-oxblood"
                  }`}
                >
                  {t.label}
                  <span className="ml-2 text-ink/40">{counts[t.key]}</span>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <AdminList
                members={memberList}
                contacts={contacts}
                tab={active.key}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
