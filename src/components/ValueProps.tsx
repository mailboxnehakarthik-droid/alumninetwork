import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const ITEMS = [
  {
    tag: "Directory",
    title: "Find your batch",
    body: "Search the full alumni directory by batch, branch, or city — and pick up where you left off.",
    href: "/directory",
  },
  {
    tag: "Careers",
    title: "Jobs & referrals",
    body: "Alumni-only listings and warm referrals into companies where BMS graduates already work.",
    href: "/careers/jobs",
  },
  {
    tag: "Mentorship",
    title: "Find a mentor",
    body: "Get paired with someone who has already walked the path you are on, one conversation at a time.",
    href: "/careers/mentorship",
  },
  {
    tag: "Chapters",
    title: "Join your city chapter",
    body: "From Bengaluru to the Bay Area, your chapter is already meeting. Find your city.",
    href: "/chapters",
  },
];

export default function ValueProps() {
  return (
    <section className="border-t border-gold/30">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <Eyebrow>What you will find here</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] text-ink md:text-5xl">
            Four ways back in.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 border-l border-t border-gold/30 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="border-b border-r border-gold/30">
              <a href={item.href} className="group block h-full px-6 py-8 md:py-10">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                  {item.tag}
                </span>
                <h3 className="mt-4 font-display text-2xl italic text-ink">
                  {item.title}
                </h3>
                <p className="mt-4 font-sans text-sm leading-relaxed text-ink/65">
                  {item.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-oxblood">
                  Explore
                  <span
                    aria-hidden="true"
                    className="h-px w-5 bg-oxblood transition-all duration-300 group-hover:w-9"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
