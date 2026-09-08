import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SPORTS_CATALOG } from "@/lib/sports";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Deportes" };

export default function DeportesPage() {
  return (
    <Section title="Nuestros deportes">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SPORTS_CATALOG.map((sport) => (
          <Link key={sport.slug} href={`/deportes/${sport.slug}`}>
            <Card className="flex h-32 items-center justify-center p-4 text-center">
              <span className="font-semibold text-primary">{sport.name}</span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
