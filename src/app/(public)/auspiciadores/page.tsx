import Image from "next/image";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getSponsors } from "@/lib/data";
import type { SponsorTier } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Auspiciadores" };

const TIER_LABELS: Record<SponsorTier, string> = {
  principal: "Auspiciador principal",
  oficial: "Auspiciador oficial",
  colaborador: "Colaborador",
};

export default async function AuspiciadoresPage() {
  const sponsors = await getSponsors();

  return (
    <Section title="Auspiciadores" subtitle="Empresas y marcas que apoyan al club">
      {sponsors.length === 0 ? (
        <EmptyState message="Aún no se han publicado auspiciadores." />
      ) : (
        <div className="space-y-8">
          {(["principal", "oficial", "colaborador"] as SponsorTier[]).map((tier) => {
            const items = sponsors.filter((s) => s.tier === tier);
            if (items.length === 0) return null;
            return (
              <div key={tier}>
                <h3 className="mb-3 font-serif text-lg font-bold text-primary">
                  {TIER_LABELS[tier]}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((sponsor) => (
                    <Card key={sponsor.id} className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="relative h-16 w-32">
                        {sponsor.logo_url ? (
                          <Image
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-semibold text-primary">{sponsor.name}</span>
                        )}
                      </div>
                      {sponsor.description && (
                        <p className="text-sm text-primary/60">{sponsor.description}</p>
                      )}
                      {sponsor.website_url && (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm font-semibold text-secondary"
                        >
                          Visitar sitio
                        </a>
                      )}
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
