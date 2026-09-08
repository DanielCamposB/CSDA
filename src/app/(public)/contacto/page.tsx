import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ContactForm } from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  return (
    <Section title="Contacto" subtitle="Escríbenos tus consultas o sugerencias">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <ContactForm />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-primary">Ubicación</h3>
          <p className="mt-2 text-sm text-primary/70">Algarrobo, Región de Valparaíso, Chile.</p>
          <h3 className="mt-6 font-semibold text-primary">Otras formas de contacto</h3>
          <p className="mt-2 text-sm text-primary/70">
            Síguenos en nuestras redes sociales para novedades y comunicados oficiales.
          </p>
        </Card>
      </div>
    </Section>
  );
}
