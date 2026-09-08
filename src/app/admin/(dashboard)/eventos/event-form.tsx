"use client";

import { useActionState } from "react";
import type { ClubEvent } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: ClubEvent;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Título</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Fecha y hora</label>
        <input
          name="event_date"
          type="datetime-local"
          required
          defaultValue={toLocalInputValue(initial?.event_date)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Lugar</label>
        <input name="location" defaultValue={initial?.location ?? ""} className={inputClass} />
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
        <label className="mb-1 block text-sm font-medium text-primary">Imagen</label>
        <input name="cover_image" type="file" accept="image/*" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Estado</label>
        <select name="status" defaultValue={initial?.status ?? "published"} className={inputClass}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
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
