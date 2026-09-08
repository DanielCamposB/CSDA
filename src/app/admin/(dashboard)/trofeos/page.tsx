import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteTrophy } from "./actions";

export default async function AdminTrophiesPage() {
  const supabase = await createClient();
  const { data: trophies } = await supabase
    .from("trophies")
    .select("*")
    .order("year", { ascending: false });

  return (
    <>
      <AdminPageHeader title="Trofeos" newHref="/admin/trofeos/new" />
      <DataTable columns={["Título", "Año", "Categoría"]}>
        {(trophies ?? []).map((trophy) => (
          <tr key={trophy.id}>
            <td className="px-4 py-3 font-medium text-primary">{trophy.title}</td>
            <td className="px-4 py-3 text-primary/60">{trophy.year ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{trophy.category ?? "—"}</td>
            <RowActions
              editHref={`/admin/trofeos/${trophy.id}`}
              deleteAction={deleteTrophy.bind(null, trophy.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
