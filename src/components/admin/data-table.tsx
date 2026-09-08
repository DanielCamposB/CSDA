import Link from "next/link";
import type { ReactNode } from "react";

export function AdminPageHeader({ title, newHref }: { title: string; newHref: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="font-serif text-2xl font-bold text-primary">{title}</h1>
      <Link
        href={newHref}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-accent"
      >
        + Nuevo
      </Link>
    </div>
  );
}

export function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-black/10 bg-black/5 text-primary/70">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">{children}</tbody>
      </table>
    </div>
  );
}
