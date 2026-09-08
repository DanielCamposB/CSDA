import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TrophyForm } from "../trophy-form";
import { updateTrophy } from "../actions";

export default async function EditTrophyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: trophy }, { data: sports }] = await Promise.all([
    supabase.from("trophies").select("*").eq("id", id).maybeSingle(),
    supabase.from("sports").select("*").order("name"),
  ]);
  if (!trophy) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar trofeo</h1>
      <TrophyForm action={updateTrophy.bind(null, id)} sports={sports ?? []} initial={trophy} />
    </>
  );
}
