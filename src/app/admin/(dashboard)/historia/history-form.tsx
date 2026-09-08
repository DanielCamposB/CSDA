"use client";

import { useActionState } from "react";
import { Field, TextAreaField } from "@/components/ui/field";
import type { ClubHistoryEntry } from "@/lib/types";
import type { FormState } from "./actions";

export function HistoryForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: ClubHistoryEntry;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field
        label="Título del hito"
        name="title"
        required
        defaultValue={initial?.title}
        placeholder="Ej: Fundación del club"
        hint="Obligatorio. Nombre del hito histórico."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Año"
          name="year"
          type="number"
          defaultValue={initial?.year ?? ""}
          placeholder="Ej: 1938"
          hint="Opcional. Año en que ocurrió."
        />
        <Field
          label="Orden"
          name="sort_order"
          type="number"
          defaultValue={initial?.sort_order ?? 0}
          hint="Define el orden en la línea de tiempo (menor número aparece primero)."
        />
      </div>
      <TextAreaField
        label="Descripción"
        name="description"
        rows={4}
        defaultValue={initial?.description ?? ""}
        placeholder="Cuenta la historia de este hito"
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
