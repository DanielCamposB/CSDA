import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "../gallery-form";
import { createGallery } from "../actions";

export default async function NewGalleryPage() {
  const supabase = await createClient();
  const { data: sports } = await supabase.from("sports").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nueva galería</h1>
      <GalleryForm action={createGallery} sports={sports ?? []} />
    </>
  );
}
