"use client";

import { useActionState } from "react";
import type { Sponsor } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

export function SponsorForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Sponsor;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Nombre</label>
        <input name="name" required defaultValue={initial?.name} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Sitio web</label>
        <input name="website_url" type="url" defaultValue={initial?.website_url ?? ""} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Nivel</label>
        <select name="tier" defaultValue={initial?.tier ?? "colaborador"} className={inputClass}>
          <option value="principal">Principal</option>
          <option value="oficial">Oficial</option>
          <option value="colaborador">Colaborador</option>
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
        <label className="mb-1 block text-sm font-medium text-primary">Logo</label>
        <input name="logo" type="file" accept="image/*" className={inputClass} />
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
