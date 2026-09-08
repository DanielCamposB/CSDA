"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type ViewerPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
};

export function usePhotoViewer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return {
    openIndex,
    open: (i: number) => setOpenIndex(i),
    close: () => setOpenIndex(null),
  };
}

export function PhotoViewerModal({
  photos,
  openIndex,
  onClose,
  onNavigate,
  altPrefix,
}: {
  photos: ViewerPhoto[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  altPrefix: string;
}) {
  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(((openIndex ?? 0) + 1) % photos.length);
      if (e.key === "ArrowLeft")
        onNavigate(((openIndex ?? 0) - 1 + photos.length) % photos.length);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, photos.length]);

  if (openIndex === null) return null;
  const photo = photos[openIndex];
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
      >
        ×
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((openIndex - 1 + photos.length) % photos.length);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-4"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((openIndex + 1) % photos.length);
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-4"
          >
            ›
          </button>
        </>
      )}

      <div className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={photo.image_url}
          alt={photo.caption ?? `${altPrefix} ${openIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
