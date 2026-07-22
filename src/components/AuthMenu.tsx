"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "signedout" }
  | { status: "signedin"; profile: Profile | null };

// Desktop auth control for the nav: Sign in / Join when logged out; an avatar
// menu (Profile, Admin, Sign out) when logged in.
export default function AuthMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setState({ status: "signedout" });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<Profile>();
      if (!active) return;
      setState({ status: "signedin", profile: profile ?? null });
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  // --- Mobile variant: simple stacked links ---
  if (variant === "mobile") {
    if (state.status === "signedin") {
      const p = state.profile;
      return (
        <div className="flex flex-col gap-3">
          <Link
            href="/profile"
            className="pl-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-ink/80"
          >
            My profile
          </Link>
          {p?.role === "admin" && (
            <Link
              href="/admin"
              className="pl-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-ink/80"
            >
              Admin
            </Link>
          )}
          <button
            onClick={signOut}
            className="rounded-sm bg-oxblood px-5 py-3 text-center font-sans text-sm font-medium uppercase tracking-[0.12em] text-ivory"
          >
            Sign out
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="pl-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-ink/80"
        >
          Sign in
        </Link>
        <Link
          href="/login"
          className="rounded-sm bg-oxblood px-5 py-3 text-center font-sans text-sm font-medium uppercase tracking-[0.12em] text-ivory"
        >
          Join
        </Link>
      </div>
    );
  }

  // --- Desktop variant ---
  if (state.status === "loading") {
    return <div className="h-9 w-24" aria-hidden="true" />;
  }

  if (state.status === "signedout") {
    return (
      <>
        <Link
          href="/login"
          className="font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-ink/75 transition-colors hover:text-oxblood"
        >
          Sign in
        </Link>
        <Link
          href="/login"
          className="rounded-sm bg-oxblood px-5 py-2.5 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-maroon"
        >
          Join
        </Link>
      </>
    );
  }

  const p = state.profile;
  const initial = (p?.full_name || "?").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gold/50 bg-ivory-dim transition-colors hover:border-gold"
      >
        {p?.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-sm italic text-oxblood">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 min-w-[200px] overflow-hidden rounded-sm border border-gold/30 bg-ivory shadow-[0_12px_32px_-14px_rgba(26,20,18,0.3)]">
          <div className="border-b border-gold/20 px-4 py-3">
            <p className="font-sans text-sm font-medium text-ink">
              {p?.full_name || "Your profile"}
            </p>
            <p className="mt-0.5 font-sans text-[11px] uppercase tracking-[0.12em] text-gold">
              {p?.user_type === "student"
                ? "Student"
                : p?.verification_status === "verified"
                ? "Verified alum"
                : p?.verification_status === "rejected"
                ? "Not approved"
                : "Pending review"}
            </p>
          </div>
          <ul>
            <MenuLink href="/profile" onClick={() => setOpen(false)}>
              My profile
            </MenuLink>
            {p?.role === "admin" && (
              <MenuLink href="/admin" onClick={() => setOpen(false)}>
                Admin dashboard
              </MenuLink>
            )}
            <li>
              <button
                onClick={signOut}
                className="block w-full px-4 py-2.5 text-left font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-oxblood/80 transition-colors hover:bg-gold/10 hover:text-oxblood"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="block px-4 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-ink/75 transition-colors hover:bg-gold/10 hover:text-oxblood"
      >
        {children}
      </Link>
    </li>
  );
}
