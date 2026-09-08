"use client";

import { useActionState } from "react";
import { Field, SelectField } from "@/components/ui/field";
import type { Sport } from "@/lib/types";
import type { FormState } from "./actions";

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
      <SelectField
        label="Deporte"
        name="sport_id"
        required
        defaultValue=""
        hint="Obligatorio. La rama deportiva a la que pertenece este equipo/serie."
      >
        <option value="" disabled>
          Selecciona un deporte
        </option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </SelectField>
      <Field
        label="Nombre"
        name="name"
        required
        placeholder="Primer equipo, Serie Sub-15…"
        hint="Obligatorio. Cómo se llama este equipo o serie."
      />
      <Field
        label="Categoría"
        name="category"
        placeholder="Ej: Masculino, Femenino, Escuela"
        hint="Opcional. Se usa para agrupar por género/rama en los selectores (ej: Masculino, Femenino, Escuela)."
      />
      <Field
        label="Orden"
        name="sort_order"
        type="number"
        min={0}
        defaultValue={0}
        hint="Define en qué posición aparece dentro de su categoría (menor número aparece primero)."
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <p className="text-xs text-primary/50">Los campos marcados con * son obligatorios.</p>
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
