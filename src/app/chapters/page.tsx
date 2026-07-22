import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import ChapterList from "@/components/ChapterList";
import StartChapterButton from "@/components/StartChapterButton";
import { featuredChapters } from "@/data/chapters";

export const metadata: Metadata = {
  title: "Chapters — BMS Alumni Network",
  description:
    "Find your city. BMS alumni chapters meet in Bengaluru, London, San Francisco, and dozens of cities worldwide.",
};

function memberLabel(members: number) {
  if (members >= 1000) {
    return `${(members / 1000).toFixed(members % 1000 === 0 ? 0 : 1)}k members`;
  }
  return `${members} members`;
}

export default function ChaptersPage() {
  return (
    <>
      <Nav />
      <main>
        <section id="top">
          <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-10 md:pb-14 md:pt-24">
            <Reveal>
              <Eyebrow>Chapters</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] tracking-tight text-ink">
                Find your city.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/70 md:text-lg">
                Wherever you have landed, there is likely a table of BMS alumni
                already meeting nearby. Here is where to find them.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Featured chapters */}
        <section>
          <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredChapters.map((chapter, i) => (
                <Reveal
                  key={chapter.city}
                  delay={Math.min(i, 6) * 70}
                  className="h-full"
                >
                  <a
                    href="#"
                    className="group relative flex aspect-[4/5] h-full flex-col justify-end overflow-hidden rounded-sm border border-gold/25 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60"
                    style={{
                      backgroundImage: `linear-gradient(160deg, ${chapter.gradient[0]}, ${chapter.gradient[1]})`,
                    }}
                  >
                    {/* Readability scrim */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent"
                    />
                    <span className="relative z-10 w-fit rounded-full border border-ivory/30 bg-ink/20 px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ivory/90 backdrop-blur-sm">
                      {memberLabel(chapter.members)}
                    </span>
                    <h2 className="relative z-10 mt-4 font-display text-3xl text-ivory">
                      {chapter.city}
                    </h2>
                    <p className="relative z-10 mt-1 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                      {chapter.country}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* All chapters list */}
        <section className="border-t border-gold/30">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <Reveal>
              <Eyebrow>All chapters</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] text-ink md:text-5xl">
                Every city, one list.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-12">
                <ChapterList />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Start a chapter */}
        <section className="bg-oxblood text-ivory">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:px-10 md:py-28">
            <Reveal>
              <Eyebrow tone="ivory" align="center">
                Don&rsquo;t see your city?
              </Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-4xl leading-[1.05] text-ivory md:text-5xl">
                Start the table yourself.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-md font-sans text-base leading-relaxed text-ivory/75">
                It takes one person to gather a city. We will help you find the
                others and get the first meetup on the calendar.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10">
                <StartChapterButton />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
