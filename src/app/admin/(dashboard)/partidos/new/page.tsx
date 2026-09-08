import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "../match-form";
import { createMatch } from "../actions";

export default async function NewMatchPage() {
  const supabase = await createClient();
  const { data: sports } = await supabase.from("sports").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo partido</h1>
      <MatchForm action={createMatch} sports={sports ?? []} />
    </>
  );
}
