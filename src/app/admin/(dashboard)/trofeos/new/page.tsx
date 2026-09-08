import { createClient } from "@/lib/supabase/server";
import { TrophyForm } from "../trophy-form";
import { createTrophy } from "../actions";

export default async function NewTrophyPage() {
  const supabase = await createClient();
  const { data: sports } = await supabase.from("sports").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo trofeo</h1>
      <TrophyForm action={createTrophy} sports={sports ?? []} />
    </>
  );
}
