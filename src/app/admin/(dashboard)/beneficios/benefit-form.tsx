"use client";

import { useActionState } from "react";
import type { Benefit, Sponsor } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

export function BenefitForm({
  action,
  sponsors,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sponsors: Sponsor[];
  initial?: Benefit;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Título del beneficio</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Auspiciador asociado</label>
        <select name="sponsor_id" defaultValue={initial?.sponsor_id ?? ""} className={inputClass}>
          <option value="">Sin asociar</option>
          {sponsors.map((sponsor) => (
            <option key={sponsor.id} value={sponsor.id}>
              {sponsor.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Descripción</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Condiciones</label>
        <textarea
          name="conditions"
          rows={2}
          defaultValue={initial?.conditions ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Vigente hasta</label>
        <input
          name="valid_until"
          type="date"
          defaultValue={initial?.valid_until ?? ""}
          className={inputClass}
        />
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
