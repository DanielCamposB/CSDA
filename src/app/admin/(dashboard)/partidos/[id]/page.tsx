import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchForm } from "../match-form";
import { updateMatch } from "../actions";

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: match }, { data: sports }, { data: teams }, { data: matchTeams }] =
    await Promise.all([
      supabase.from("matches").select("*").eq("id", id).maybeSingle(),
      supabase.from("sports").select("*").order("name"),
      supabase.from("teams").select("*").order("name"),
      supabase.from("match_teams").select("team_id").eq("match_id", id),
    ]);
  if (!match) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar partido</h1>
      <MatchForm
        action={updateMatch.bind(null, id)}
        sports={sports ?? []}
        teams={teams ?? []}
        initial={match}
        initialTeamIds={(matchTeams ?? []).map((mt) => mt.team_id)}
      />
    </>
  );
}
