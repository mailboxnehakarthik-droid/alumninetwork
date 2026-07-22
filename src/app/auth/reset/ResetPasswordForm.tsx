"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const FIELD =
  "w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-3.5 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const MIN_PASSWORD = 8;

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  // The reset link (via /auth/callback) establishes a recovery session. Confirm
  // we actually have one before letting them submit.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setReady(!!data.user);
    });
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD) {
      return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
    }
    if (password !== confirm) {
      return setError("Passwords don't match.");
    }
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-sm border border-gold/40 bg-ivory-dim/40 px-6 py-8 text-center">
        <p className="font-display text-xl italic text-oxblood">
          Password updated.
        </p>
        <button
          type="button"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          className="mt-6 inline-flex items-center justify-center rounded-sm bg-oxblood px-8 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-maroon"
        >
          Continue
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <p className="rounded-sm border border-gold/30 bg-ivory-dim/40 px-4 py-3 font-sans text-sm text-ink/70">
        Open this page from the password-reset link in your email. If you got
        here directly, request a new link from the sign-in screen.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        autoComplete="new-password"
        className={FIELD}
        aria-label="New password"
      />
      <input
        type="password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm new password"
        autoComplete="new-password"
        className={FIELD}
        aria-label="Confirm new password"
      />
      {error && <p className="font-sans text-sm text-oxblood">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
      >
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
