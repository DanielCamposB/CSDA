import Image from "next/image";
import Link from "next/link";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  getFeaturedGalleries,
  getLastResult,
  getLatestNews,
  getNextMatch,
  getSponsors,
  getUpcomingEvents,
} from "@/lib/data";
import { SPORTS_CATALOG } from "@/lib/sports";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

export default async function HomePage() {
  const [nextMatch, lastResult, news, events, galleries, sponsors] = await Promise.all([
    getNextMatch(),
    getLastResult(),
    getLatestNews(3),
    getUpcomingEvents(3),
    getFeaturedGalleries(3),
    getSponsors(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <Image src="/logo-placeholder.svg" alt="Escudo CSD Algarrobo" width={96} height={112} />
          <h1 className="font-serif text-3xl font-extrabold tracking-wide sm:text-5xl">
            CLUB SOCIAL Y DEPORTIVO ALGARROBO
          </h1>
          <p className="max-w-xl text-cream/80">
            Historia, deporte y comunidad. Conoce nuestros equipos, resultados y todo lo que
            pasa en el club.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/club"
              className="rounded-full bg-secondary px-6 py-2.5 font-semibold text-primary transition-colors hover:bg-secondary-light"
            >
              Conoce nuestro club
            </Link>
            <Link
              href="/deportes/futbol"
              className="rounded-full border border-cream/40 px-6 py-2.5 font-semibold transition-colors hover:bg-cream/10"
            >
              Próximo partido
            </Link>
          </div>
        </div>
      </section>

      <Section title="Próximo partido">
        {nextMatch ? (
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex items-center gap-6 text-xl font-bold text-primary">
              <span>{nextMatch.is_home ? "Algarrobo" : nextMatch.rival_name}</span>
              <span className="text-secondary">VS</span>
              <span>{nextMatch.is_home ? nextMatch.rival_name : "Algarrobo"}</span>
            </div>
            <p className="text-primary/70">
              {formatDate(nextMatch.match_date)} · {formatTime(nextMatch.match_date)}
              {nextMatch.location ? ` · ${nextMatch.location}` : ""}
            </p>
            {nextMatch.competition && (
              <p className="text-sm text-primary/50">{nextMatch.competition}</p>
            )}
          </Card>
        ) : (
          <EmptyState message="Aún no hay partidos programados." />
        )}
      </Section>

      <Section title="Último resultado" className="bg-black/5">
        {lastResult ? (
          <Card className="flex flex-col items-center gap-2 p-8 text-center">
            <div className="text-2xl font-bold text-primary">
              {lastResult.is_home ? "Algarrobo" : lastResult.rival_name}{" "}
              {lastResult.is_home ? lastResult.home_score : lastResult.away_score} —{" "}
              {lastResult.is_home ? lastResult.away_score : lastResult.home_score}{" "}
              {lastResult.is_home ? lastResult.rival_name : "Algarrobo"}
            </div>
            <p className="text-primary/70">{formatDate(lastResult.match_date)}</p>
          </Card>
        ) : (
          <EmptyState message="Aún no hay resultados registrados." />
        )}
      </Section>

      <Section title="Últimas noticias" subtitle="Lo que está pasando en el club">
        {news.length > 0 ? (
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
                    <h3 className="font-semibold text-primary">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-primary/60">{post.excerpt}</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="Todavía no se han publicado noticias." />
        )}
      </Section>

      <Section title="Próximos eventos" className="bg-black/5">
        {events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <p className="text-sm font-semibold text-secondary">{formatDate(event.event_date)}</p>
                <h3 className="mt-1 font-semibold text-primary">{event.title}</h3>
                {event.location && <p className="mt-1 text-sm text-primary/60">{event.location}</p>}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState message="No hay eventos próximos por ahora." />
        )}
      </Section>

      <Section title="Nuestros deportes">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPORTS_CATALOG.map((sport) => (
            <Link key={sport.slug} href={`/deportes/${sport.slug}`}>
              <Card className="flex h-28 items-center justify-center p-4 text-center">
                <span className="font-semibold text-primary">{sport.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Galería destacada" className="bg-black/5">
        {galleries.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <Link key={gallery.id} href={`/multimedia/${gallery.slug}`}>
                <Card className="overflow-hidden">
                  {gallery.cover_image_url && (
                    <div className="relative h-44 w-full">
                      <Image
                        src={gallery.cover_image_url}
                        alt={gallery.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-primary">{gallery.title}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="Pronto encontrarás fotografías del club aquí." />
        )}
      </Section>

      <Section title="Historia del club">
        <Card className="p-8">
          <p className="text-primary/80">
            El Club Social y Deportivo Algarrobo lleva años forjando historia, comunidad y deporte
            en la ciudad. Conoce nuestra fundación, nuestros hitos y a las personas que dejaron
            huella.
          </p>
          <Link href="/club/historia" className="mt-4 inline-block font-semibold text-secondary">
            Conoce nuestra historia →
          </Link>
        </Card>
      </Section>

      {sponsors.length > 0 && (
        <Section title="Auspiciadores" className="bg-black/5">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex flex-col items-center gap-2">
                {sponsor.logo_url ? (
                  <Image
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <span className="font-semibold text-primary">{sponsor.name}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Síguenos en redes">
        <div id="redes" className="flex flex-wrap justify-center gap-4">
          {["Instagram", "Facebook", "YouTube", "TikTok"].map((network) => (
            <span
              key={network}
              className="rounded-full border border-primary/20 px-5 py-2 text-sm font-medium text-primary"
            >
              {network}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
