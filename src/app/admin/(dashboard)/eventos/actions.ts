"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const EventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  event_date: z.string().trim().min(1),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export type FormState = { error?: string };

async function coverFromForm(formData: FormData) {
  const image = formData.get("cover_image");
  if (image instanceof File && image.size > 0) {
    return uploadImage(image, "events");
  }
  return undefined;
}

export async function createEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = EventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let coverImageUrl: string | undefined;
  try {
    coverImageUrl = await coverFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    event_date: new Date(parsed.data.event_date).toISOString(),
    location: parsed.data.location || null,
    status: parsed.data.status,
    cover_image_url: coverImageUrl ?? null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/eventos");
  revalidatePath("/actualidad");
  redirect("/admin/eventos");
}

export async function updateEvent(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = EventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let coverImageUrl: string | undefined;
  try {
    coverImageUrl = await coverFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      event_date: new Date(parsed.data.event_date).toISOString(),
      location: parsed.data.location || null,
      status: parsed.data.status,
      ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/eventos");
  revalidatePath("/actualidad");
  redirect("/admin/eventos");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/admin/eventos");
  revalidatePath("/actualidad");
}
