import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Lightbox } from "@/components/lightbox";
import { getGalleryBySlug } from "@/lib/data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getGalleryBySlug(slug);
  return { title: result?.gallery.title ?? "Galería" };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getGalleryBySlug(slug);
  if (!result) notFound();
  const { gallery, images } = result;

  return (
    <Section title={gallery.title} subtitle={gallery.description ?? undefined}>
      {images.length === 0 ? (
        <EmptyState message="Esta galería todavía no tiene fotografías." />
      ) : (
        <Lightbox images={images} altPrefix={gallery.title} />
      )}
    </Section>
  );
}
