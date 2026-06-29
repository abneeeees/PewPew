export type Game = {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  metacritic: number | null;
};

export type GamesPage = {
  games: Game[];
  count: number;
  currentPage: number;
  previousPage: string | null;
  nextPage: string | null;
};

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