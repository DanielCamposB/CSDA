import Image from "next/image";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getClubFigures } from "@/lib/data";
import type { FigureCategory } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grandes figuras" };

const CATEGORY_LABELS: Record<FigureCategory, string> = {
  jugador: "Jugadores",
  entrenador: "Entrenadores",
  dirigente: "Dirigentes",
  profesor: "Profesores",
  colaborador: "Colaboradores",
};

export default async function GrandesFigurasPage() {
  const figures = await getClubFigures();
  const categories = Object.keys(CATEGORY_LABELS) as FigureCategory[];

  return (
    <Section title="Grandes figuras" subtitle="Los que dejaron huella en el club">
      {figures.length === 0 ? (
        <EmptyState message="Pronto reconoceremos aquí a nuestras grandes figuras." />
      ) : (
        <div className="space-y-10">
          {categories.map((category) => {
            const items = figures.filter((f) => f.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="mb-4 font-serif text-xl font-bold text-primary">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((figure) => (
                    <Card key={figure.id} className="flex gap-4 p-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-black/5">
                        {figure.photo_url && (
                          <Image
                            src={figure.photo_url}
                            alt={figure.full_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">{figure.full_name}</h4>
                        {figure.role_title && (
                          <p className="text-sm text-secondary">{figure.role_title}</p>
                        )}
                        {figure.period && (
                          <p className="text-xs text-primary/50">{figure.period}</p>
                        )}
                        {figure.achievements && (
                          <p className="mt-1 text-sm text-primary/70">{figure.achievements}</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
