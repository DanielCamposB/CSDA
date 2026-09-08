import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "../gallery-form";
import { updateGallery } from "../actions";
import { ImageManager } from "./image-manager";

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: gallery }, { data: sports }, { data: images }] = await Promise.all([
    supabase.from("galleries").select("*").eq("id", id).maybeSingle(),
    supabase.from("sports").select("*").order("name"),
    supabase.from("gallery_images").select("*").eq("gallery_id", id).order("sort_order"),
  ]);
  if (!gallery) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar galería</h1>
      <GalleryForm action={updateGallery.bind(null, id)} sports={sports ?? []} initial={gallery} />

      <h2 className="mb-4 mt-10 font-serif text-xl font-bold text-primary">Fotografías</h2>
      <ImageManager galleryId={id} images={images ?? []} />
    </>
  );
}
