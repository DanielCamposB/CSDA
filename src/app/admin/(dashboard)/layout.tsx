import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "../login/actions";
import { ADMIN_NAV } from "@/lib/admin-nav";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black/5">
      <aside className="hidden w-56 flex-col bg-primary text-cream lg:flex">
        <div className="px-5 py-6 font-serif text-lg font-bold">CSD Algarrobo</div>
        <nav className="flex-1 space-y-1 px-3">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-cream/80 hover:bg-cream/10 hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="px-3 pb-6">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-cream/70 hover:bg-cream/10"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="border-b border-black/10 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-primary">Panel CSD Algarrobo</span>
            <form action={logout}>
              <button type="submit" className="text-sm font-medium text-primary/70">
                Salir
              </button>
            </form>
          </div>
          <nav className="mt-2 flex gap-3 overflow-x-auto text-sm">
            {ADMIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap text-primary/70">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
