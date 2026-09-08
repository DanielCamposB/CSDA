"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const TeamSchema = z.object({
  sport_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().max(80).optional().or(z.literal("")),
});

export type FormState = { error?: string };

export async function createTeam(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = TeamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("teams").insert({
    sport_id: parsed.data.sport_id,
    name: parsed.data.name,
    category: parsed.data.category || null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/equipos");
  redirect("/admin/equipos");
}

export async function deleteTeam(id: string) {
  const supabase = await createClient();
  await supabase.from("teams").delete().eq("id", id);
  revalidatePath("/admin/equipos");
}
