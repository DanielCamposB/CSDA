"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const MatchSchema = z.object({
  sport_id: z.string().uuid(),
  is_home: z.enum(["true", "false"]).transform((v) => v === "true"),
  rival_name: z.string().trim().min(1).max(120),
  competition: z.string().trim().max(120).optional().or(z.literal("")),
  match_date: z.string().trim().min(1),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["programado", "confirmado", "suspendido", "reprogramado", "finalizado"]),
  home_score: z.string().optional().or(z.literal("")),
  away_score: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type FormState = { error?: string };

function toScore(v?: string) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createMatch(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = MatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("matches").insert({
    sport_id: parsed.data.sport_id,
    is_home: parsed.data.is_home,
    rival_name: parsed.data.rival_name,
    competition: parsed.data.competition || null,
    match_date: new Date(parsed.data.match_date).toISOString(),
    location: parsed.data.location || null,
    status: parsed.data.status,
    home_score: toScore(parsed.data.home_score),
    away_score: toScore(parsed.data.away_score),
    notes: parsed.data.notes || null,
  });
  if (error) return { error: "No se pudo guardar." };

  revalidatePath("/admin/partidos");
  revalidatePath("/");
  redirect("/admin/partidos");
}

export async function updateMatch(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = MatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("matches")
    .update({
      sport_id: parsed.data.sport_id,
      is_home: parsed.data.is_home,
      rival_name: parsed.data.rival_name,
      competition: parsed.data.competition || null,
      match_date: new Date(parsed.data.match_date).toISOString(),
      location: parsed.data.location || null,
      status: parsed.data.status,
      home_score: toScore(parsed.data.home_score),
      away_score: toScore(parsed.data.away_score),
      notes: parsed.data.notes || null,
    })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar." };

  revalidatePath("/admin/partidos");
  revalidatePath("/");
  redirect("/admin/partidos");
}

export async function deleteMatch(id: string) {
  const supabase = await createClient();
  await supabase.from("matches").delete().eq("id", id);
  revalidatePath("/admin/partidos");
  revalidatePath("/");
}
