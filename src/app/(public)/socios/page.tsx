import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getBenefits } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Socios" };

export default async function SociosPage() {
  const benefits = await getBenefits();

  return (
    <>
      <Section title="Beneficios y convenios" subtitle="Ventajas exclusivas para socios activos">
        {benefits.length === 0 ? (
          <EmptyState message="Los beneficios para socios se publicarán próximamente." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.id} className="p-4">
                <h3 className="font-semibold text-primary">{benefit.title}</h3>
                {benefit.sponsors && (
                  <p className="text-sm text-secondary">{benefit.sponsors.name}</p>
                )}
                {benefit.description && (
                  <p className="mt-2 text-sm text-primary/70">{benefit.description}</p>
                )}
                {benefit.conditions && (
                  <p className="mt-2 text-xs text-primary/50">{benefit.conditions}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Portal privado" className="bg-black/5">
        <Card className="p-8">
          <p className="text-primary/70">
            El portal privado para socios y jugadores (carnet digital, comunicaciones y
            beneficios exclusivos) llegará en una próxima etapa del proyecto.
          </p>
        </Card>
      </Section>
    </>
  );
}
