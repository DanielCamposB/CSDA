import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteDirector } from "./actions";

export default async function AdminDirectorsPage() {
  const supabase = await createClient();
  const { data: directors } = await supabase.from("directors").select("*").order("sort_order");

  return (
    <>
      <AdminPageHeader title="Directiva" newHref="/admin/directiva/new" />
      <DataTable columns={["Nombre", "Cargo", "Período"]}>
        {(directors ?? []).map((director) => (
          <tr key={director.id}>
            <td className="px-4 py-3 font-medium text-primary">{director.full_name}</td>
            <td className="px-4 py-3 text-primary/60">{director.role_title}</td>
            <td className="px-4 py-3 text-primary/60">{director.period ?? "—"}</td>
            <RowActions
              editHref={`/admin/directiva/${director.id}`}
              deleteAction={deleteDirector.bind(null, director.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
