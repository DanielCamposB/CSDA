import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export async function uploadImage(file: File, folder: string): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagen no permitido (usa JPG, PNG, WEBP o GIF).");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo permitido (8MB).");
  }

  const supabase = await createClient();
  const extension = file.type.split("/")[1] ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error("No se pudo subir la imagen.");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
