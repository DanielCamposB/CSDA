import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteBenefit } from "./actions";

export default async function AdminBenefitsPage() {
  const supabase = await createClient();
  const { data: benefits } = await supabase
    .from("benefits")
    .select("*, sponsors(name)")
    .order("valid_until", { ascending: true, nullsFirst: false });

  return (
    <>
      <AdminPageHeader title="Beneficios" newHref="/admin/beneficios/new" />
      <DataTable columns={["Título", "Auspiciador", "Vigente hasta", "Prioridad"]}>
        {(benefits ?? []).map((benefit) => (
          <tr key={benefit.id}>
            <td className="px-4 py-3 font-medium text-primary">{benefit.title}</td>
            <td className="px-4 py-3 text-primary/60">{benefit.sponsors?.name ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{benefit.valid_until ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{benefit.priority}</td>
            <RowActions
              editHref={`/admin/beneficios/${benefit.id}`}
              deleteAction={deleteBenefit.bind(null, benefit.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
