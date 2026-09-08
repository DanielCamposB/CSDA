import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { matchTeamNames } from "@/lib/teams";
import { deleteMatch } from "./actions";

export default async function AdminMatchesPage() {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select("*, sports(name), match_teams(teams(name))")
    .order("match_date", { ascending: false });

  return (
    <>
      <AdminPageHeader title="Partidos y resultados" newHref="/admin/partidos/new" />
      <DataTable columns={["Deporte", "Serie", "Partido", "Fecha", "Estado", "Resultado", "Prioridad"]}>
        {(matches ?? []).map((match) => (
          <tr key={match.id}>
            <td className="px-4 py-3 text-primary/60">{match.sports?.name}</td>
            <td className="px-4 py-3 text-primary/60">
              {matchTeamNames(match).join(", ") || "—"}
            </td>
            <td className="px-4 py-3 font-medium text-primary">
              {match.is_home ? "Algarrobo" : match.rival_name} vs{" "}
              {match.is_home ? match.rival_name : "Algarrobo"}
            </td>
            <td className="px-4 py-3 text-primary/60">
              {new Date(match.match_date).toLocaleString("es-CL")}
            </td>
            <td className="px-4 py-3 capitalize text-primary/60">{match.status}</td>
            <td className="px-4 py-3 text-primary/60">
              {match.home_score ?? "—"} - {match.away_score ?? "—"}
            </td>
            <td className="px-4 py-3 text-primary/60">{match.priority}</td>
            <RowActions
              editHref={`/admin/partidos/${match.id}`}
              deleteAction={deleteMatch.bind(null, match.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
