"use client";

import { useMemo, useState } from "react";
import { chapterRegions } from "@/data/chapters";

export default function ChapterList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapterRegions;
    return chapterRegions
      .map((region) => ({
        ...region,
        cities: region.cities.filter((c) => c.toLowerCase().includes(q)),
      }))
      .filter((region) => region.cities.length > 0);
  }, [query]);

  const total = useMemo(
    () => filtered.reduce((sum, r) => sum + r.cities.length, 0),
    [filtered]
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:w-80">
          <label htmlFor="chapter-search" className="sr-only">
            Search chapters by city
          </label>
          <input
            id="chapter-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city…"
            className="w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          />
        </div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/55">
          {total} {total === 1 ? "city" : "cities"}
        </p>
      </div>

      {total === 0 ? (
        <p className="mt-12 border-t border-gold/30 pt-12 text-center font-display text-2xl italic text-ink">
          No chapters match &ldquo;{query}&rdquo; — yet.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-12">
          {filtered.map((region) => (
            <div
              key={region.region}
              className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-gold/30 pt-8 md:grid-cols-[220px_1fr]"
            >
              <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                {region.region}
              </h3>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
                {region.cities.map((city) => (
                  <li key={city}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-2 font-sans text-sm text-ink/75 transition-colors hover:text-oxblood"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-3 bg-gold transition-all duration-300 group-hover:w-5"
                      />
                      {city}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
