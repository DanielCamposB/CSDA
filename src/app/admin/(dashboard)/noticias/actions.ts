"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/admin/upload";

const NewsSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minúsculas, números y guiones."),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().trim().min(10),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  priority: z.string().optional().or(z.literal("")),
});

export type FormState = { error?: string };

export async function createNews(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = NewsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  let coverImageUrl: string | undefined;
  const image = formData.get("cover_image");
  try {
    if (image instanceof File) coverImageUrl = await uploadImage(image, "news");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("news").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content,
    category: parsed.data.category || null,
    status: parsed.data.status,
    cover_image_url: coverImageUrl,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
    author_id: user?.id ?? null,
    priority: parsed.data.priority ? Number(parsed.data.priority) : 0,
  });

  if (error) {
    return { error: error.code === "23505" ? "Ese slug ya existe." : "No se pudo guardar." };
  }

  revalidatePath("/admin/noticias");
  revalidatePath("/actualidad");
  redirect("/admin/noticias");
}

export async function updateNews(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = NewsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  let coverImageUrl: string | undefined;
  const image = formData.get("cover_image");
  try {
    if (image instanceof File && image.size > 0) {
      coverImageUrl = (await uploadImage(image, "news")) ?? undefined;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir la imagen." };
  }

  const { error } = await supabase
    .from("news")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      category: parsed.data.category || null,
      status: parsed.data.status,
      ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
      priority: parsed.data.priority ? Number(parsed.data.priority) : 0,
    })
    .eq("id", id);

  if (error) {
    return { error: "No se pudo actualizar." };
  }

  revalidatePath("/admin/noticias");
  revalidatePath("/actualidad");
  redirect("/admin/noticias");
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  await supabase.from("news").delete().eq("id", id);
  revalidatePath("/admin/noticias");
  revalidatePath("/actualidad");
}
