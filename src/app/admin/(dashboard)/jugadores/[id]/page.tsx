import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlayerForm } from "../player-form";
import { updatePlayer } from "../actions";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: player }, { data: teams }] = await Promise.all([
    supabase.from("players").select("*").eq("id", id).maybeSingle(),
    supabase.from("teams").select("*").order("name"),
  ]);
  if (!player) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar jugador</h1>
      <PlayerForm action={updatePlayer.bind(null, id)} teams={teams ?? []} initial={player} />
    </>
  );
}
