"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BenefitSchema = z.object({
  sponsor_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  conditions: z.string().trim().max(300).optional().or(z.literal("")),
  valid_until: z.string().optional().or(z.literal("")),
});

export type FormState = { error?: string };

export async function createBenefit(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = BenefitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("benefits").insert({
    sponsor_id: parsed.data.sponsor_id || null,
    title: parsed.data.title,
    description: parsed.data.description || null,
    conditions: parsed.data.conditions || null,
    valid_until: parsed.data.valid_until || null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/beneficios");
  revalidatePath("/socios");
  redirect("/admin/beneficios");
}

export async function updateBenefit(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = BenefitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("benefits")
    .update({
      sponsor_id: parsed.data.sponsor_id || null,
      title: parsed.data.title,
      description: parsed.data.description || null,
      conditions: parsed.data.conditions || null,
      valid_until: parsed.data.valid_until || null,
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/beneficios");
  revalidatePath("/socios");
  redirect("/admin/beneficios");
}

export async function deleteBenefit(id: string) {
  const supabase = await createClient();
  await supabase.from("benefits").delete().eq("id", id);
  revalidatePath("/admin/beneficios");
  revalidatePath("/socios");
}
