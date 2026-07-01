import { Url } from "next/dist/shared/lib/router/router";

export type Requirements = {
  minimum?: string;
  recommended?: string;
};

export type Platform = {
  platform: {
    id: number;
    name: string;
    requirements?: Requirements[];
  };

  released_at: string;
};

export type Store = {
  id: number;
};

export type ratings = {
  id: number;
  title: string;
  percent: number;
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
  // genres: Tag[];
  platforms: Platform[];
  stores: Store[];
  ratings: ratings[];
  publishers: string[];
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


// ==================================================================================


// interface for menu items
export interface MenuItemProps {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

// interface for sections
export interface SectionProps {
  title: string
  description?: string
}