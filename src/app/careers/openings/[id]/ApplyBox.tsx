"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { applyToPosting } from "../../actions";
import { STATUS_LABEL } from "@/components/PostingsBrowser";
import type { ApplicationStatus } from "@/lib/types";

type State =
  | { kind: "anon" }
  | { kind: "unverified" }
  | { kind: "owner" }
  | { kind: "applied"; status: ApplicationStatus }
  | { kind: "can-apply" };

export default function ApplyBox({
  jobId,
  state,
  externalLink,
}: {
  jobId: string;
  state: State;
  externalLink: string | null;
}) {
  const [note, setNote] = useState("");
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        await applyToPosting(jobId, note);
        setDone(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not apply.");
      }
    });
  };

  const shell = "border border-gold/30 bg-ivory-dim/50 p-6 md:p-8";

  if (done || state.kind === "applied") {
    const status = done ? "submitted" : (state as { status: ApplicationStatus }).status;
    return (
      <div className={shell}>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
          Your application
        </p>
        <p className="mt-3 font-display text-2xl italic text-oxblood">
          {STATUS_LABEL[status]}
        </p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">
          {status === "submitted"
            ? "You've applied — the poster can see your profile and note."
            : status === "reviewed"
            ? "The poster has looked at your application."
            : status === "accepted"
            ? "You've been accepted for this role. Expect to hear from them."
            : "You weren't selected for this one. Plenty more on the board."}
        </p>
      </div>
    );
  }

  if (state.kind === "owner") {
    return (
      <div className={shell}>
        <p className="font-sans text-sm text-ink/70">
          This is your posting.
        </p>
        <Link
          href="/careers/my-postings"
          className="mt-4 inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon"
        >
          View applicants
        </Link>
      </div>
    );
  }

  if (state.kind === "anon") {
    return (
      <div className={shell}>
        <p className="font-sans text-sm text-ink/70">
          Sign in to apply to this opening.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (state.kind === "unverified") {
    return (
      <div className={shell}>
        <p className="font-sans text-sm text-ink/70">
          Your account needs to be verified before you can apply.
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60">
        Apply
      </p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink/65">
        One step — your profile is already on file. Add a short note if
        you&rsquo;d like.
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Why you're a fit (optional)…"
        className="mt-4 min-h-[120px] w-full resize-y rounded-sm border border-gold/40 bg-ivory/60 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
      />
      {error && <p className="mt-3 font-sans text-sm text-oxblood">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="rounded-sm bg-oxblood px-7 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
        >
          {busy ? "Sending…" : "Submit application"}
        </button>
        {externalLink && (
          <a
            href={externalLink}
            target="_blank"
            rel="noreferrer"
            className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood underline decoration-gold underline-offset-4 hover:text-maroon"
          >
            Apply on company site →
          </a>
        )}
      </div>
    </div>
  );
}
