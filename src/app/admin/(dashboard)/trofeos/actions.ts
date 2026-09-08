"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const TrophySchema = z.object({
  title: z.string().trim().min(2).max(150),
  year: z.string().optional().or(z.literal("")),
  sport_id: z.string().uuid().optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export type FormState = { error?: string };

async function imageFromForm(formData: FormData) {
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) return uploadImage(image, "trophies");
  return undefined;
}

export async function createTrophy(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = TrophySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let imageUrl: string | undefined;
  try {
    imageUrl = await imageFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("trophies").insert({
    title: parsed.data.title,
    year: parsed.data.year ? Number(parsed.data.year) : null,
    sport_id: parsed.data.sport_id || null,
    category: parsed.data.category || null,
    description: parsed.data.description || null,
    image_url: imageUrl ?? null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/trofeos");
  revalidatePath("/club/palmares");
  redirect("/admin/trofeos");
}

export async function updateTrophy(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = TrophySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let imageUrl: string | undefined;
  try {
    imageUrl = await imageFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("trophies")
    .update({
      title: parsed.data.title,
      year: parsed.data.year ? Number(parsed.data.year) : null,
      sport_id: parsed.data.sport_id || null,
      category: parsed.data.category || null,
      description: parsed.data.description || null,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/trofeos");
  revalidatePath("/club/palmares");
  redirect("/admin/trofeos");
}

export async function deleteTrophy(id: string) {
  const supabase = await createClient();
  await supabase.from("trophies").delete().eq("id", id);
  revalidatePath("/admin/trofeos");
  revalidatePath("/club/palmares");
}
