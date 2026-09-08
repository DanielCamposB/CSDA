// Script de un solo uso: sube las fotos de Instagram_files a Supabase Storage
// y crea una galería por carpeta. Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local.
// Uso: node scripts/import-photos.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(projectRoot, ".env.local");
  const content = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

const env = loadEnvLocal();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SOURCE_DIR = "C:\\Users\\dcamposb\\Videos\\Instagram_files";

const FOLDERS = [
  { folder: "Serie Honor", title: "Serie de Honor", slug: "serie-de-honor", sportSlug: "futbol" },
  { folder: "Tercera Adulta", title: "Tercera Adulta", slug: "tercera-adulta", sportSlug: "futbol" },
  { folder: "Super Senior", title: "Super Senior", slug: "super-senior", sportSlug: "futbol" },
  { folder: "Femenino", title: "Fútbol Femenino", slug: "futbol-femenino", sportSlug: "futbol" },
  { folder: "infantil", title: "Infantil", slug: "infantil", sportSlug: "escuela-de-futbol" },
  {
    folder: "Escuela de Futbol",
    title: "Escuela de Fútbol",
    slug: "escuela-de-futbol-fotos",
    sportSlug: "escuela-de-futbol",
  },
  { folder: "barra", title: "La Barra", slug: "la-barra", sportSlug: null },
  { folder: "antiguas", title: "Fotos antiguas", slug: "fotos-antiguas", sportSlug: null },
  { folder: "Auspicios", title: "Auspicios", slug: "auspicios-fotos", sportSlug: null },
  { folder: "nuevos proyectos", title: "Nuevos proyectos", slug: "nuevos-proyectos", sportSlug: null },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const CONTENT_TYPE = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };

async function getSportId(slug) {
  if (!slug) return null;
  const { data } = await supabase.from("sports").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

async function importFolder({ folder, title, slug, sportSlug }) {
  const dirPath = path.join(SOURCE_DIR, folder);
  let files;
  try {
    files = readdirSync(dirPath).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
  } catch {
    console.log(`⚠ Carpeta no encontrada, se omite: ${folder}`);
    return;
  }
  if (files.length === 0) {
    console.log(`⚠ Sin imágenes, se omite: ${folder}`);
    return;
  }

  const { data: existing } = await supabase.from("galleries").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    console.log(`↷ Ya existe la galería "${title}", se omite.`);
    return;
  }

  const sportId = await getSportId(sportSlug);

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .insert({ title, slug, sport_id: sportId })
    .select("id")
    .single();

  if (galleryError || !gallery) {
    console.error(`✗ No se pudo crear la galería "${title}":`, galleryError?.message);
    return;
  }

  let sortOrder = 0;
  let coverUrl = null;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const storagePath = `galleries/${gallery.id}/${crypto.randomUUID()}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, { contentType: CONTENT_TYPE[ext] ?? "image/jpeg" });

    if (uploadError) {
      console.error(`  ✗ Error subiendo ${file}:`, uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(storagePath);
    const url = publicUrlData.publicUrl;
    if (!coverUrl) coverUrl = url;

    await supabase.from("gallery_images").insert({ gallery_id: gallery.id, image_url: url, sort_order: sortOrder });
    sortOrder += 1;
  }

  if (coverUrl) {
    await supabase.from("galleries").update({ cover_image_url: coverUrl }).eq("id", gallery.id);
  }

  console.log(`✓ "${title}": ${sortOrder} foto(s) subidas.`);
}

for (const entry of FOLDERS) {
  await importFolder(entry);
}

console.log("Listo.");
