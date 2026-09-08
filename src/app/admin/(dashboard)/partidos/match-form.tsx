"use client";

import { useActionState, useState } from "react";
import { Field, PriorityField, SelectField, TextAreaField } from "@/components/ui/field";
import { groupTeamsByCategory } from "@/lib/teams";
import type { Match, Sport, Team } from "@/lib/types";
import type { FormState } from "./actions";

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MatchForm({
  action,
  sports,
  teams,
  initial,
  initialTeamIds,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sports: Sport[];
  teams: Team[];
  initial?: Match;
  initialTeamIds?: string[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [sportId, setSportId] = useState(initial?.sport_id ?? "");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(initialTeamIds ?? []);
  const teamGroups = groupTeamsByCategory(teams.filter((t) => t.sport_id === sportId));

  function toggleTeam(id: string) {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <SelectField
        label="Deporte"
        name="sport_id"
        required
        value={sportId}
        onChange={(e) => {
          e.currentTarget.setCustomValidity("");
          setSportId(e.target.value);
        }}
        hint="Obligatorio. La rama deportiva a la que pertenece el partido."
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

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Serie / equipo</label>
        <p className="mb-2 text-xs text-primary/50">
          Opcional. Marca una o varias series de Algarrobo que juegan este partido (ej: si
          Primera y Segunda Infantil juegan juntas). Déjalo sin marcar si no aplica.
        </p>
        {teamGroups.length === 0 ? (
          <p className="text-sm text-primary/50">Selecciona un deporte para ver sus series.</p>
        ) : (
          <div className="space-y-3 rounded-lg border border-black/15 bg-white p-3">
            {teamGroups.map(([category, group]) => (
              <div key={category}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {category}
                </p>
                <div className="flex flex-wrap gap-3">
                  {group.map((team) => (
                    <label key={team.id} className="flex items-center gap-1.5 text-sm text-primary">
                      <input
                        type="checkbox"
                        name="team_ids"
                        value={team.id}
                        checked={selectedTeamIds.includes(team.id)}
                        onChange={() => toggleTeam(team.id)}
                        className="h-4 w-4 accent-secondary"
                      />
                      {team.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SelectField
        label="Condición"
        name="is_home"
        defaultValue={initial ? String(initial.is_home) : "true"}
        hint="Indica si Algarrobo juega de local o de visita."
      >
        <option value="true">Algarrobo juega de local</option>
        <option value="false">Algarrobo juega de visita</option>
      </SelectField>

      <Field
        label="Rival"
        name="rival_name"
        required
        defaultValue={initial?.rival_name}
        placeholder="Ej: Unión el Litre"
        hint="Obligatorio. Nombre del equipo rival."
      />

      <Field
        label="Competencia"
        name="competition"
        defaultValue={initial?.competition ?? ""}
        placeholder="Ej: Liga Local, Copa Amistad"
        hint="Opcional. Nombre del torneo o campeonato."
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Fecha y hora"
          name="match_date"
          type="datetime-local"
          required
          defaultValue={toLocalInputValue(initial?.match_date)}
          hint="Obligatorio. Cuándo se juega el partido."
        />
        <Field
          label="Lugar"
          name="location"
          defaultValue={initial?.location ?? ""}
          placeholder="Ej: Estadio Municipal"
          hint="Opcional. Dónde se juega el partido."
        />
      </div>

      <SelectField
        label="Estado"
        name="status"
        defaultValue={initial?.status ?? "programado"}
        hint="El estado actual del partido (afecta si aparece en próximos partidos o en resultados)."
      >
        <option value="programado">Programado</option>
        <option value="confirmado">Confirmado</option>
        <option value="suspendido">Suspendido</option>
        <option value="reprogramado">Reprogramado</option>
        <option value="finalizado">Finalizado</option>
      </SelectField>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Goles/puntos local"
          name="home_score"
          type="number"
          min={0}
          defaultValue={initial?.home_score ?? ""}
          hint="Opcional. Completa solo cuando el partido ya se jugó."
        />
        <Field
          label="Goles/puntos visita"
          name="away_score"
          type="number"
          min={0}
          defaultValue={initial?.away_score ?? ""}
          hint="Opcional. Completa solo cuando el partido ya se jugó."
        />
      </div>

      <TextAreaField
        label="Observaciones"
        name="notes"
        rows={3}
        defaultValue={initial?.notes ?? ""}
        placeholder="Notas adicionales sobre el partido"
        hint="Opcional. Cualquier información extra que quieras registrar."
      />

      <PriorityField defaultValue={initial?.priority} />

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
