import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import type { Newsletter } from "@/lib/types";

export const metadata: Metadata = {
  title: "Newsletter — BMSCE Alumni Network",
  description:
    "The BMSCE Alumni Network newsletter archive — past editions to read and download, chapter meetups, alumni wins, and opportunities.",
};

export const dynamic = "force-dynamic";

const EXPECT = [
  {
    tag: "Community",
    title: "Chapter highlights",
    body: "Where alumni are gathering next — meetups, reunions, and city-chapter news from around the world.",
  },
  {
    tag: "People",
    title: "Alumni spotlights",
    body: "Short profiles of graduates doing remarkable things, wherever their BMS degree has taken them.",
  },
];

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("newsletters")
    .select("*")
    .order("year", { ascending: false })
    .order("uploaded_at", { ascending: false })
    .returns<Newsletter[]>();

  const newsletters = data ?? [];

  // Group by year (already sorted year desc, then newest upload first) so
  // multiple editions in the same year sit together under one heading.
  const byYear: { year: number; items: Newsletter[] }[] = [];
  for (const n of newsletters) {
    const last = byYear[byYear.length - 1];
    if (last && last.year === n.year) last.items.push(n);
    else byYear.push({ year: n.year, items: [n] });
  }

  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 text-center md:px-10 md:pb-20 md:pt-24">
            <Reveal>
              <Eyebrow align="center">Newsletter</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] tracking-tight text-ink">
                News from the network.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/70 md:text-lg">
                Chapter meetups, alumni wins, and opportunities — a few times a
                year. Read every past edition below.
              </p>
            </Reveal>
          </div>
        </section>

        {/* The archive (replaces the old signup form) */}
        <section className="border-t border-gold/30">
          <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <Eyebrow>The archive</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-4xl leading-[1.05] text-ink md:text-5xl">
                Past editions.
              </h2>
            </Reveal>

            {byYear.length === 0 ? (
              <Reveal delay={160}>
                <div className="mt-12 border border-gold/30 bg-ivory-dim/40 px-6 py-16 text-center">
                  <p className="font-display text-2xl italic text-oxblood">
                    Newsletter archive coming soon.
                  </p>
                  <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-ink/60">
                    Past editions will appear here as they&rsquo;re published.
                    Check back shortly.
                  </p>
                </div>
              </Reveal>
            ) : (
              <div className="mt-12 border-t border-gold/30">
                {byYear.map((group, gi) => (
                  <Reveal key={group.year} delay={gi * 80}>
                    <div className="grid grid-cols-1 gap-4 border-b border-gold/30 py-8 sm:grid-cols-[6rem_1fr] sm:gap-8">
                      <div className="font-display text-3xl text-oxblood">
                        {group.year}
                      </div>
                      <ul className="flex flex-col gap-4">
                        {group.items.map((n) => (
                          <li key={n.id}>
                            <a
                              href={n.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex items-baseline justify-between gap-4 border-b border-gold/15 pb-4 last:border-0 last:pb-0"
                            >
                              <span className="font-display text-xl italic text-ink transition-colors group-hover:text-oxblood">
                                {n.title || `${group.year} Edition`}
                              </span>
                              <span className="shrink-0 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-oxblood underline decoration-accent underline-offset-4 group-hover:text-maroon">
                                View PDF →
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-oxblood text-ivory">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <Eyebrow tone="ivory">What to expect</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] text-ivory md:text-5xl">
                A few times a year, worth the wait.
              </h2>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 border-l border-t border-ivory/15 sm:grid-cols-2">
              {EXPECT.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={i * 90}
                  className="border-b border-r border-ivory/15"
                >
                  <div className="h-full px-6 py-8 md:py-10">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
                      {item.tag}
                    </span>
                    <h3 className="mt-4 font-display text-2xl italic text-ivory">
                      {item.title}
                    </h3>
                    <p className="mt-4 font-sans text-sm leading-relaxed text-ivory/70">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
