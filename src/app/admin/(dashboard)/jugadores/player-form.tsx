"use client";

import { useActionState } from "react";
import type { Player, Team } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

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

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Nombre completo</label>
        <input name="full_name" required defaultValue={initial?.full_name} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Equipo</label>
        <select name="team_id" defaultValue={initial?.team_id ?? ""} className={inputClass}>
          <option value="">Sin asignar</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Posición</label>
          <input name="position" defaultValue={initial?.position ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Número</label>
          <input
            name="jersey_number"
            type="number"
            min={0}
            defaultValue={initial?.jersey_number ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Foto</label>
        <input name="photo" type="file" accept="image/*" className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Biografía</label>
        <textarea name="bio" rows={3} defaultValue={initial?.bio ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Visibilidad</label>
        <select
          name="is_published"
          defaultValue={initial ? String(initial.is_published) : "true"}
          className={inputClass}
        >
          <option value="true">Publicado</option>
          <option value="false">Oculto</option>
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
