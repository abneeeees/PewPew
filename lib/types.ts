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