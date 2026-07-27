"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const FIELD =
  "w-full rounded-sm border border-gold/40 bg-ivory-dim/40 px-4 py-3.5 font-sans text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const COLLEGE_DOMAIN = "@bmsce.ac.in";
const MIN_PASSWORD = 8;

type Method = "magic" | "password";
type PwMode = "signin" | "signup";

export default function EmailAuth({
  userType = "alumni",
  next = "/",
}: {
  userType?: "alumni" | "student";
  next?: string;
}) {
  const router = useRouter();
  // Callback URL for link-based flows (magic link, signup confirmation), with
  // the post-login destination carried through when it isn't the default.
  const callbackUrl =
    next !== "/"
      ? `${
          typeof window !== "undefined" ? window.location.origin : ""
        }/auth/callback?next=${encodeURIComponent(next)}`
      : `${
          typeof window !== "undefined" ? window.location.origin : ""
        }/auth/callback`;
  const [method, setMethod] = useState<Method>("magic");
  const [pwMode, setPwMode] = useState<PwMode>("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isCollege = email.trim().toLowerCase().endsWith(COLLEGE_DOMAIN);

  const rememberType = () => {
    try {
      window.localStorage.setItem("pending_user_type", userType);
    } catch {
      // ignore
    }
  };

  // ---- Magic link -----------------------------------------------------------
  const sendMagicLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    rememberType();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true,
      },
    });
    setBusy(false);
    if (error) return setError(error.message);
    setNotice(
      `We sent a sign-in link to ${email.trim()}. Open it on this device to continue.`
    );
  };

  // ---- Password -------------------------------------------------------------
  const routeAfterAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    const { data: prof } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();
    router.push(prof?.onboarded ? next : "/onboarding");
    router.refresh();
  };

  const submitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (pwMode === "signup") {
      if (password.length < MIN_PASSWORD) {
        return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      }
      if (password !== confirm) {
        return setError("Passwords don't match.");
      }
    }

    setBusy(true);
    rememberType();
    const supabase = createClient();

    if (pwMode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: callbackUrl },
      });
      setBusy(false);
      if (error) return setError(error.message);
      // If email confirmation is required, there's no session yet.
      if (!data.session) {
        setNotice(
          `Almost there — check ${email.trim()} for a link to confirm your account, then sign in.`
        );
        return;
      }
      await routeAfterAuth();
      return;
    }

    // sign in
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return setError(error.message);
    await routeAfterAuth();
  };

  const sendReset = async () => {
    if (!email.trim()) {
      return setError("Enter your email above first, then tap “Forgot password”.");
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery&next=/auth/reset`,
    });
    setBusy(false);
    if (error) return setError(error.message);
    setNotice(`We sent a password-reset link to ${email.trim()}.`);
  };

  // ---- Rendered notice (terminal state for link-based flows) ----------------
  if (notice) {
    return (
      <div
        role="status"
        className="rounded-sm border border-gold/40 bg-ivory-dim/40 px-5 py-6 text-center"
      >
        <p className="font-display text-xl italic text-oxblood">
          Check your inbox.
        </p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">
          {notice}
        </p>
        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setPassword("");
            setConfirm("");
          }}
          className="mt-4 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-oxblood/70 underline decoration-accent underline-offset-4 hover:text-oxblood"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Method switch */}
      <div className="inline-flex self-start rounded-sm border border-gold/40 p-1">
        {(["magic", "password"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMethod(m);
              setError(null);
            }}
            className={`rounded-[2px] px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
              method === m
                ? "bg-oxblood text-ivory"
                : "text-ink/70 hover:text-oxblood"
            }`}
          >
            {m === "magic" ? "Magic link" : "Password"}
          </button>
        ))}
      </div>

      {method === "magic" ? (
        <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userType === "student" ? "you@bmsce.ac.in" : "you@email.com"}
            className={FIELD}
            aria-label="Email address"
          />
          {userType === "student" && (
            <p className="font-sans text-xs leading-relaxed text-ink/55">
              Use your <span className="font-medium">@bmsce.ac.in</span> college
              email — it verifies you as a current student instantly.
            </p>
          )}
          {error && <p className="font-sans text-sm text-oxblood">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
          >
            {busy ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitPassword} className="flex flex-col gap-3">
          {/* signin / signup switch */}
          <div className="flex gap-4 font-sans text-[12px] font-medium uppercase tracking-[0.12em]">
            {(["signup", "signin"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setPwMode(mode);
                  setError(null);
                }}
                className={`pb-1 transition-colors ${
                  pwMode === mode
                    ? "border-b border-gold text-oxblood"
                    : "text-ink/50 hover:text-oxblood"
                }`}
              >
                {mode === "signup" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userType === "student" ? "you@bmsce.ac.in" : "you@email.com"}
            className={FIELD}
            aria-label="Email address"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={pwMode === "signup" ? "new-password" : "current-password"}
            className={FIELD}
            aria-label="Password"
          />
          {pwMode === "signup" && (
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              className={FIELD}
              aria-label="Confirm password"
            />
          )}

          {pwMode === "signup" && userType === "student" && isCollege && (
            <p className="font-sans text-xs leading-relaxed text-ink/55">
              Signing up with your college email verifies you as a student.
            </p>
          )}

          {error && <p className="font-sans text-sm text-oxblood">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center rounded-sm bg-oxblood px-6 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon disabled:opacity-60"
          >
            {busy
              ? "Working…"
              : pwMode === "signup"
              ? "Create account"
              : "Sign in"}
          </button>

          {pwMode === "signin" && (
            <button
              type="button"
              onClick={sendReset}
              disabled={busy}
              className="self-start font-sans text-xs text-ink/55 underline decoration-accent underline-offset-4 transition-colors hover:text-oxblood disabled:opacity-60"
            >
              Forgot password?
            </button>
          )}
        </form>
      )}
    </div>
  );
}
