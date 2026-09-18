import type { Game, GamesPage, ScreenShots, MenuItemProps } from "./types";

export async function getGames(page = 1): Promise<GamesPage> {
  const RAWG_api_key = process.env.RAWG;
  const response = await fetch(
    `https://api.rawg.io/api/games?key=${RAWG_api_key}&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();

  return {
    games: data.results,
    count: data.count,
    currentPage: page,
    previousPage: page > 1 ? `?page=${page - 1}` : null,
    nextPage: data.next ? `?page=${page + 1}` : null,
  };
}

export async function getGameScreenshots(slug: string): Promise<ScreenShots[]> {
  const RAWG_api_key = process.env.RAWG;
  const response = await fetch(
    `https://api.rawg.io/api/games/${slug}/screenshots?key=${RAWG_api_key}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game screenshots");
  }

  const data = await response.json();

  return data.results;
}

export async function eachGame(slug: string): Promise<Game | null> {
  const RAWG_api_key = process.env.RAWG;
  const response = await fetch(
    `https://api.rawg.io/api/games/${slug}?key=${RAWG_api_key}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch game");
  }

  const data = await response.json();

  return {
    id: data.id,
    slug: data.slug,
    description_raw: data.description_raw,
    background_image: data.background_image,
    background_image_additional: data.background_image_additional,
    name: data.name,
    released: data.released,
    rating: data.rating,
    metacritic: data.metacritic,
    tags: data.tags,
    platforms: data.platforms,
    stores: data.stores,
    ratings: data.ratings,
    publishers: data.publishers,
    website: data.website,
  };
}

export const menuItems: MenuItemProps[] = [
  {
    label: "Home",
    href: "/",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Games",
    href: "/games",
    icon: "M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z",
  },
];