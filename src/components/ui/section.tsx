import type { ReactNode } from "react";

export function Section({
  title,
  subtitle,
  className = "",
  children,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-12 ${className}`}>
      {title && (
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-primary/70">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
