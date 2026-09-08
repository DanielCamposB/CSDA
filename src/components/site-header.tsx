"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo-placeholder.svg" alt="Escudo CSD Algarrobo" width={42} height={49} priority />
          <span className="font-serif text-lg font-bold tracking-wide text-primary">
            C.S.D. ALGARROBO
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                pathname === link.href ? "text-secondary" : "text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-cream transition-colors hover:bg-accent"
          >
            Acceso privado
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span className="h-0.5 w-7 bg-primary" />
          <span className="h-0.5 w-7 bg-primary" />
          <span className="h-0.5 w-7 bg-primary" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/10 bg-cream px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded px-2 py-2 text-base font-medium ${
                pathname === link.href ? "bg-black/5 text-secondary" : "text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-cream"
          >
            Acceso privado
          </Link>
        </nav>
      )}
    </header>
  );
}
