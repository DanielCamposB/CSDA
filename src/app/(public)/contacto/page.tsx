import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { CLUB_ADDRESS, SOCIAL_LINKS } from "@/lib/social";
import { ContactForm } from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLUB_ADDRESS)}`;

  return (
    <Section title="Contacto" subtitle="Escríbenos tus consultas o sugerencias">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <ContactForm />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-primary">Ubicación</h3>
          <p className="mt-2 text-sm text-primary/70">{CLUB_ADDRESS}</p>
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            Ver en Google Maps →
          </a>

          <h3 className="mt-6 font-semibold text-primary">Otras formas de contacto</h3>
          <p className="mt-2 text-sm text-primary/70">
            Síguenos en nuestras redes sociales para novedades y comunicados oficiales.
          </p>
          <div className="mt-2 flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-semibold text-secondary hover:underline"
              >
                {social.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
