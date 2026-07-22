import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const ALUMNI = [
  {
    initials: "AR",
    name: "Ananya Rao",
    role: "Product Lead, Stripe",
    meta: "Batch of 2014 · San Francisco",
    quote: "The chapter dinner in SF is where I met my co-founder.",
  },
  {
    initials: "KV",
    name: "Karthik Venkatesh",
    role: "Founder, Loom Robotics",
    meta: "Batch of 2009 · Bengaluru",
    quote: "Three of my first five hires were BMS referrals.",
  },
  {
    initials: "SP",
    name: "Sara Pinto",
    role: "Research Scientist, DeepMind",
    meta: "Batch of 2017 · London",
    quote: "My mentor here talked me through the PhD decision.",
  },
  {
    initials: "MI",
    name: "Mohammed Irfan",
    role: "VP Engineering, Razorpay",
    meta: "Batch of 2011 · Bengaluru",
    quote: "I still recognize the campus in every hire I make.",
  },
  {
    initials: "TN",
    name: "Tara Nair",
    role: "Architect, Nair & Bloom Studio",
    meta: "Batch of 2016 · Singapore",
    quote: "Found my first client through the directory, month one.",
  },
];

export default function AlumniSpotlight() {
  return (
    <section className="border-t border-gold/30">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <Eyebrow>Where they are now</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] text-ink md:text-5xl">
                Out in the world, still in the fold.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 lg:grid-cols-5">
          {ALUMNI.map((person, i) => (
            <Reveal
              key={person.name}
              delay={i * 80}
              className="h-full w-[78vw] shrink-0 snap-start sm:w-[45vw] md:w-auto"
            >
              <article className="flex h-full flex-col border border-gold/25 bg-ivory-dim/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60">
                <div className="flex h-14 w-14 items-center justify-center border border-gold/40 font-display text-lg italic text-oxblood">
                  {person.initials}
                </div>
                <h3 className="mt-6 font-display text-xl text-ink">
                  {person.name}
                </h3>
                <p className="mt-1 font-sans text-sm text-ink/65">
                  {person.role}
                </p>
                <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
                  {person.meta}
                </p>
                <p className="mt-5 font-display text-base italic leading-snug text-ink/75">
                  &ldquo;{person.quote}&rdquo;
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
