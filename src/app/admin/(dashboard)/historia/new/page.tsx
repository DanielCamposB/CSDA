import { HistoryForm } from "../history-form";
import { createHistoryEntry } from "../actions";

export default function NewHistoryPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo hito histórico</h1>
      <HistoryForm action={createHistoryEntry} />
    </>
  );
}
