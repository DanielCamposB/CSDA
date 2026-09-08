"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const baseInputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-primary placeholder:text-primary/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

type ValidatableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function spanishValidityMessage(el: ValidatableElement): string {
  const v = el.validity;
  const type = "type" in el ? el.type : undefined;

  if (v.valueMissing) return "Este campo es obligatorio.";
  if (v.typeMismatch) {
    if (type === "email") return "Ingresa un correo electrónico válido (ej: nombre@correo.com).";
    if (type === "url") return "Ingresa una URL válida (debe empezar con http:// o https://).";
    return "El formato ingresado no es válido.";
  }
  if (v.tooShort) {
    const min = "minLength" in el ? el.minLength : undefined;
    return `Debe tener al menos ${min} caracteres.`;
  }
  if (v.tooLong) {
    const max = "maxLength" in el ? el.maxLength : undefined;
    return `No puede superar los ${max} caracteres.`;
  }
  if (v.patternMismatch) return "El formato ingresado no es válido.";
  if (v.rangeUnderflow) {
    const min = "min" in el ? el.min : undefined;
    return `El valor mínimo permitido es ${min}.`;
  }
  if (v.rangeOverflow) {
    const max = "max" in el ? el.max : undefined;
    return `El valor máximo permitido es ${max}.`;
  }
  if (v.stepMismatch) return "El valor ingresado no es válido para este campo.";
  if (v.badInput) return "El valor ingresado no es válido.";
  return "Revisa este campo.";
}

function handleInvalid(e: React.InvalidEvent<ValidatableElement>) {
  e.currentTarget.setCustomValidity(spanishValidityMessage(e.currentTarget));
}

function clearCustomValidity(e: React.SyntheticEvent<ValidatableElement>) {
  e.currentTarget.setCustomValidity("");
}

function HintIcon({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span
        aria-hidden="true"
        className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-primary/25 bg-transparent text-[10px] font-bold leading-none text-primary/40 transition-colors hover:border-secondary hover:text-secondary"
      >
        ?
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-52 -translate-x-1/2 rounded-md bg-primary px-2.5 py-1.5 text-xs leading-snug text-cream opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required,
  hint,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-1 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-primary">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && <HintIcon text={hint} />}
    </div>
  );
}

type CommonProps = {
  label: string;
  name: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

export function Field({
  label,
  name,
  hint,
  required,
  className = "",
  ...rest
}: CommonProps & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "required" | "className">) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={name} label={label} required={required} hint={hint} />
      <input
        id={name}
        name={name}
        required={required}
        className={baseInputClass}
        onInvalid={handleInvalid}
        onChange={clearCustomValidity}
        {...rest}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  required,
  className = "",
  ...rest
}: CommonProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "required" | "className">) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={name} label={label} required={required} hint={hint} />
      <textarea
        id={name}
        name={name}
        required={required}
        className={baseInputClass}
        onInvalid={handleInvalid}
        onChange={clearCustomValidity}
        {...rest}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  hint,
  required,
  className = "",
  children,
  ...rest
}: CommonProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "required" | "className"> & {
    children: ReactNode;
  }) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={name} label={label} required={required} hint={hint} />
      <select
        id={name}
        name={name}
        required={required}
        className={baseInputClass}
        onInvalid={handleInvalid}
        onChange={clearCustomValidity}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

export function PriorityField({ defaultValue }: { defaultValue?: number }) {
  return (
    <SelectField
      label="Prioridad"
      name="priority"
      defaultValue={String(defaultValue ?? 0)}
      hint="Baja = orden normal. Media o Alta lo destacan y lo hacen aparecer primero en las rotaciones del sitio."
    >
      <option value="0">Baja</option>
      <option value="1">Media</option>
      <option value="2">Alta</option>
    </SelectField>
  );
}

export const inputClass = baseInputClass;
