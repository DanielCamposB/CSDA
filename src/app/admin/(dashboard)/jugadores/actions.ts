"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const PlayerSchema = z.object({
  team_id: z.string().uuid().optional().or(z.literal("")),
  full_name: z.string().trim().min(2).max(150),
  position: z.string().trim().max(80).optional().or(z.literal("")),
  jersey_number: z.string().optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  is_published: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export type FormState = { error?: string };

async function photoFromForm(formData: FormData) {
  const image = formData.get("photo");
  if (image instanceof File && image.size > 0) {
    return uploadImage(image, "players");
  }
  return undefined;
}

export async function createPlayer(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = PlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let photoUrl: string | undefined;
  try {
    photoUrl = await photoFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({
    team_id: parsed.data.team_id || null,
    full_name: parsed.data.full_name,
    position: parsed.data.position || null,
    jersey_number: parsed.data.jersey_number ? Number(parsed.data.jersey_number) : null,
    bio: parsed.data.bio || null,
    is_published: parsed.data.is_published,
    photo_url: photoUrl ?? null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/jugadores");
  redirect("/admin/jugadores");
}

export async function updatePlayer(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = PlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let photoUrl: string | undefined;
  try {
    photoUrl = await photoFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({
      team_id: parsed.data.team_id || null,
      full_name: parsed.data.full_name,
      position: parsed.data.position || null,
      jersey_number: parsed.data.jersey_number ? Number(parsed.data.jersey_number) : null,
      bio: parsed.data.bio || null,
      is_published: parsed.data.is_published,
      ...(photoUrl ? { photo_url: photoUrl } : {}),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/jugadores");
  redirect("/admin/jugadores");
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();
  await supabase.from("players").delete().eq("id", id);
  revalidatePath("/admin/jugadores");
}
