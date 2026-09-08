import Image from "next/image";
import Link from "next/link";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { RotatingShowcase } from "@/components/rotating-showcase";
import { chunkItems } from "@/lib/chunk";
import {
  getFeaturedGalleries,
  getInstagramWallPhotos,
  getLatestNews,
  getRecentResults,
  getSponsors,
  getUpcomingEvents,
  getUpcomingMatches,
} from "@/lib/data";
import type { ClubEvent, Gallery, Match, NewsPost } from "@/lib/types";
import { SPORTS_CATALOG } from "@/lib/sports";
import { SOCIAL_LINKS } from "@/lib/social";
import { RecentPhotosBanner } from "@/components/recent-photos-banner";
import { matchTeamNames } from "@/lib/teams";

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

type MatchWithTeams = Match & { match_teams?: { teams: { name: string } | null }[] | null };

function MatchCard({ match }: { match: MatchWithTeams }) {
  const teamNames = matchTeamNames(match);
  return (
    <Card className="flex flex-col items-center gap-3 p-8 text-center">
      {teamNames.length > 0 && (
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
          {teamNames.join(" · ")}
        </span>
      )}
      <div className="flex items-center gap-6 text-xl font-bold text-primary">
        <span>{match.is_home ? "Algarrobo" : match.rival_name}</span>
        <span className="text-secondary">VS</span>
        <span>{match.is_home ? match.rival_name : "Algarrobo"}</span>
      </div>
      <p className="text-primary/70">
        {formatDate(match.match_date)} · {formatTime(match.match_date)}
        {match.location ? ` · ${match.location}` : ""}
      </p>
      {match.competition && <p className="text-sm text-primary/50">{match.competition}</p>}
    </Card>
  );
}

function ResultCard({ match }: { match: MatchWithTeams }) {
  const teamNames = matchTeamNames(match);
  return (
    <Card className="flex flex-col items-center gap-2 p-8 text-center">
      {teamNames.length > 0 && (
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
          {teamNames.join(" · ")}
        </span>
      )}
      <div className="text-2xl font-bold text-primary">
        {match.is_home ? "Algarrobo" : match.rival_name}{" "}
        {match.is_home ? match.home_score : match.away_score} —{" "}
        {match.is_home ? match.away_score : match.home_score}{" "}
        {match.is_home ? match.rival_name : "Algarrobo"}
      </div>
      <p className="text-primary/70">{formatDate(match.match_date)}</p>
    </Card>
  );
}

function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/actualidad/${post.slug}`}>
      <Card className="h-full overflow-hidden">
        {post.cover_image_url && (
          <div className="relative h-44 w-full">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-primary">{post.title}</h3>
          {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-primary/60">{post.excerpt}</p>}
        </div>
      </Card>
    </Link>
  );
}

function EventCard({ event }: { event: ClubEvent }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-secondary">{formatDate(event.event_date)}</p>
      <h3 className="mt-1 font-semibold text-primary">{event.title}</h3>
      {event.location && <p className="mt-1 text-sm text-primary/60">{event.location}</p>}
    </Card>
  );
}

function GalleryCard({ gallery }: { gallery: Gallery }) {
  return (
    <Link href={`/multimedia/${gallery.slug}`}>
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
  );
}

export default async function HomePage() {
  const [matches, results, news, events, galleries, sponsors, wallPhotos] = await Promise.all([
    getUpcomingMatches(8),
    getRecentResults(8),
    getLatestNews(9),
    getUpcomingEvents(9),
    getFeaturedGalleries(9),
    getSponsors(),
    getInstagramWallPhotos(40),
  ]);

  const bannerPhotos = wallPhotos.map((photo) => {
    const gallery = Array.isArray(photo.galleries) ? photo.galleries[0] : photo.galleries;
    return {
      id: photo.id,
      image_url: photo.image_url,
      caption: photo.caption,
      href: gallery ? `/multimedia/${gallery.slug}` : "/multimedia",
    };
  });

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <Image src="/logo.jpg" alt="Escudo CSD Algarrobo" width={100} height={100} />
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

      <RecentPhotosBanner photos={bannerPhotos} />

      <Section title="Próximos partidos">
        {matches.length > 0 ? (
          <RotatingShowcase
            intervalMs={4500}
            pages={matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          />
        ) : (
          <EmptyState message="Aún no hay partidos programados." />
        )}
      </Section>

      <Section title="Últimos resultados" className="bg-black/5">
        {results.length > 0 ? (
          <RotatingShowcase
            intervalMs={4500}
            pages={results.map((match) => (
              <ResultCard key={match.id} match={match} />
            ))}
          />
        ) : (
          <EmptyState message="Aún no hay resultados registrados." />
        )}
      </Section>

      <Section title="Últimas noticias" subtitle="Lo que está pasando en el club">
        {news.length > 0 ? (
          <RotatingShowcase
            intervalMs={5000}
            pages={chunkItems(news, 3).map((group, i) => (
              <div key={i} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            ))}
          />
        ) : (
          <EmptyState message="Todavía no se han publicado noticias." />
        )}
      </Section>

      <Section title="Próximos eventos" className="bg-black/5">
        {events.length > 0 ? (
          <RotatingShowcase
            intervalMs={5000}
            pages={chunkItems(events, 3).map((group, i) => (
              <div key={i} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ))}
          />
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
          <RotatingShowcase
            intervalMs={5000}
            pages={chunkItems(galleries, 3).map((group, i) => (
              <div key={i} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((gallery) => (
                  <GalleryCard key={gallery.id} gallery={gallery} />
                ))}
              </div>
            ))}
          />
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
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-primary/20 px-5 py-2 text-sm font-medium text-primary transition-colors hover:border-secondary hover:text-secondary"
            >
              {social.label}
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
