import { Url } from "next/dist/shared/lib/router/router";

export type Platform = {
  platform: {
    id: number;
    name: string;
    slug: string;
  };

  released_at: string;

  requirements?: {
    minimum?: string;
    recommended?: string;
  };
};

export type Store = {
  id: number;
};

export type ratings = {
  id: number;
  title: string;
  percent: number;
}

export type publishers = {
  id: number
  name: string
}

export type ScreenShots = {
  id: number;
  image: string;  
}

export type Game = {
  id: number;
  slug: string;
  name: string;
  released: string;
  description_raw?: string;
  rating: number;
  metacritic: number | null;
  background_image: string;
  background_image_additional: string;
  tags: {
    id: number;
    name: string;
  }[];
  genres?: {
    id: number;
    name: string;
    slug: string;
  }[];
  platforms: Platform[];
  stores: Store[];
  ratings: ratings[];
  publishers: publishers[];
  website?: Url;
};

// interface for games page
export type GamesPage = {
  games: Game[];
  count: number;
  currentPage: number;
  previousPage: string | null;
  nextPage: string | null;
};

// ================================= Search & Filter Types =======================================

export type SortOption =
  | "-released"     // Newest first
  | "released"      // Oldest first
  | "-rating"       // Highest rated
  | "rating"        // Lowest rated
  | "name"          // A–Z
  | "-name"         // Z–A
  | "-added"        // Recently added
  | "-metacritic"   // Highest metacritic
  | "metacritic";   // Lowest metacritic

export type SearchParams = {
  search?: string;
  genres?: string;        // comma-separated genre slugs
  platforms?: string;     // comma-separated platform IDs
  tags?: string;          // comma-separated tag slugs
  publishers?: string;    // comma-separated publisher slugs
  dates?: string;         // "YYYY-01-01,YYYY-12-31"
  metacritic?: string;    // "min,max"
  ordering?: SortOption;
  page?: number;
  page_size?: number;
};

export type Genre = {
  id: number;
  name: string;
  slug: string;
  games_count: number;
};

export type PlatformOption = {
  id: number;
  name: string;
  slug: string;
};

export type SuggestionItem = {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  rating: number;
  released: string;
  publishers?: publishers[];
  genres?: { id: number; name: string; slug: string }[];
  type: "game" | "genre" | "publisher" | "tag";
};

export type ActiveFilters = {
  search: string;
  genres: string[];
  platforms: string[];
  tags: string[];
  publishers: string[];
  releaseYearMin: string;
  releaseYearMax: string;
  metacriticMin: string;
  metacriticMax: string;
  ordering: SortOption;
};

// ================================= UI Types =======================================

export interface MenuItemProps {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

export interface SectionProps {
  title: string
  description?: string
}