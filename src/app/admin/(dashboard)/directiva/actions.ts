"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const DirectorSchema = z.object({
  full_name: z.string().trim().min(2).max(150),
  role_title: z.string().trim().min(2).max(120),
  period: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  sort_order: z.string().optional().or(z.literal("")),
});

export type FormState = { error?: string };

async function photoFromForm(formData: FormData) {
  const image = formData.get("photo");
  if (image instanceof File && image.size > 0) return uploadImage(image, "directors");
  return undefined;
}

export async function createDirector(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = DirectorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let photoUrl: string | undefined;
  try {
    photoUrl = await photoFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("directors").insert({
    full_name: parsed.data.full_name,
    role_title: parsed.data.role_title,
    period: parsed.data.period || null,
    bio: parsed.data.bio || null,
    sort_order: parsed.data.sort_order ? Number(parsed.data.sort_order) : 0,
    photo_url: photoUrl ?? null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/directiva");
  revalidatePath("/club/directiva");
  redirect("/admin/directiva");
}

export async function updateDirector(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = DirectorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let photoUrl: string | undefined;
  try {
    photoUrl = await photoFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("directors")
    .update({
      full_name: parsed.data.full_name,
      role_title: parsed.data.role_title,
      period: parsed.data.period || null,
      bio: parsed.data.bio || null,
      sort_order: parsed.data.sort_order ? Number(parsed.data.sort_order) : 0,
      ...(photoUrl ? { photo_url: photoUrl } : {}),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/directiva");
  revalidatePath("/club/directiva");
  redirect("/admin/directiva");
}

export async function deleteDirector(id: string) {
  const supabase = await createClient();
  await supabase.from("directors").delete().eq("id", id);
  revalidatePath("/admin/directiva");
  revalidatePath("/club/directiva");
}
