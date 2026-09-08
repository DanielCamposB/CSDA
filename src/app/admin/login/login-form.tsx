"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/field";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="Correo"
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="nombre@correo.com"
        hint="Obligatorio. El correo con el que se creó tu cuenta de administrador."
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        hint="Obligatorio. Tu contraseña de acceso al panel."
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary px-6 py-2.5 font-semibold text-cream transition-colors hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
