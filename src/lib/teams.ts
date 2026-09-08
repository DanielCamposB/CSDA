import type { Team } from "@/lib/types";

type MatchTeamsJoin = { match_teams?: { teams: { name: string } | null }[] | null };

export function matchTeamNames(match: MatchTeamsJoin): string[] {
  return (match.match_teams ?? [])
    .map((mt) => mt.teams?.name)
    .filter((name): name is string => Boolean(name));
}

export function groupTeamsByCategory(teams: Team[]): [string, Team[]][] {
  const sorted = [...teams].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  const groups = new Map<string, Team[]>();
  for (const team of sorted) {
    const key = team.category ?? "Otras";
    const group = groups.get(key);
    if (group) group.push(team);
    else groups.set(key, [team]);
  }
  return [...groups.entries()];
}
