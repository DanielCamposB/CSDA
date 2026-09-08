"use client";

import { useActionState } from "react";
import type { Sport } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

export function TeamForm({
  action,
  sports,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sports: Sport[];
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Deporte</label>
        <select name="sport_id" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Selecciona un deporte
          </option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Nombre</label>
        <input name="name" required placeholder="Primer equipo, Serie Sub-15…" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Categoría</label>
        <input name="category" className={inputClass} />
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
