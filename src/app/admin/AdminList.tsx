"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@/lib/types";
import {
  approveMember,
  rejectMember,
  resetMemberToPending,
} from "./actions";

type Tab = "pending" | "rejected" | "verified";

export default function AdminList({
  members,
  tab,
}: {
  members: Profile[];
  tab: Tab;
}) {
  if (members.length === 0) {
    return (
      <div className="border border-dashed border-gold/40 bg-ivory-dim/40 px-6 py-16 text-center">
        <p className="font-display text-xl italic text-ink">
          {tab === "pending"
            ? "No one's waiting for review."
            : tab === "rejected"
            ? "No rejected members."
            : "No verified members yet."}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {members.map((m) => (
        <MemberCard key={m.id} member={m} tab={tab} />
      ))}
    </ul>
  );
}

function MemberCard({ member, tab }: { member: Profile; tab: Tab }) {
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  };

  const detail = [
    member.job_title,
    member.company,
  ]
    .filter(Boolean)
    .join(", ");
  const meta = [
    member.graduation_year ? `Batch of ${member.graduation_year}` : null,
    member.branch,
    member.current_city,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="border border-gold/25 bg-ivory-dim/50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 font-display text-base italic text-oxblood">
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (member.full_name || "?").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">
              {member.full_name || "Unnamed member"}
              {member.user_type === "student" && (
                <span className="ml-2 align-middle font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-gold">
                  Student
                </span>
              )}
            </h3>
            {detail && (
              <p className="mt-1 font-sans text-sm text-ink/70">{detail}</p>
            )}
            {meta && (
              <p className="mt-1 font-sans text-sm text-ink/55">{meta}</p>
            )}
            {member.bio && (
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink/65">
                {member.bio}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-sans text-xs text-ink/55">
              {member.personal_email && <span>{member.personal_email}</span>}
              {member.college_email && <span>{member.college_email}</span>}
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-oxblood underline decoration-gold underline-offset-2"
                >
                  LinkedIn
                </a>
              )}
            </div>
            {member.rejection_reason && (
              <p className="mt-3 font-sans text-xs italic text-oxblood/80">
                Rejection note: {member.rejection_reason}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col items-stretch gap-2">
          {tab !== "verified" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => approveMember(member.id))}
              className="rounded-sm bg-oxblood px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
            >
              {tab === "rejected" ? "Approve anyway" : "Approve"}
            </button>
          )}
          {tab === "pending" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => setRejecting((v) => !v)}
              className="rounded-sm border border-gold/50 px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ink/75 transition-colors hover:border-oxblood hover:text-oxblood disabled:opacity-60"
            >
              Reject
            </button>
          )}
          {tab === "verified" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => resetMemberToPending(member.id))}
              className="rounded-sm border border-gold/50 px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ink/75 transition-colors hover:border-oxblood hover:text-oxblood disabled:opacity-60"
            >
              Move to pending
            </button>
          )}
        </div>
      </div>

      {rejecting && tab === "pending" && (
        <div className="mt-4 flex flex-col gap-3 border-t border-gold/20 pt-4 sm:flex-row">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional reason (shown to the member)…"
            className="flex-1 rounded-sm border border-gold/40 bg-ivory/60 px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(async () => {
                await rejectMember(member.id, reason);
                setRejecting(false);
                setReason("");
              })
            }
            className="rounded-sm bg-oxblood px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
          >
            Confirm reject
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 font-sans text-sm text-oxblood">{error}</p>
      )}
    </li>
  );
}
