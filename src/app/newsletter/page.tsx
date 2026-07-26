import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter — BMSCE Alumni Network",
  description:
    "News from the network — chapter meetups, alumni wins, and opportunities, a few times a year.",
};

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
  {
    tag: "Careers",
    title: "Jobs & opportunities",
    body: "Alumni-only openings, referrals, and mentorship calls — shared before they go anywhere else.",
  },
];

export default function NewsletterPage() {
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
                year, never more.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-gold/30">
          <div className="mx-auto max-w-2xl px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <NewsletterSignup />
            </Reveal>
          </div>
        </section>

        <section className="border-t border-gold/30">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <Eyebrow>What to expect</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] text-ink md:text-5xl">
                A few times a year, worth the wait.
              </h2>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 border-l border-t border-gold/30 sm:grid-cols-3">
              {EXPECT.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={i * 90}
                  className="border-b border-r border-gold/30"
                >
                  <div className="h-full px-6 py-8 md:py-10">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                      {item.tag}
                    </span>
                    <h3 className="mt-4 font-display text-2xl italic text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-4 font-sans text-sm leading-relaxed text-ink/65">
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
