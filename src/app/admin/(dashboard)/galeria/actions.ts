"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const GallerySchema = z.object({
  title: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minúsculas, números y guiones."),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  sport_id: z.string().uuid().optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
});

export type FormState = { error?: string };

async function coverFromForm(formData: FormData) {
  const image = formData.get("cover_image");
  if (image instanceof File && image.size > 0) {
    return uploadImage(image, "galleries");
  }
  return undefined;
}

export async function createGallery(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = GallerySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let coverImageUrl: string | undefined;
  try {
    coverImageUrl = await coverFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      sport_id: parsed.data.sport_id || null,
      event_date: parsed.data.event_date || null,
      cover_image_url: coverImageUrl ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.code === "23505" ? "Ese slug ya existe." : "No se pudo guardar." };
  }

  revalidatePath("/admin/galeria");
  revalidatePath("/multimedia");
  redirect(`/admin/galeria/${data.id}`);
}

export async function updateGallery(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = GallerySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let coverImageUrl: string | undefined;
  try {
    coverImageUrl = await coverFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("galleries")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      sport_id: parsed.data.sport_id || null,
      event_date: parsed.data.event_date || null,
      ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/galeria");
  revalidatePath("/multimedia");
  return {};
}

export async function deleteGallery(id: string) {
  const supabase = await createClient();
  await supabase.from("galleries").delete().eq("id", id);
  revalidatePath("/admin/galeria");
  revalidatePath("/multimedia");
}

export async function addGalleryImages(galleryId: string, formData: FormData) {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .eq("gallery_id", galleryId)
    .order("sort_order", { ascending: false })
    .limit(1);
  let nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  for (const file of files) {
    const url = await uploadImage(file, `galleries/${galleryId}`);
    if (url) {
      await supabase
        .from("gallery_images")
        .insert({ gallery_id: galleryId, image_url: url, sort_order: nextOrder });
      nextOrder += 1;
    }
  }

  revalidatePath(`/admin/galeria/${galleryId}`);
  revalidatePath("/multimedia");
}

export async function deleteGalleryImage(galleryId: string, imageId: string) {
  const supabase = await createClient();
  await supabase.from("gallery_images").delete().eq("id", imageId);
  revalidatePath(`/admin/galeria/${galleryId}`);
  revalidatePath("/multimedia");
}
