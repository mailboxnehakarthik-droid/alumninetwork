"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const LABEL_CLASS =
  "font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60";

export default function StartChapterButton() {
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    city: "",
    name: "",
    email: "",
    message: "",
  });

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Reset transient state when the modal is opened.
  useEffect(() => {
    if (open) {
      setStatus("idle");
      firstFieldRef.current?.focus();
    }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const { error } = await supabase.from("chapter_requests").insert({
      city: form.city.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm({ city: "", name: "", email: "", message: "" });
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ivory"
      >
        Start a chapter
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-chapter-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-gold/30 bg-ivory p-8 text-left text-ink shadow-[0_24px_64px_-24px_rgba(26,20,18,0.5)] md:p-10"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-sm text-ink/60 transition-colors hover:text-oxblood focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                  Chapter request
                </span>
                <p className="mx-auto mt-5 max-w-sm font-display text-2xl italic leading-snug text-oxblood">
                  Thanks — we&rsquo;ve got your message and will be in touch.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-8 inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                  Start a chapter
                </span>
                <h2
                  id="start-chapter-title"
                  className="mt-3 font-display text-3xl leading-[1.05] text-ink"
                >
                  Gather your city.
                </h2>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">
                  Tell us where you are and we will help you find the others.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sc-city" className={LABEL_CLASS}>
                      City
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="sc-city"
                      type="text"
                      required
                      value={form.city}
                      onChange={update("city")}
                      placeholder="Which city?"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="sc-name" className={LABEL_CLASS}>
                      Name
                    </label>
                    <input
                      id="sc-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="sc-email" className={LABEL_CLASS}>
                      Email
                    </label>
                    <input
                      id="sc-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@email.com"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="sc-message" className={LABEL_CLASS}>
                      Message
                    </label>
                    <textarea
                      id="sc-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us a little about your city and why you want to start a chapter."
                      className={`${FIELD_CLASS} resize-y`}
                    />
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="font-sans text-sm text-oxblood"
                    >
                      Something went wrong sending that — please try again in a
                      moment.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 inline-flex items-center justify-center rounded-sm bg-oxblood px-8 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending…" : "Send request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
