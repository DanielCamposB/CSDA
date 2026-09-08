import Image from "next/image";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getTrophies } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Palmarés" };

export default async function PalmaresPage() {
  const trophies = await getTrophies();

  return (
    <Section title="Palmarés / Trofeos" subtitle="Los logros que enorgullecen al club">
      {trophies.length === 0 ? (
        <EmptyState message="Aún no se han registrado campeonatos." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trophies.map((trophy) => (
            <Card key={trophy.id} className="flex gap-4 p-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-secondary/10">
                {trophy.image_url && (
                  <Image src={trophy.image_url} alt={trophy.title} fill className="object-cover" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-primary">{trophy.title}</h3>
                <p className="text-sm text-secondary">{trophy.year}</p>
                {trophy.category && <p className="text-xs text-primary/50">{trophy.category}</p>}
                {trophy.description && (
                  <p className="mt-1 text-sm text-primary/70">{trophy.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
