"use client";

import Image from "next/image";
import { PhotoViewerModal, usePhotoViewer } from "@/components/photo-viewer";

type LightboxImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

export function Lightbox({ images, altPrefix }: { images: LightboxImage[]; altPrefix: string }) {
  const viewer = usePhotoViewer();

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onDoubleClick={() => viewer.open(i)}
            className="group relative mb-3 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-lg"
            aria-label={`Ampliar foto ${i + 1}`}
          >
            <Image
              src={image.image_url}
              alt={image.caption ?? `${altPrefix} ${i + 1}`}
              width={800}
              height={600}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              style={{ width: "100%", height: "auto" }}
              className="block transition-transform group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-medium text-transparent transition-colors group-hover:bg-black/30 group-hover:text-white">
              Doble clic para ampliar
            </span>
          </button>
        ))}
      </div>

      <PhotoViewerModal
        photos={images}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onNavigate={viewer.open}
        altPrefix={altPrefix}
      />
    </>
  );
}
