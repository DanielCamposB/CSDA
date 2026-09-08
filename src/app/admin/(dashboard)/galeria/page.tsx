import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteGallery } from "./actions";

export default async function AdminGalleriesPage() {
  const supabase = await createClient();
  const { data: galleries } = await supabase
    .from("galleries")
    .select("*, gallery_images(count)")
    .order("event_date", { ascending: false });

  return (
    <>
      <AdminPageHeader title="Galería" newHref="/admin/galeria/new" />
      <DataTable columns={["Título", "Fecha", "Fotos"]}>
        {(galleries ?? []).map((gallery) => (
          <tr key={gallery.id}>
            <td className="px-4 py-3 font-medium text-primary">{gallery.title}</td>
            <td className="px-4 py-3 text-primary/60">{gallery.event_date ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{gallery.gallery_images?.[0]?.count ?? 0}</td>
            <RowActions
              editHref={`/admin/galeria/${gallery.id}`}
              deleteAction={deleteGallery.bind(null, gallery.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
