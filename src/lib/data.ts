import { createClient } from "@/lib/supabase/server";
import type {
  ClubEvent,
  ClubFigure,
  ClubHistoryEntry,
  Director,
  Gallery,
  GalleryImage,
  NewsPost,
  Sponsor,
  Sport,
  Trophy,
} from "@/lib/types";

export async function getSports(): Promise<Sport[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("sports").select("*").order("name");
  return data ?? [];
}

export async function getSportBySlug(slug: string): Promise<Sport | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("sports").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getPlayersBySport(sportId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*, teams!inner(sport_id, name)")
    .eq("teams.sport_id", sportId)
    .eq("is_published", true);
  return data ?? [];
}

export async function getTeamsBySport(sportId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("sport_id", sportId)
    .order("category")
    .order("sort_order")
    .order("name");
  return data ?? [];
}

export async function getUpcomingMatches(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*, match_teams(teams(name))")
    .in("status", ["programado", "confirmado", "reprogramado"])
    .gte("match_date", new Date().toISOString())
    .order("priority", { ascending: false })
    .order("match_date", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getRecentResults(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*, match_teams(teams(name))")
    .eq("status", "finalizado")
    .order("priority", { ascending: false })
    .order("match_date", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getMatchesBySport(sportId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*, match_teams(teams(name))")
    .eq("sport_id", sportId)
    .order("match_date", { ascending: false });
  return data ?? [];
}

export async function getLatestNews(limit = 9): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("priority", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getFeaturedNews(limit = 6): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .gt("priority", 0)
    .order("priority", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function getUpcomingEvents(limit = 9): Promise<ClubEvent[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString())
    .order("priority", { ascending: false })
    .order("event_date", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getFeaturedGalleries(limit = 9): Promise<Gallery[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("galleries")
    .select("*")
    .order("event_date", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getGalleryBySlug(
  slug: string,
): Promise<{ gallery: Gallery; images: GalleryImage[] } | null> {
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("galleries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!gallery) return null;
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("gallery_id", gallery.id)
    .order("sort_order", { ascending: true });
  return { gallery, images: images ?? [] };
}

export async function getInstagramWallPhotos(limit = 40) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption, gallery_id, sort_order, galleries(slug, title)")
    .order("gallery_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("*")
    .order("tier")
    .order("priority", { ascending: false });
  return data ?? [];
}

export async function getFeaturedSponsors(limit = 6): Promise<Sponsor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("*")
    .gt("priority", 0)
    .order("priority", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getBenefits() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("benefits")
    .select("*, sponsors(name, logo_url)")
    .order("priority", { ascending: false })
    .order("valid_until", { ascending: true, nullsFirst: false });
  return data ?? [];
}

export async function getFeaturedBenefits(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("benefits")
    .select("*, sponsors(name, logo_url)")
    .gt("priority", 0)
    .order("priority", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getClubHistory(): Promise<ClubHistoryEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("club_history")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getTrophies(): Promise<Trophy[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trophies")
    .select("*")
    .order("year", { ascending: false });
  return data ?? [];
}

export async function getDirectors(): Promise<Director[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("directors")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getClubFigures(): Promise<ClubFigure[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("club_figures")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}
