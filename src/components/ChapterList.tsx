"use client";

import { useMemo, useState } from "react";
import { chapters } from "@/data/chapters";

// Chapters are listed plainly, alphabetically. They are NOT links — the only
// clickable action on the page is the global WhatsApp community CTA. Don't add
// per-chapter links here without real per-city join URLs.
const SORTED = [...chapters].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

export default function ChapterList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SORTED;
    return SORTED.filter((c) => c.toLowerCase().includes(q));
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
        <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-gold/30 pt-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((city) => (
            <li
              key={city}
              className="flex items-center gap-2.5 font-sans text-sm text-ink/80"
            >
              <span aria-hidden="true" className="h-px w-3 shrink-0 bg-gold" />
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
