import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo-placeholder.svg" alt="Escudo CSD Algarrobo" width={36} height={42} />
            <span className="font-serif text-base font-bold">C.S.D. ALGARROBO</span>
          </div>
          <p className="mt-3 text-sm text-cream/70">
            Club Social y Deportivo Algarrobo. Historia, deporte y comunidad.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-secondary">Navegación</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-secondary">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>Algarrobo, Chile</li>
            <li>
              <Link href="/contacto" className="hover:text-secondary">
                Enviar un mensaje
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-secondary">Síguenos</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>
              <Link href="/#redes" className="hover:text-secondary">
                Redes sociales
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Club Social y Deportivo Algarrobo. Todos los derechos reservados.
      </div>
    </footer>
  );
}
