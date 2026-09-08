"use client";

import { useActionState } from "react";
import { Field, SelectField, TextAreaField } from "@/components/ui/field";
import type { Gallery, Sport } from "@/lib/types";
import type { FormState } from "./actions";

export function GalleryForm({
  action,
  sports,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  sports: Sport[];
  initial?: Gallery;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field
        label="Título"
        name="title"
        required
        defaultValue={initial?.title}
        placeholder="Ej: Torneo de aniversario 2026"
        hint="Obligatorio. El nombre de la galería."
      />
      <Field
        label="Slug (URL)"
        name="slug"
        required
        defaultValue={initial?.slug}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        placeholder="ej: torneo-aniversario-2026"
        hint="Obligatorio. Solo minúsculas, números y guiones, sin espacios ni tildes."
      />
      <SelectField
        label="Deporte"
        name="sport_id"
        defaultValue={initial?.sport_id ?? ""}
        hint="Opcional. Si la galería es de una rama deportiva específica."
      >
        <option value="">General</option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </SelectField>
      <Field
        label="Fecha"
        name="event_date"
        type="date"
        defaultValue={initial?.event_date ?? ""}
        hint="Opcional. Fecha del evento o partido fotografiado."
      />
      <TextAreaField
        label="Descripción"
        name="description"
        rows={2}
        defaultValue={initial?.description ?? ""}
        placeholder="Breve descripción de la galería"
        hint="Opcional."
      />
      <Field
        label="Imagen de portada"
        name="cover_image"
        type="file"
        accept="image/*"
        hint="Opcional. Formatos JPG, PNG, WEBP o GIF, máximo 8MB. Si no la eliges, se usa la primera foto que subas abajo."
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
