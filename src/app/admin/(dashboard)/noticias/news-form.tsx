"use client";

import { useActionState } from "react";
import { Field, PriorityField, SelectField, TextAreaField } from "@/components/ui/field";
import type { NewsPost } from "@/lib/types";
import type { FormState } from "./actions";

export function NewsForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: NewsPost;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Field
        label="Título"
        name="title"
        required
        defaultValue={initial?.title}
        placeholder="Ej: Victoria ante Unión el Litre"
        hint="Obligatorio. El titular de la noticia."
      />

      <Field
        label="Slug (URL)"
        name="slug"
        required
        defaultValue={initial?.slug}
        placeholder="ej: partido-vs-rival"
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        hint="Obligatorio. Solo minúsculas, números y guiones, sin espacios ni tildes. Define la dirección web de la noticia."
      />

      <Field
        label="Categoría"
        name="category"
        defaultValue={initial?.category ?? ""}
        placeholder="Ej: Fútbol, Institucional, Comunicado"
        hint="Opcional. Sirve para agrupar noticias similares."
      />

      <TextAreaField
        label="Resumen"
        name="excerpt"
        rows={2}
        maxLength={300}
        defaultValue={initial?.excerpt ?? ""}
        placeholder="Un par de líneas que resuman la noticia"
        hint="Opcional. Se muestra en las tarjetas de noticias (máx. 300 caracteres)."
      />

      <TextAreaField
        label="Contenido"
        name="content"
        required
        rows={10}
        defaultValue={initial?.content}
        placeholder="Escribe aquí el cuerpo completo de la noticia"
        hint="Obligatorio. El texto completo de la noticia."
      />

      <div>
        <Field
          label="Imagen de portada"
          name="cover_image"
          type="file"
          accept="image/*"
          hint="Opcional. Formatos JPG, PNG, WEBP o GIF, máximo 8MB."
        />
        {initial?.cover_image_url && (
          <p className="mt-1 text-xs text-primary/50">Ya tiene una imagen. Sube una nueva para reemplazarla.</p>
        )}
      </div>

      <SelectField
        label="Estado"
        name="status"
        defaultValue={initial?.status ?? "draft"}
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
