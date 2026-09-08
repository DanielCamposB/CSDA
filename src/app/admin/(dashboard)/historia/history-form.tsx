"use client";

import { useActionState } from "react";
import type { ClubHistoryEntry } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

export function HistoryForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: ClubHistoryEntry;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Título del hito</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Año</label>
          <input name="year" type="number" defaultValue={initial?.year ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Orden</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={initial?.sort_order ?? 0}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Descripción</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Fotografía</label>
        <input name="image" type="file" accept="image/*" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-2.5 font-semibold text-cream hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
