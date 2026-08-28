"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import GalleryLightbox from "./GalleryLightbox";
import type { GalleryPhoto } from "@/lib/types";

// Batch size for both the initial server-rendered page and every subsequent
// infinite-scroll fetch. Keeping the grid's DOM to "however many batches
// have been scrolled past" (rather than every photo at once) plus
// next/image's built-in lazy loading is what keeps this smooth into the
// hundreds — see the code comment on the sentinel/IntersectionObserver below.
export const GALLERY_PAGE_SIZE = 40;

export default function GalleryGrid({
  initialPhotos,
  initialHasMore,
}: {
  initialPhotos: GalleryPhoto[];
  initialHasMore: boolean;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoadingMore(true);

    const supabase = createClient();
    const from = photos.length;
    const to = from + GALLERY_PAGE_SIZE - 1;
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .range(from, to)
      .returns<GalleryPhoto[]>();

    const batch = data ?? [];
    setPhotos((cur) => [...cur, ...batch]);
    setHasMore(batch.length === GALLERY_PAGE_SIZE);
    setLoadingMore(false);
    loadingRef.current = false;
  }, [hasMore, photos.length]);

  // Infinite scroll: fetch the next batch only once the sentinel at the
  // bottom of the grid actually scrolls into view — nothing beyond the
  // current batch is fetched or rendered until then.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gold/40 bg-ivory-dim/40 px-6 py-20 text-center">
        <p className="font-display text-xl italic text-ink">
          No photos yet.
        </p>
        <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink/65">
          Check back soon — this fills up as chapters share their moments.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={photo.caption ? `Open photo: ${photo.caption}` : "Open photo"}
            className="group relative aspect-square overflow-hidden rounded-xl bg-ivory-dim"
          >
            <Image
              src={photo.thumbnail_url}
              alt={photo.caption ?? ""}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              // Only the first row needs eager loading; next/image lazy-loads
              // (native loading="lazy") everything else by default.
              priority={i < 5}
            />
          </button>
        ))}
      </div>

      {/* Sentinel: fires the next fetch when it scrolls near the viewport;
          renders nothing itself. */}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

      {loadingMore && (
        <p className="mt-6 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
          Loading more…
        </p>
      )}

      {openIndex !== null && (
        <GalleryLightbox
          photos={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
          onNeedMore={hasMore ? loadMore : undefined}
        />
      )}
    </div>
  );
}
