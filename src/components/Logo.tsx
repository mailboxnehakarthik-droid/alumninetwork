"use client";

import { useState } from "react";

// Drop the logo at public/logo.png (or .jpg / .svg / .webp) — whichever you
// save, it's picked up automatically. Until a file exists, a labeled
// placeholder shows (no broken-image icon).
const CANDIDATES = ["/logo.png", "/logo.jpg", "/logo.svg", "/logo.webp"];

export default function Logo({
  className = "h-9 w-auto",
  placeholderClassName = "h-9 w-24",
}: {
  className?: string;
  placeholderClassName?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const exhausted = idx >= CANDIDATES.length;

  return (
    <>
      {!exhausted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={CANDIDATES[idx]}
          alt="BMSCE Alumni Network"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setIdx((i) => i + 1);
          }}
          className={`${className} object-contain ${loaded ? "" : "hidden"}`}
        />
      )}
      {!loaded && (
        <span
          title="Add public/logo.png (or .jpg/.svg) to replace this placeholder"
          aria-label="BMSCE Alumni Network logo placeholder"
          className={`${placeholderClassName} flex shrink-0 items-center justify-center rounded-sm border border-dashed border-gold/60 bg-gold/5 font-sans text-[8px] font-semibold uppercase tracking-[0.1em] text-gold`}
        >
          Logo
        </span>
      )}
    </>
  );
}
