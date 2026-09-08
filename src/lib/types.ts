export type Profile = {
  id: string;
  full_name: string | null;
  role: "admin" | "editor";
};

export type Sport = {
  id: string;
  name: string;
  slug: string;
};

export type Season = {
  id: string;
  name: string;
  year: number;
  is_current: boolean;
};

export type Team = {
  id: string;
  sport_id: string;
  season_id: string | null;
  name: string;
  category: string | null;
};

export type Player = {
  id: string;
  team_id: string | null;
  full_name: string;
  position: string | null;
  jersey_number: number | null;
  photo_url: string | null;
  bio: string | null;
  is_published: boolean;
};

export type MatchStatus =
  | "programado"
  | "confirmado"
  | "suspendido"
  | "reprogramado"
  | "finalizado";

export type Match = {
  id: string;
  sport_id: string;
  team_id: string | null;
  is_home: boolean;
  rival_name: string;
  competition: string | null;
  match_date: string;
  location: string | null;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
};

export type ClubHistoryEntry = {
  id: string;
  year: number | null;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type Trophy = {
  id: string;
  title: string;
  year: number | null;
  sport_id: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
};

export type Director = {
  id: string;
  full_name: string;
  role_title: string;
  period: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
};

export type FigureCategory = "jugador" | "entrenador" | "dirigente" | "profesor" | "colaborador";

export type ClubFigure = {
  id: string;
  full_name: string;
  category: FigureCategory;
  role_title: string | null;
  period: string | null;
  bio: string | null;
  achievements: string | null;
  photo_url: string | null;
  sort_order: number;
};

export type NewsStatus = "draft" | "published";

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  status: NewsStatus;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
};

export type ClubEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  cover_image_url: string | null;
  status: "draft" | "published";
};

export type Gallery = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sport_id: string | null;
  event_date: string | null;
  cover_image_url: string | null;
};

export type GalleryImage = {
  id: string;
  gallery_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export type SponsorTier = "principal" | "oficial" | "colaborador";

export type Sponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: SponsorTier;
  description: string | null;
};

export type Benefit = {
  id: string;
  sponsor_id: string | null;
  title: string;
  description: string | null;
  conditions: string | null;
  valid_until: string | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message_type: "consulta" | "sugerencia";
  message: string;
  created_at: string;
  handled: boolean;
};
