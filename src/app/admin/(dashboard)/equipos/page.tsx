import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { createClient } from "@/lib/supabase/server";
import { deleteTeam } from "./actions";

export default async function AdminTeamsPage() {
  const supabase = await createClient();
  const { data: teams } = await supabase
    .from("teams")
    .select("*, sports(name)")
    .order("name");

  return (
    <>
      <AdminPageHeader title="Equipos / Series" newHref="/admin/equipos/new" />
      <p className="mb-4 text-sm text-primary/60">
        Los equipos se usan para agrupar jugadores por deporte y categoría.
      </p>
      <DataTable columns={["Nombre", "Deporte", "Categoría"]}>
        {(teams ?? []).map((team) => (
          <tr key={team.id}>
            <td className="px-4 py-3 font-medium text-primary">{team.name}</td>
            <td className="px-4 py-3 text-primary/60">{team.sports?.name}</td>
            <td className="px-4 py-3 text-primary/60">{team.category ?? "—"}</td>
            <td className="px-4 py-3 text-right">
              <form action={deleteTeam.bind(null, team.id)}>
                <button type="submit" className="font-medium text-red-600 hover:underline">
                  Eliminar
                </button>
              </form>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
