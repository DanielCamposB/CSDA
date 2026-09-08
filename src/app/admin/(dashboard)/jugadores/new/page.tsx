import { createClient } from "@/lib/supabase/server";
import { PlayerForm } from "../player-form";
import { createPlayer } from "../actions";

export default async function NewPlayerPage() {
  const supabase = await createClient();
  const { data: teams } = await supabase.from("teams").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo jugador</h1>
      <PlayerForm action={createPlayer} teams={teams ?? []} />
    </>
  );
}
