"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const SponsorSchema = z.object({
  name: z.string().trim().min(2).max(150),
  website_url: z.string().trim().url().optional().or(z.literal("")),
  tier: z.enum(["principal", "oficial", "colaborador"]),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  priority: z.string().optional().or(z.literal("")),
});

export type FormState = { error?: string };

async function logoFromForm(formData: FormData) {
  const image = formData.get("logo");
  if (image instanceof File && image.size > 0) return uploadImage(image, "sponsors");
  return undefined;
}

export async function createSponsor(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = SponsorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let logoUrl: string | undefined;
  try {
    logoUrl = await logoFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir el logo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sponsors").insert({
    name: parsed.data.name,
    website_url: parsed.data.website_url || null,
    tier: parsed.data.tier,
    description: parsed.data.description || null,
    logo_url: logoUrl ?? null,
    priority: parsed.data.priority ? Number(parsed.data.priority) : 0,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/auspiciadores");
  revalidatePath("/auspiciadores");
  revalidatePath("/");
  redirect("/admin/auspiciadores");
}

export async function updateSponsor(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = SponsorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let logoUrl: string | undefined;
  try {
    logoUrl = await logoFromForm(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir el logo." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("sponsors")
    .update({
      name: parsed.data.name,
      website_url: parsed.data.website_url || null,
      tier: parsed.data.tier,
      description: parsed.data.description || null,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      priority: parsed.data.priority ? Number(parsed.data.priority) : 0,
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/auspiciadores");
  revalidatePath("/auspiciadores");
  revalidatePath("/");
  redirect("/admin/auspiciadores");
}

export async function deleteSponsor(id: string) {
  const supabase = await createClient();
  await supabase.from("sponsors").delete().eq("id", id);
  revalidatePath("/admin/auspiciadores");
  revalidatePath("/auspiciadores");
  revalidatePath("/");
}
