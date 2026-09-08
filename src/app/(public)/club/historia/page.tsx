import Image from "next/image";
import { EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getClubHistory } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Historia del club" };

export default async function ClubHistoryPage() {
  const entries = await getClubHistory();

  return (
    <Section title="Historia del club" subtitle="Fundación, hitos y evolución a través de los años">
      {entries.length === 0 ? (
        <EmptyState message="La línea de tiempo del club se está construyendo. Vuelve pronto." />
      ) : (
        <ol className="relative border-l-2 border-secondary/40 pl-6">
          {entries.map((entry) => (
            <li key={entry.id} className="mb-10 last:mb-0">
              <div className="absolute -ml-[31px] mt-1.5 h-3 w-3 rounded-full bg-secondary" />
              {entry.year && (
                <span className="text-sm font-bold text-secondary">{entry.year}</span>
              )}
              <h3 className="mt-1 font-serif text-xl font-bold text-primary">{entry.title}</h3>
              {entry.description && (
                <p className="mt-2 max-w-2xl text-primary/70">{entry.description}</p>
              )}
              {entry.image_url && (
                <div className="relative mt-3 h-56 w-full max-w-md overflow-hidden rounded-lg">
                  <Image src={entry.image_url} alt={entry.title} fill className="object-cover" />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
