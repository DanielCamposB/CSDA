"use client";

import { useActionState } from "react";
import { Field, PriorityField, SelectField, TextAreaField } from "@/components/ui/field";
import type { Sponsor } from "@/lib/types";
import type { FormState } from "./actions";

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
      <Field
        label="Nombre"
        name="name"
        required
        defaultValue={initial?.name}
        placeholder="Ej: Ferretería Algarrobo"
        hint="Obligatorio. Nombre de la empresa o comercio."
      />
      <Field
        label="Sitio web"
        name="website_url"
        type="url"
        defaultValue={initial?.website_url ?? ""}
        placeholder="https://ejemplo.cl"
        hint="Opcional. Debe empezar con http:// o https://."
      />
      <SelectField
        label="Nivel"
        name="tier"
        defaultValue={initial?.tier ?? "colaborador"}
        hint="Define en qué sección aparece: principal, oficial o colaborador."
      >
        <option value="principal">Principal</option>
        <option value="oficial">Oficial</option>
        <option value="colaborador">Colaborador</option>
      </SelectField>
      <TextAreaField
        label="Descripción"
        name="description"
        rows={3}
        defaultValue={initial?.description ?? ""}
        placeholder="Breve descripción del auspiciador"
        hint="Opcional."
      />
      <Field
        label="Logo"
        name="logo"
        type="file"
        accept="image/*"
        hint="Opcional. Formatos JPG, PNG, WEBP o GIF, máximo 8MB."
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
