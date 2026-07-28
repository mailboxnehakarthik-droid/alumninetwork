"use client";

import { useMemo, useState } from "react";
import { chapters } from "@/data/chapters";

// Photo-card grid. Chapters are shown alphabetically. They are NOT links — the
// only clickable action on the page is the global WhatsApp community CTA in the
// hero above. Each card is a full-bleed city/region photo with a dark gradient
// overlay for legibility; a brand-gradient tile sits behind the image so a
// failed image load still reads as an intentional card, not a broken one.
const SORTED = [...chapters].sort((a, b) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
);

export default function ChapterList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SORTED;
    return SORTED.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:w-80">
          <label htmlFor="chapter-search" className="sr-only">
            Search chapters
          </label>
          <input
            id="chapter-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters…"
            className="w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/55">
          {filtered.length} {filtered.length === 1 ? "chapter" : "chapters"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 border-t border-gold/30 pt-12 text-center font-display text-2xl italic text-ink">
          No chapters match &ldquo;{query}&rdquo; — yet.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {filtered.map((ch) => (
            <li key={ch.name} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-oxblood to-maroon">
                {/* Decorative city/region photo (name is the accessible label). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ch.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
                {/* Dark gradient — heaviest at the bottom where the text sits. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent transition-colors duration-300 group-hover:from-ink/95"
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-medium leading-tight text-ivory drop-shadow-sm md:text-xl">
                    {ch.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-2 block h-0.5 w-7 bg-ivory/90"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
