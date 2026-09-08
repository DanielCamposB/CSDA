import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "../match-form";
import { updateMatch } from "../actions";

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: match }, { data: sports }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", id).maybeSingle(),
    supabase.from("sports").select("*").order("name"),
  ]);
  if (!match) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar partido</h1>
      <MatchForm action={updateMatch.bind(null, id)} sports={sports ?? []} initial={match} />
    </>
  );
}
