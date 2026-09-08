import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteHistoryEntry } from "./actions";

export default async function AdminHistoryPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("club_history")
    .select("*")
    .order("sort_order");

  return (
    <>
      <AdminPageHeader title="Historia del club" newHref="/admin/historia/new" />
      <DataTable columns={["Título", "Año", "Orden"]}>
        {(entries ?? []).map((entry) => (
          <tr key={entry.id}>
            <td className="px-4 py-3 font-medium text-primary">{entry.title}</td>
            <td className="px-4 py-3 text-primary/60">{entry.year ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{entry.sort_order}</td>
            <RowActions
              editHref={`/admin/historia/${entry.id}`}
              deleteAction={deleteHistoryEntry.bind(null, entry.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
