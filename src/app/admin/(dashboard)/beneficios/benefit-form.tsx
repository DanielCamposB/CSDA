"use client";

import { useActionState } from "react";
import { Field, PriorityField, SelectField, TextAreaField } from "@/components/ui/field";
import type { Benefit, Sponsor } from "@/lib/types";
import type { FormState } from "./actions";

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
      <Field
        label="Título del beneficio"
        name="title"
        required
        defaultValue={initial?.title}
        placeholder="Ej: 15% de descuento para socios"
        hint="Obligatorio. El nombre del beneficio."
      />
      <SelectField
        label="Auspiciador asociado"
        name="sponsor_id"
        defaultValue={initial?.sponsor_id ?? ""}
        hint="Opcional. Elige la empresa auspiciadora que ofrece este beneficio, para mostrar su nombre junto al beneficio. Déjalo vacío si es un beneficio general del club."
      >
        <option value="">Sin asociar</option>
        {sponsors.map((sponsor) => (
          <option key={sponsor.id} value={sponsor.id}>
            {sponsor.name}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        label="Descripción"
        name="description"
        rows={3}
        defaultValue={initial?.description ?? ""}
        placeholder="En qué consiste el beneficio"
        hint="Opcional."
      />
      <TextAreaField
        label="Condiciones"
        name="conditions"
        rows={2}
        defaultValue={initial?.conditions ?? ""}
        placeholder="Ej: Presentar carnet de socio vigente"
        hint="Opcional. Requisitos para acceder al beneficio."
      />
      <Field
        label="Vigente hasta"
        name="valid_until"
        type="date"
        defaultValue={initial?.valid_until ?? ""}
        hint="Opcional. Fecha en que deja de estar disponible."
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
