"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  messageType: z.enum(["consulta", "sugerencia"]),
  message: z.string().trim().min(10).max(2000),
  honeypot: z.string().max(0), // debe llegar vacío; los bots suelen rellenar todos los campos
  turnstileToken: z.string().optional().default(""),
});

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Sin CAPTCHA configurado aún (fase de desarrollo): no bloquear el formulario.
    return true;
  }
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    messageType: formData.get("messageType"),
    message: formData.get("message"),
    honeypot: formData.get("website"),
    turnstileToken: formData.get("cf-turnstile-response") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario." };
  }

  const captchaValid = await verifyTurnstile(parsed.data.turnstileToken);
  if (!captchaValid) {
    return { ok: false, error: "No pudimos verificar que eres una persona. Intenta de nuevo." };
  }

  const supabase = await createClient();

  const { data: recent } = await supabase
    .from("contact_messages")
    .select("id")
    .eq("email", parsed.data.email)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString())
    .limit(1);

  if (recent && recent.length > 0) {
    return { ok: false, error: "Ya recibimos un mensaje tuyo hace instantes. Espera un minuto." };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message_type: parsed.data.messageType,
    message: parsed.data.message,
  });

  if (error) {
    return { ok: false, error: "No pudimos enviar tu mensaje. Intenta más tarde." };
  }

  return { ok: true };
}
