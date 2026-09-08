import { createClient } from "@/lib/supabase/server";
import { deleteMessage, toggleHandled } from "./actions";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Mensajes de contacto</h1>
      <div className="space-y-3">
        {(messages ?? []).length === 0 && (
          <p className="text-primary/60">No hay mensajes por ahora.</p>
        )}
        {(messages ?? []).map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl border p-4 ${
              msg.handled ? "border-black/10 bg-white/60" : "border-secondary/40 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-primary">
                  {msg.name} <span className="font-normal text-primary/50">· {msg.email}</span>
                </p>
                <p className="text-xs uppercase tracking-wide text-secondary">{msg.message_type}</p>
              </div>
              <p className="text-xs text-primary/40">
                {new Date(msg.created_at).toLocaleString("es-CL")}
              </p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-primary/80">{msg.message}</p>
            <div className="mt-3 flex gap-3">
              <form action={toggleHandled.bind(null, msg.id, msg.handled)}>
                <button type="submit" className="text-sm font-medium text-secondary hover:underline">
                  {msg.handled ? "Marcar pendiente" : "Marcar atendido"}
                </button>
              </form>
              <form action={deleteMessage.bind(null, msg.id)}>
                <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
