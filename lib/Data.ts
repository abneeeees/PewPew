import type { Game, GamesPage, MenuItemProps } from "./types";

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
    // genres: data.genres,
    platforms: data.platforms,
    stores: data.stores,
    ratings: data.ratings,
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
  {
    label: "Community",
    href: "/community",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    label: "Collections",
    href: "/collections",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: "M13 10V3L4 14h7v7l9-11h-7z" ,
  },
];