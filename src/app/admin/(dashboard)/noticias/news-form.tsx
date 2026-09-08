"use client";

import { useActionState } from "react";
import type { NewsPost } from "@/lib/types";
import type { FormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

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
      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Título</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">
          Slug (URL, ej: partido-vs-rival)
        </label>
        <input name="slug" required defaultValue={initial?.slug} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Categoría</label>
        <input name="category" defaultValue={initial?.category ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Resumen</label>
        <textarea
          name="excerpt"
          rows={2}
          maxLength={300}
          defaultValue={initial?.excerpt ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Contenido</label>
        <textarea
          name="content"
          required
          rows={10}
          defaultValue={initial?.content}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Imagen de portada</label>
        <input name="cover_image" type="file" accept="image/*" className={inputClass} />
        {initial?.cover_image_url && (
          <p className="mt-1 text-xs text-primary/50">Ya tiene una imagen. Sube una nueva para reemplazarla.</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary">Estado</label>
        <select name="status" defaultValue={initial?.status ?? "draft"} className={inputClass}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
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
