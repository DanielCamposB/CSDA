"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const HistorySchema = z.object({
  title: z.string().trim().min(2).max(150),
  year: z.string().optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  sort_order: z.string().optional().or(z.literal("")),
});

export type FormState = { error?: string };

async function imageFromForm(formData: FormData) {
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) return uploadImage(image, "history");
  return undefined;
}

export async function createHistoryEntry(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = HistorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let imageUrl: string | undefined;
  try {
    imageUrl = await imageFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("club_history").insert({
    title: parsed.data.title,
    year: parsed.data.year ? Number(parsed.data.year) : null,
    description: parsed.data.description || null,
    sort_order: parsed.data.sort_order ? Number(parsed.data.sort_order) : 0,
    image_url: imageUrl ?? null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/historia");
  revalidatePath("/club/historia");
  redirect("/admin/historia");
}

export async function updateHistoryEntry(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = HistorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let imageUrl: string | undefined;
  try {
    imageUrl = await imageFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("club_history")
    .update({
      title: parsed.data.title,
      year: parsed.data.year ? Number(parsed.data.year) : null,
      description: parsed.data.description || null,
      sort_order: parsed.data.sort_order ? Number(parsed.data.sort_order) : 0,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/historia");
  revalidatePath("/club/historia");
  redirect("/admin/historia");
}

export async function deleteHistoryEntry(id: string) {
  const supabase = await createClient();
  await supabase.from("club_history").delete().eq("id", id);
  revalidatePath("/admin/historia");
  revalidatePath("/club/historia");
}
