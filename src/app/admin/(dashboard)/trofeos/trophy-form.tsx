"use client";

import { useActionState, useState } from "react";
import { Field, SelectField, TextAreaField } from "@/components/ui/field";
import type { Sport, Team, Trophy } from "@/lib/types";
import type { FormState } from "./actions";

export function TrophyForm({
  action,
  sports,
  teams,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sports: Sport[];
  teams: Team[];
  initial?: Trophy;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [sportId, setSportId] = useState(initial?.sport_id ?? "");
  const suggestions = teams.filter((t) => t.sport_id === sportId);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field
        label="Nombre del campeonato"
        name="title"
        required
        defaultValue={initial?.title}
        placeholder="Ej: Campeón Liga Local"
        hint="Obligatorio. Nombre del campeonato o logro."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Año"
          name="year"
          type="number"
          defaultValue={initial?.year ?? ""}
          placeholder="Ej: 2026"
          hint="Opcional. Año en que se obtuvo el logro."
        />
        <SelectField
          label="Deporte"
          name="sport_id"
          value={sportId}
          onChange={(e) => {
            e.currentTarget.setCustomValidity("");
            setSportId(e.target.value);
          }}
          hint="Opcional. Rama deportiva asociada al logro."
        >
          <option value="">General</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </SelectField>
      </div>
      <Field
        label="Categoría/serie"
        name="category"
        defaultValue={initial?.category ?? ""}
        placeholder="Ej: Serie Honor, Sub 12…"
        list="trophy-category-suggestions"
        hint="Opcional. Qué serie o categoría obtuvo este logro. Elige el deporte arriba para ver sugerencias."
      />
      <datalist id="trophy-category-suggestions">
        {suggestions.map((team) => (
          <option key={team.id} value={team.name} />
        ))}
      </datalist>
      <TextAreaField
        label="Descripción"
        name="description"
        rows={3}
        defaultValue={initial?.description ?? ""}
        placeholder="Detalles del logro"
        hint="Opcional."
      />
      <Field
        label="Fotografía"
        name="image"
        type="file"
        accept="image/*"
        hint="Opcional. Formatos JPG, PNG, WEBP o GIF, máximo 8MB."
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
