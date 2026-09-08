import Image from "next/image";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getDirectors } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Directiva" };

export default async function DirectivaPage() {
  const directors = await getDirectors();

  return (
    <Section title="Directiva y organigrama" subtitle="Quiénes dirigen hoy el club">
      {directors.length === 0 ? (
        <EmptyState message="La directiva vigente se publicará próximamente." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {directors.map((director) => (
            <Card key={director.id} className="flex gap-4 p-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-black/5">
                {director.photo_url && (
                  <Image
                    src={director.photo_url}
                    alt={director.full_name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-primary">{director.full_name}</h3>
                <p className="text-sm text-secondary">{director.role_title}</p>
                {director.period && <p className="text-xs text-primary/50">{director.period}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
