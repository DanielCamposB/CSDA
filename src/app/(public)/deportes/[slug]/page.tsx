import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getMatchesBySport, getPlayersBySport, getSportBySlug, getTeamsBySport } from "@/lib/data";
import { SPORTS_CATALOG } from "@/lib/sports";
import type { Metadata } from "next";

export function generateStaticParams() {
  return SPORTS_CATALOG.map((sport) => ({ slug: sport.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const catalogSport = SPORTS_CATALOG.find((s) => s.slug === slug);
  return { title: catalogSport?.name ?? "Deporte" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
}

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalogSport = SPORTS_CATALOG.find((s) => s.slug === slug);
  if (!catalogSport) notFound();

  const sport = await getSportBySlug(slug);
  const [matches, teams, players] = sport
    ? await Promise.all([
        getMatchesBySport(sport.id),
        getTeamsBySport(sport.id),
        getPlayersBySport(sport.id),
      ])
    : [[], [], []];

  const upcoming = matches.filter((m) => m.status !== "finalizado");
  const played = matches.filter((m) => m.status === "finalizado");

  return (
    <>
      <Section title={catalogSport.name}>
        {teams.length === 0 ? (
          <EmptyState message="Las series y planteles de esta rama se publicarán pronto." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id} className="p-4">
                <h3 className="font-semibold text-primary">{team.name}</h3>
                {team.category && <p className="text-sm text-primary/60">{team.category}</p>}
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Próximos partidos" className="bg-black/5">
        {upcoming.length === 0 ? (
          <EmptyState message="No hay partidos programados en esta rama." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((match) => (
              <Card key={match.id} className="p-4">
                <p className="font-semibold text-primary">
                  {match.is_home ? "Algarrobo" : match.rival_name} vs{" "}
                  {match.is_home ? match.rival_name : "Algarrobo"}
                </p>
                <p className="text-sm text-primary/60">
                  {formatDate(match.match_date)}
                  {match.location ? ` · ${match.location}` : ""}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Resultados">
        {played.length === 0 ? (
          <EmptyState message="Aún no hay resultados en esta rama." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {played.map((match) => (
              <Card key={match.id} className="p-4">
                <p className="font-semibold text-primary">
                  {match.is_home ? "Algarrobo" : match.rival_name}{" "}
                  {match.is_home ? match.home_score : match.away_score} —{" "}
                  {match.is_home ? match.away_score : match.home_score}{" "}
                  {match.is_home ? match.rival_name : "Algarrobo"}
                </p>
                <p className="text-sm text-primary/60">{formatDate(match.match_date)}</p>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Plantel" className="bg-black/5">
        {players.length === 0 ? (
          <EmptyState message="El plantel de esta rama se publicará próximamente." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {players.map((player) => (
              <Card key={player.id} className="flex items-center gap-3 p-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-black/5">
                  {player.photo_url && (
                    <Image
                      src={player.photo_url}
                      alt={player.full_name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-primary">{player.full_name}</p>
                  {player.position && (
                    <p className="text-sm text-primary/60">{player.position}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
