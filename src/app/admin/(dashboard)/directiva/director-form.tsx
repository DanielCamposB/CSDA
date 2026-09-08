"use client";

import { useActionState } from "react";
import { Field, TextAreaField } from "@/components/ui/field";
import type { Director } from "@/lib/types";
import type { FormState } from "./actions";

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
      <Field
        label="Nombre completo"
        name="full_name"
        required
        defaultValue={initial?.full_name}
        placeholder="Ej: María González"
        hint="Obligatorio. Nombre y apellido."
      />
      <Field
        label="Cargo"
        name="role_title"
        required
        defaultValue={initial?.role_title}
        placeholder="Ej: Presidenta"
        hint="Obligatorio. El cargo que ocupa en la directiva."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Período"
          name="period"
          defaultValue={initial?.period ?? ""}
          placeholder="Ej: 2024 - 2026"
          hint="Opcional. Período en el cargo."
        />
        <Field
          label="Orden"
          name="sort_order"
          type="number"
          defaultValue={initial?.sort_order ?? 0}
          hint="Define el orden de aparición (menor número aparece primero)."
        />
      </div>
      <TextAreaField
        label="Biografía"
        name="bio"
        rows={3}
        defaultValue={initial?.bio ?? ""}
        placeholder="Trayectoria dentro del club"
        hint="Opcional."
      />
      <Field
        label="Fotografía"
        name="photo"
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
