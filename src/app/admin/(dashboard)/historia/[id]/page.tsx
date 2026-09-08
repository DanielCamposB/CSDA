import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HistoryForm } from "../history-form";
import { updateHistoryEntry } from "../actions";

export default async function EditHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry } = await supabase.from("club_history").select("*").eq("id", id).maybeSingle();
  if (!entry) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar hito histórico</h1>
      <HistoryForm action={updateHistoryEntry.bind(null, id)} initial={entry} />
    </>
  );
}
