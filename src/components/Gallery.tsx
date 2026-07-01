"use client";

import { useCallback, useEffect, useState } from "react";

export type GalleryImage = { src: string; alt: string };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setActive(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-carvao/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-dourado/0 transition group-hover:ring-dourado/60" />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-carvao/95 p-4"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={close}
            className="absolute right-5 top-5 text-3xl text-creme/80 hover:text-dourado"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 text-4xl text-creme/70 hover:text-dourado md:left-10"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active].src}
            alt={images[active].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-sm object-contain shadow-2xl"
          />
          <button
            type="button"
            aria-label="Próxima"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 text-4xl text-creme/70 hover:text-dourado md:right-10"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
