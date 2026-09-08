"use client";

import { useActionState } from "react";
import type { Director } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

export function DirectorForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Director;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Nombre completo</label>
        <input name="full_name" required defaultValue={initial?.full_name} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Cargo</label>
        <input name="role_title" required defaultValue={initial?.role_title} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Período</label>
          <input name="period" defaultValue={initial?.period ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Orden</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={initial?.sort_order ?? 0}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Biografía</label>
        <textarea name="bio" rows={3} defaultValue={initial?.bio ?? ""} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Fotografía</label>
        <input name="photo" type="file" accept="image/*" className={inputClass} />
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
