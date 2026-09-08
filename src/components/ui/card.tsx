import type { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-black/20 bg-white/50 p-8 text-center text-primary/60">
      {message}
    </div>
  );
}
