"use client";

import Script from "next/script";
import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = { ok: false };

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

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

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-primary">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={120}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-primary">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="messageType" className="mb-1 block text-sm font-medium text-primary">
          Tipo de consulta
        </label>
        <select id="messageType" name="messageType" className={inputClass} defaultValue="consulta">
          <option value="consulta">Consulta</option>
          <option value="sugerencia">Sugerencia</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-primary">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className={inputClass}
        />
      </div>

      {/* Honeypot: invisible para personas, los bots suelen completarlo igual */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

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
