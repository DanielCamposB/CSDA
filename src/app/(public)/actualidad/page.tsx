import Image from "next/image";
import Link from "next/link";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getLatestNews, getUpcomingEvents } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Actualidad" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ActualidadPage() {
  const [news, events] = await Promise.all([getLatestNews(12), getUpcomingEvents(6)]);

  return (
    <>
      <Section title="Noticias y comunicados">
        {news.length === 0 ? (
          <EmptyState message="Todavía no se han publicado noticias." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((post) => (
              <Link key={post.id} href={`/actualidad/${post.slug}`}>
                <Card className="h-full overflow-hidden">
                  {post.cover_image_url && (
                    <div className="relative h-44 w-full">
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {post.category && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                        {post.category}
                      </span>
                    )}
                    <h3 className="mt-1 font-semibold text-primary">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-primary/60">{post.excerpt}</p>
                    )}
                    {post.published_at && (
                      <p className="mt-2 text-xs text-primary/40">
                        {formatDate(post.published_at)}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section title="Próximos eventos" className="bg-black/5">
        {events.length === 0 ? (
          <EmptyState message="No hay eventos próximos por ahora." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <p className="text-sm font-semibold text-secondary">{formatDate(event.event_date)}</p>
                <h3 className="mt-1 font-semibold text-primary">{event.title}</h3>
                {event.location && <p className="mt-1 text-sm text-primary/60">{event.location}</p>}
                {event.description && (
                  <p className="mt-2 text-sm text-primary/70">{event.description}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
