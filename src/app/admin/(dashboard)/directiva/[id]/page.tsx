import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DirectorForm } from "../director-form";
import { updateDirector } from "../actions";

export default async function EditDirectorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: director } = await supabase.from("directors").select("*").eq("id", id).maybeSingle();
  if (!director) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar directiva</h1>
      <DirectorForm action={updateDirector.bind(null, id)} initial={director} />
    </>
  );
}
