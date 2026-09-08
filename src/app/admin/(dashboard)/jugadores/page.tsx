import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deletePlayer } from "./actions";

export default async function AdminPlayersPage() {
  const supabase = await createClient();
  const { data: players } = await supabase
    .from("players")
    .select("*, teams(name)")
    .order("full_name");

  return (
    <>
      <AdminPageHeader title="Jugadores" newHref="/admin/jugadores/new" />
      <DataTable columns={["Nombre", "Equipo", "Posición", "Visible"]}>
        {(players ?? []).map((player) => (
          <tr key={player.id}>
            <td className="px-4 py-3 font-medium text-primary">{player.full_name}</td>
            <td className="px-4 py-3 text-primary/60">{player.teams?.name ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{player.position ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{player.is_published ? "Sí" : "No"}</td>
            <RowActions
              editHref={`/admin/jugadores/${player.id}`}
              deleteAction={deletePlayer.bind(null, player.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
