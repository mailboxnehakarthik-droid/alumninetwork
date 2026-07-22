"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { setApplicationStatus } from "../../actions";
import type { ApplicationStatus } from "@/lib/types";

export type ApplicantRow = {
  applicationId: string;
  status: ApplicationStatus;
  coverNote: string | null;
  appliedAt: string;
  person: {
    id: string;
    name: string;
    photoUrl: string | null;
    branch: string | null;
    gradYear: number | null;
    title: string | null;
    company: string | null;
    userType: string | null;
  };
};

const FILTERS: { key: ApplicationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "New" },
  { key: "reviewed", label: "Reviewed" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function ApplicantsClient({
  applicants,
}: {
  applicants: ApplicantRow[];
}) {
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: applicants.length };
    for (const a of applicants) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [applicants]);

  const shown = useMemo(
    () =>
      filter === "all"
        ? applicants
        : applicants.filter((a) => a.status === filter),
    [applicants, filter]
  );

  if (applicants.length === 0) {
    return (
      <div className="border border-dashed border-gold/40 bg-ivory-dim/40 px-6 py-16 text-center">
        <p className="font-display text-xl italic text-ink">No applicants yet.</p>
        <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink/65">
          When members apply, they&rsquo;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-gold/30">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`-mb-px border-b-2 px-4 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
              filter === f.key
                ? "border-oxblood text-oxblood"
                : "border-transparent text-ink/50 hover:text-oxblood"
            }`}
          >
            {f.label}
            <span className="ml-2 text-ink/35">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {shown.map((a) => (
          <ApplicantCard key={a.applicationId} row={a} />
        ))}
      </ul>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ApplicantCard({ row }: { row: ApplicantRow }) {
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const p = row.person;

  const set = (status: ApplicationStatus) => {
    setError(null);
    startTransition(async () => {
      try {
        await setApplicationStatus(row.applicationId, status);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not update.");
      }
    });
  };

  const meta = [
    p.userType === "student" ? "Student" : null,
    p.branch,
    p.gradYear ? `Class of ${p.gradYear}` : null,
    [p.title, p.company].filter(Boolean).join(", ") || null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="border border-gold/25 bg-ivory-dim/50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <Link
            href={`/directory/${p.id}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 font-display text-base italic text-oxblood transition-colors hover:border-gold"
          >
            {p.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(p.name)
            )}
          </Link>
          <div>
            <Link
              href={`/directory/${p.id}`}
              className="font-display text-xl text-ink underline decoration-gold/0 underline-offset-4 transition-colors hover:decoration-gold"
            >
              {p.name}
            </Link>
            {meta && (
              <p className="mt-1 font-sans text-sm text-ink/60">{meta}</p>
            )}
            {row.coverNote && (
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink/75">
                &ldquo;{row.coverNote}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2">
          <StatusPill status={row.status} />
          <div className="flex flex-wrap gap-2">
            {row.status !== "reviewed" && (
              <Action onClick={() => set("reviewed")} busy={busy}>
                Reviewed
              </Action>
            )}
            {row.status !== "accepted" && (
              <Action onClick={() => set("accepted")} busy={busy} primary>
                Accept
              </Action>
            )}
            {row.status !== "rejected" && (
              <Action onClick={() => set("rejected")} busy={busy}>
                Reject
              </Action>
            )}
          </div>
        </div>
      </div>
      {error && <p className="mt-3 font-sans text-sm text-oxblood">{error}</p>}
    </li>
  );
}

function Action({
  onClick,
  busy,
  primary,
  children,
}: {
  onClick: () => void;
  busy: boolean;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={
        primary
          ? "rounded-sm bg-oxblood px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
          : "rounded-sm border border-gold/50 px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-ink/70 transition-colors hover:border-oxblood hover:text-oxblood disabled:opacity-60"
      }
    >
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: ApplicationStatus }) {
  const label = {
    submitted: "New",
    reviewed: "Reviewed",
    accepted: "Accepted",
    rejected: "Rejected",
  }[status];
  const tone =
    status === "accepted"
      ? "border-gold/50 bg-gold/10 text-gold"
      : status === "rejected"
      ? "border-ink/20 bg-ink/5 text-ink/50"
      : "border-gold/40 bg-ivory/60 text-ink/60";
  return (
    <span
      className={`self-start rounded-sm border px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] ${tone}`}
    >
      {label}
    </span>
  );
}
