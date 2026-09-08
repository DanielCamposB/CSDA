"use client";

import { useActionState } from "react";
import type { Match, Sport } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MatchForm({
  action,
  sports,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sports: Sport[];
  initial?: Match;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Deporte</label>
        <select name="sport_id" required defaultValue={initial?.sport_id} className={inputClass}>
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
        <label className="mb-1 block text-sm font-medium text-primary">Condición</label>
        <select
          name="is_home"
          defaultValue={initial ? String(initial.is_home) : "true"}
          className={inputClass}
        >
          <option value="true">Algarrobo juega de local</option>
          <option value="false">Algarrobo juega de visita</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Rival</label>
        <input name="rival_name" required defaultValue={initial?.rival_name} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Competencia</label>
        <input name="competition" defaultValue={initial?.competition ?? ""} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Fecha y hora</label>
          <input
            name="match_date"
            type="datetime-local"
            required
            defaultValue={toLocalInputValue(initial?.match_date)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Lugar</label>
          <input name="location" defaultValue={initial?.location ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Estado</label>
        <select name="status" defaultValue={initial?.status ?? "programado"} className={inputClass}>
          <option value="programado">Programado</option>
          <option value="confirmado">Confirmado</option>
          <option value="suspendido">Suspendido</option>
          <option value="reprogramado">Reprogramado</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Goles/puntos local</label>
          <input
            name="home_score"
            type="number"
            min={0}
            defaultValue={initial?.home_score ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Goles/puntos visita</label>
          <input
            name="away_score"
            type="number"
            min={0}
            defaultValue={initial?.away_score ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Observaciones</label>
        <textarea name="notes" rows={3} defaultValue={initial?.notes ?? ""} className={inputClass} />
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
