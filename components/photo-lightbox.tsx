"use client";

import { useState, useCallback, useEffect } from "react";
import { MasonryGrid } from "./masonry-grid";

type Photo = {
  id: string;
  image_url: string;
  thumbnail_url: string;
  title: string | null;
};

type Props = {
  photos: Photo[];
};

export function ProfilePortfolio({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (index: number) => setLightboxIndex(index);
  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, prev, next]);

  // Touch swipe support
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-4xl mb-3">🖼️</p>
        <p className="text-sm">Chưa có ảnh portfolio.</p>
      </div>
    );
  }

  const current = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <MasonryGrid>
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => open(index)}
            className="break-inside-avoid block w-full mb-3 rounded-xl overflow-hidden group relative focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
            aria-label={photo.title ?? `Ảnh portfolio ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumbnail_url}
              alt={photo.title ?? `Ảnh portfolio ${index + 1}`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {photo.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">{photo.title}</p>
              </div>
            )}
          </button>
        ))}
      </MasonryGrid>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh"
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl leading-none z-10"
            aria-label="Đóng"
          >
            ×
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10 p-2"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.title ?? "Portfolio photo"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {current.title && (
              <p className="text-white/80 text-sm text-center px-4">{current.title}</p>
            )}
            <p className="text-white/40 text-xs">
              {(lightboxIndex ?? 0) + 1} / {photos.length}
            </p>
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10 p-2"
              aria-label="Ảnh tiếp theo"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
