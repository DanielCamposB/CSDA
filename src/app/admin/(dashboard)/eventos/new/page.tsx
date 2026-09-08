import { EventForm } from "../event-form";
import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo evento</h1>
      <EventForm action={createEvent} />
    </>
  );
}
