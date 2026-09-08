import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteNews } from "./actions";

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader title="Noticias" newHref="/admin/noticias/new" />
      <DataTable columns={["Título", "Estado", "Categoría", "Prioridad"]}>
        {(news ?? []).map((post) => (
          <tr key={post.id}>
            <td className="px-4 py-3 font-medium text-primary">{post.title}</td>
            <td className="px-4 py-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  post.status === "published"
                    ? "bg-accent/15 text-accent"
                    : "bg-black/10 text-primary/60"
                }`}
              >
                {post.status === "published" ? "Publicado" : "Borrador"}
              </span>
            </td>
            <td className="px-4 py-3 text-primary/60">{post.category ?? "—"}</td>
            <td className="px-4 py-3 text-primary/60">{post.priority}</td>
            <RowActions
              editHref={`/admin/noticias/${post.id}`}
              deleteAction={deleteNews.bind(null, post.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
