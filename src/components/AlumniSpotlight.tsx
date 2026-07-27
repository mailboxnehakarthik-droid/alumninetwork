import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

type SpotlightAlum = {
  name: string;
  // Title/role. Optional — omitted when we only have a name for someone.
  role?: string;
  // Batch range, e.g. "1990–1994". Rendered as "Batch of 1990–1994".
  batch?: string;
  // Optional headshot. Drop a real photo URL here later and it replaces the
  // initials square automatically — no code change needed. Do NOT scrape the
  // web for photos of these real, named people.
  photoUrl?: string;
};

// Real BMSCE alumni — name, role, and batch (no fabricated quotes or companies).
const ALUMNI: SpotlightAlum[] = [
  {
    name: "Sujith Somasundar",
    role: "Former India cricketer",
    batch: "1990–1994",
  },
  { name: "Naren", role: "CEO, Nandu Foods", batch: "1991–1995" },
  { name: "Sunil Rao", role: "MD, Roblox India", batch: "1991–1996" },
  {
    name: "Dinesh Gundu Rao",
    role: "Member of the Karnataka Legislative Assembly",
    batch: "1988–1992",
  },
  { name: "Lathika Pai", role: "Microsoft", batch: "1986–1990" },
];

// Initials for the avatar square: first + last initial (e.g. "Sujith
// Somasundar" -> "SS"), or the first two letters of a single-word name.
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Left-bar accent rotates through the three brand colors (navy / red / plum)
// so the row has rhythm instead of every card looking identical.
const ACCENTS = ["border-l-oxblood", "border-l-accent", "border-l-maroon"];

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

        {/* One horizontal scroll strip at every breakpoint — all cards sit
            next to each other rather than wrapping into a grid frame. */}
        <div className="mt-16 -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10">
          {ALUMNI.map((person, i) => (
            <Reveal
              key={person.name}
              delay={i * 80}
              className="h-full w-[78vw] shrink-0 snap-start sm:w-[320px]"
            >
              <article
                className={`flex h-full flex-col rounded-xl border border-gold/25 border-l-4 ${ACCENTS[i % ACCENTS.length]} bg-oxblood/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(47,37,68,0.4)]`}
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-maroon to-oxblood font-display text-lg italic text-ivory">
                  {person.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.photoUrl}
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(person.name)
                  )}
                </div>
                <h3 className="mt-6 font-display text-xl text-ink">
                  {person.name}
                </h3>
                {person.role && (
                  <p className="mt-1 font-sans text-sm text-ink/65">
                    {person.role}
                  </p>
                )}
                {person.batch && (
                  <p className="mt-1 font-sans text-sm text-ink/55">
                    Batch of {person.batch}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
