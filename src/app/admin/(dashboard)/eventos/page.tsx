import { AdminPageHeader, DataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "./actions";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <>
      <AdminPageHeader title="Eventos" newHref="/admin/eventos/new" />
      <DataTable columns={["Título", "Fecha", "Estado"]}>
        {(events ?? []).map((event) => (
          <tr key={event.id}>
            <td className="px-4 py-3 font-medium text-primary">{event.title}</td>
            <td className="px-4 py-3 text-primary/60">
              {new Date(event.event_date).toLocaleString("es-CL")}
            </td>
            <td className="px-4 py-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  event.status === "published"
                    ? "bg-accent/15 text-accent"
                    : "bg-black/10 text-primary/60"
                }`}
              >
                {event.status === "published" ? "Publicado" : "Borrador"}
              </span>
            </td>
            <RowActions
              editHref={`/admin/eventos/${event.id}`}
              deleteAction={deleteEvent.bind(null, event.id)}
            />
          </tr>
        ))}
      </DataTable>
    </>
  );
}
