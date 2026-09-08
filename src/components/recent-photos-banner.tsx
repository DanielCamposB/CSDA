"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhotoViewerModal, usePhotoViewer } from "@/components/photo-viewer";

type RecentPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
  href: string;
};

export function RecentPhotosBanner({ photos }: { photos: RecentPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewer = usePhotoViewer();

  useEffect(() => {
    if (photos.length <= 1 || paused || viewer.openIndex !== null) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length, paused, viewer.openIndex]);

  if (photos.length === 0) return null;

  return (
    <section
      className="relative mt-3 h-64 w-full overflow-hidden bg-dark sm:h-80 lg:h-96"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Fotos recientes del club"
    >
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          onDoubleClick={() => viewer.open(i)}
          className={`absolute inset-0 cursor-zoom-in transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={photo.image_url}
            alt={photo.caption ?? "Foto reciente del club"}
            fill
            priority={i === 0}
            className="object-contain"
            sizes="100vw"
          />
        </div>
      ))}

      <Link
        href={photos[index].href}
        className="absolute bottom-3 right-3 z-10 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/70"
      >
        Ver galería →
      </Link>

      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/50"
              }`}
            />
          ))}
        </div>
      )}

      <PhotoViewerModal
        photos={photos}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onNavigate={viewer.open}
        altPrefix="Foto del club"
      />
    </section>
  );
}
