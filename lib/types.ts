export type Platform = {
  platform: {
    id: number;
    name: string;
    image_background: string;
  };

  released_at: string;
};

// interface for game data
export type Game = {
  id: number;
  slug: string;
  name: string;
  released: string;
  description?: string;
  rating: number;
  metacritic: number | null;
  background_image: string;
  platforms: Platform[];
};

// interface for games page
export type GamesPage = {
  games: Game[];
  count: number;
  currentPage: number;
  previousPage: string | null;
  nextPage: string | null;
};

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