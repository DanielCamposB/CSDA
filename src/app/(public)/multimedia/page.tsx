import Image from "next/image";
import Link from "next/link";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getFeaturedGalleries } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Multimedia" };

export default async function MultimediaPage() {
  const galleries = await getFeaturedGalleries(24);

  return (
    <Section title="Galerías" subtitle="Fotografías de partidos, torneos y eventos del club">
      {galleries.length === 0 ? (
        <EmptyState message="Pronto encontrarás fotografías del club aquí." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Link key={gallery.id} href={`/multimedia/${gallery.slug}`}>
              <Card className="overflow-hidden">
                <div className="relative h-44 w-full bg-black/5">
                  {gallery.cover_image_url && (
                    <Image
                      src={gallery.cover_image_url}
                      alt={gallery.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary">{gallery.title}</h3>
                  {gallery.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-primary/60">
                      {gallery.description}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
