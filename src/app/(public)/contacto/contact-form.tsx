"use client";

import Script from "next/script";
import { useActionState } from "react";
import { Field, SelectField, TextAreaField } from "@/components/ui/field";
import { submitContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (state.ok) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-accent">
        ¡Gracias! Recibimos tu mensaje y te responderemos pronto.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {siteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}

      <Field
        label="Nombre"
        name="name"
        autoComplete="name"
        required
        maxLength={120}
        placeholder="Tu nombre completo"
        hint="Obligatorio. Escribe tu nombre completo (mínimo 2 caracteres)."
      />

      <Field
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={200}
        placeholder="nombre@correo.com"
        hint="Obligatorio. Usa un correo válido para poder responderte."
      />

      <SelectField
        label="Tipo de consulta"
        name="messageType"
        defaultValue="consulta"
        hint="Elige si es una consulta general o una sugerencia para el club."
      >
        <option value="consulta">Consulta</option>
        <option value="sugerencia">Sugerencia</option>
      </SelectField>

      <TextAreaField
        label="Mensaje"
        name="message"
        required
        minLength={10}
        maxLength={2000}
        rows={5}
        placeholder="Escribe aquí tu consulta o sugerencia (mínimo 10 caracteres)"
        hint="Obligatorio. Entre 10 y 2000 caracteres."
      />

      {/* Honeypot: invisible para personas, los bots suelen completarlo igual */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <p className="text-xs text-primary/50">Los campos marcados con * son obligatorios.</p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-2.5 font-semibold text-cream transition-colors hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
