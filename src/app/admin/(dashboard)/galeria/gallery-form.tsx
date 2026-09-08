"use client";

import { useActionState } from "react";
import type { Gallery, Sport } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

export function GalleryForm({
  action,
  sports,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sports: Sport[];
  initial?: Gallery;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Título</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Slug (URL)</label>
        <input name="slug" required defaultValue={initial?.slug} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Deporte (opcional)</label>
        <select name="sport_id" defaultValue={initial?.sport_id ?? ""} className={inputClass}>
          <option value="">General</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Fecha</label>
        <input
          name="event_date"
          type="date"
          defaultValue={initial?.event_date ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Descripción</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initial?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Imagen de portada</label>
        <input name="cover_image" type="file" accept="image/*" className={inputClass} />
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
