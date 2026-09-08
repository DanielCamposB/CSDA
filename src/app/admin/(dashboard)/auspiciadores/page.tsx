import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteSponsor } from "./actions";

export default async function AdminSponsorsPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase.from("sponsors").select("*").order("tier");

  return (
    <>
      <AdminPageHeader title="Auspiciadores" newHref="/admin/auspiciadores/new" />
      <DataTable columns={["Nombre", "Nivel", "Sitio web", "Prioridad"]}>
        {(sponsors ?? []).map((sponsor) => (
          <tr key={sponsor.id}>
            <td className="px-4 py-3 font-medium text-primary">{sponsor.name}</td>
            <td className="px-4 py-3 capitalize text-primary/60">{sponsor.tier}</td>
            <td className="px-4 py-3 text-primary/60">{sponsor.website_url ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{sponsor.priority}</td>
            <RowActions
              editHref={`/admin/auspiciadores/${sponsor.id}`}
              deleteAction={deleteSponsor.bind(null, sponsor.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
