"use client";

import { useActionState } from "react";
import { Field, SelectField, TextAreaField } from "@/components/ui/field";
import { groupTeamsByCategory } from "@/lib/teams";
import type { Player, Team } from "@/lib/types";
import type { FormState } from "./actions";

export function PlayerForm({
  action,
  teams,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  teams: Team[];
  initial?: Player;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const teamGroups = groupTeamsByCategory(teams);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field
        label="Nombre completo"
        name="full_name"
        required
        defaultValue={initial?.full_name}
        placeholder="Ej: Juan Pérez"
        hint="Obligatorio. Nombre y apellido del jugador."
      />

      <SelectField
        label="Equipo"
        name="team_id"
        defaultValue={initial?.team_id ?? ""}
        hint="Opcional. A qué equipo o serie pertenece."
      >
        <option value="">Sin asignar</option>
        {teamGroups.map(([category, group]) => (
          <optgroup key={category} label={category}>
            {group.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </optgroup>
        ))}
      </SelectField>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Posición"
          name="position"
          defaultValue={initial?.position ?? ""}
          placeholder="Ej: Delantero"
          hint="Opcional. Posición o rol en la cancha."
        />
        <Field
          label="Número"
          name="jersey_number"
          type="number"
          min={0}
          defaultValue={initial?.jersey_number ?? ""}
          placeholder="Ej: 10"
          hint="Opcional. Número de camiseta."
        />
      </div>

      <Field
        label="Foto"
        name="photo"
        type="file"
        accept="image/*"
        hint="Opcional. Formatos JPG, PNG, WEBP o GIF, máximo 8MB."
      />

      <TextAreaField
        label="Biografía"
        name="bio"
        rows={3}
        defaultValue={initial?.bio ?? ""}
        placeholder="Trayectoria, logros u otra información autorizada"
        hint="Opcional. No incluyas RUT, dirección ni datos personales sensibles, especialmente de menores de edad."
      />

      <SelectField
        label="Visibilidad"
        name="is_published"
        defaultValue={initial ? String(initial.is_published) : "true"}
        hint="Si está oculto, el jugador no aparece en el sitio público."
      >
        <option value="true">Publicado</option>
        <option value="false">Oculto</option>
      </SelectField>

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
