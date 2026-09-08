import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../event-form";
import { updateEvent } from "../actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (!event) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar evento</h1>
      <EventForm action={updateEvent.bind(null, id)} initial={event} />
    </>
  );
}
