import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "../team-form";
import { createTeam } from "../actions";

export default async function NewTeamPage() {
  const supabase = await createClient();
  const { data: sports } = await supabase.from("sports").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo equipo/serie</h1>
      <TeamForm action={createTeam} sports={sports ?? []} />
    </>
  );
}
