"use client";

import { useActionState } from "react";
import { Field, PriorityField, SelectField, TextAreaField } from "@/components/ui/field";
import type { ClubEvent } from "@/lib/types";
import type { FormState } from "./actions";

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: ClubEvent;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field
        label="Título"
        name="title"
        required
        defaultValue={initial?.title}
        placeholder="Ej: Aniversario del club"
        hint="Obligatorio. El nombre del evento."
      />
      <Field
        label="Fecha y hora"
        name="event_date"
        type="datetime-local"
        required
        defaultValue={toLocalInputValue(initial?.event_date)}
        hint="Obligatorio. Cuándo se realiza el evento."
      />
      <Field
        label="Lugar"
        name="location"
        defaultValue={initial?.location ?? ""}
        placeholder="Ej: Sede social del club"
        hint="Opcional. Dónde se realiza el evento."
      />
      <TextAreaField
        label="Descripción"
        name="description"
        rows={4}
        defaultValue={initial?.description ?? ""}
        placeholder="Detalles del evento"
        hint="Opcional. Información adicional que quieras mostrar."
      />
      <Field
        label="Imagen"
        name="cover_image"
        type="file"
        accept="image/*"
        hint="Opcional. Formatos JPG, PNG, WEBP o GIF, máximo 8MB."
      />
      <SelectField
        label="Estado"
        name="status"
        defaultValue={initial?.status ?? "published"}
        hint="Un borrador no se muestra en el sitio público hasta que lo publiques."
      >
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
      </SelectField>

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
