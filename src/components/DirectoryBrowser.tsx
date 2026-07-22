"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";

export type DirectoryAlum = {
  id: string;
  name: string;
  batch: number | null;
  branch: string | null;
  company: string | null;
  title: string | null;
  city: string | null;
  photoUrl: string | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function uniqueSorted<T>(values: (T | null)[]): T[] {
  return [...new Set(values.filter((v): v is T => v != null))].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true })
  );
}

const ALL = "all";

export default function DirectoryBrowser({
  alumni,
}: {
  alumni: DirectoryAlum[];
}) {
  const [query, setQuery] = useState("");
  const [batch, setBatch] = useState(ALL);
  const [branch, setBranch] = useState(ALL);
  const [city, setCity] = useState(ALL);
  const [company, setCompany] = useState(ALL);

  const batches = useMemo(
    () => uniqueSorted(alumni.map((a) => a.batch)),
    [alumni]
  );
  const branches = useMemo(
    () => uniqueSorted(alumni.map((a) => a.branch)),
    [alumni]
  );
  const cities = useMemo(() => uniqueSorted(alumni.map((a) => a.city)), [alumni]);
  const companies = useMemo(
    () => uniqueSorted(alumni.map((a) => a.company)),
    [alumni]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alumni.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.company?.toLowerCase().includes(q) ?? false);
      const matchesBatch = batch === ALL || String(a.batch) === batch;
      const matchesBranch = branch === ALL || a.branch === branch;
      const matchesCity = city === ALL || a.city === city;
      const matchesCompany = company === ALL || a.company === company;
      return (
        matchesQuery &&
        matchesBatch &&
        matchesBranch &&
        matchesCity &&
        matchesCompany
      );
    });
  }, [alumni, query, batch, branch, city, company]);

  const clearFilters = () => {
    setQuery("");
    setBatch(ALL);
    setBranch(ALL);
    setCity(ALL);
    setCompany(ALL);
  };

  // No verified alumni in the network yet.
  if (alumni.length === 0) {
    return (
      <div className="mt-4 border border-dashed border-gold/40 bg-ivory-dim/40 px-6 py-20 text-center">
        <p className="font-display text-2xl italic text-ink">
          No verified alumni yet.
        </p>
        <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink/65">
          As members join and get verified, they&rsquo;ll appear here. Check
          back soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search + filters */}
      <div className="sticky top-[88px] z-30 border-y border-gold/30 bg-ivory/90 py-5 backdrop-blur-md">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="lg:w-72">
              <label htmlFor="search" className="sr-only">
                Search by name or company
              </label>
              <input
                id="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or company…"
                className="w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex-1">
              <FilterSelect
                label="Batch"
                value={batch}
                onChange={setBatch}
                options={batches.map((b) => ({
                  value: String(b),
                  label: String(b),
                }))}
                allLabel="All years"
              />
              <FilterSelect
                label="Branch"
                value={branch}
                onChange={setBranch}
                options={branches.map((b) => ({ value: b, label: b }))}
                allLabel="All branches"
              />
              <FilterSelect
                label="City"
                value={city}
                onChange={setCity}
                options={cities.map((c) => ({ value: c, label: c }))}
                allLabel="All cities"
              />
              <FilterSelect
                label="Company"
                value={company}
                onChange={setCompany}
                options={companies.map((c) => ({ value: c, label: c }))}
                allLabel="All companies"
              />
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="group shrink-0 self-start font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-oxblood lg:self-center"
            >
              <span className="border-b border-gold pb-1 transition-colors group-hover:border-oxblood">
                Clear filters
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mt-8 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/55">
        Showing {filtered.length} of {alumni.length} alumni
      </p>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="mt-10 border border-dashed border-gold/40 bg-ivory-dim/40 px-6 py-20 text-center">
          <p className="font-display text-2xl italic text-ink">
            No alumni match those filters — try clearing a few.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((alum, i) => (
            <AlumCard key={alum.id} alum={alum} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <div>
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-3 py-2.5 font-sans text-sm text-ink transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <option value={ALL}>{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AlumCard({ alum, index }: { alum: DirectoryAlum; index: number }) {
  const roleLine = [alum.title, alum.company].filter(Boolean).join(", ");
  const batchLine = [
    alum.batch ? `Batch of ${alum.batch}` : null,
    alum.branch,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Reveal delay={Math.min(index, 8) * 60} className="h-full">
      <Link
        href={`/directory/${alum.id}`}
        className="flex h-full flex-col border border-gold/25 bg-ivory-dim/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60"
      >
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-gold/40 font-display text-lg italic text-oxblood">
          {alum.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={alum.photoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials(alum.name)
          )}
        </div>
        <h3 className="mt-6 font-display text-xl text-ink">{alum.name}</h3>
        {roleLine && (
          <p className="mt-1 font-sans text-sm text-ink/65">{roleLine}</p>
        )}
        {batchLine && (
          <p className="mt-3 font-sans text-sm text-ink/55">{batchLine}</p>
        )}
        {alum.city && (
          <p className="mt-auto pt-5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
            {alum.city}
          </p>
        )}
      </Link>
    </Reveal>
  );
}
