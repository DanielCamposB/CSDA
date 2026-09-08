import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Club" };

const LINKS = [
  { href: "/club/historia", label: "Historia", desc: "Fundación, hitos y evolución del club." },
  { href: "/club/grandes-figuras", label: "Grandes figuras", desc: "Jugadores, entrenadores y dirigentes que dejaron huella." },
  { href: "/club/palmares", label: "Palmarés / Trofeos", desc: "Campeonatos y logros deportivos." },
  { href: "/club/directiva", label: "Directiva", desc: "Organigrama y cargos institucionales." },
  { href: "/club/himno", label: "Himno", desc: "El himno oficial del club." },
];

export default function ClubPage() {
  return (
    <>
      <Section title="Quiénes somos">
        <Card className="p-8">
          <p className="text-primary/80">
            El Club Social y Deportivo Algarrobo es una institución que une a socios, jugadores,
            familias e hinchas en torno al deporte y la comunidad. Aquí encontrarás nuestra
            historia, a las personas que han dejado huella, nuestros logros y la estructura que
            hoy dirige el club.
          </p>
        </Card>
      </Section>

      <Section title="Explora el club" className="bg-black/5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full p-5">
                <h3 className="font-semibold text-primary">{link.label}</h3>
                <p className="mt-1 text-sm text-primary/60">{link.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
