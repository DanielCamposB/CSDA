"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import type { GalleryImage } from "@/lib/types";
import { addGalleryImages, deleteGalleryImage } from "../actions";

export function ImageManager({
  galleryId,
  images,
}: {
  galleryId: string;
  images: GalleryImage[];
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <form
        ref={formRef}
        action={(formData) => {
          setUploading(true);
          startTransition(async () => {
            await addGalleryImages(galleryId, formData);
            formRef.current?.reset();
            setUploading(false);
          });
        }}
        className="mb-6 flex items-center gap-3"
      >
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          required
          className="text-sm"
        />
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-accent disabled:opacity-60"
        >
          {uploading ? "Subiendo…" : "Subir fotos"}
        </button>
      </form>

      {images.length === 0 ? (
        <p className="text-sm text-primary/60">Esta galería aún no tiene fotografías.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative h-32 overflow-hidden rounded-lg">
              <Image src={image.image_url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  if (confirm("¿Eliminar esta foto?")) {
                    startTransition(() => deleteGalleryImage(galleryId, image.id));
                  }
                }}
                className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
