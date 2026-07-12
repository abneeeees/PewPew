import { NextRequest, NextResponse } from "next/server";

const RAWG_BASE = "https://api.rawg.io/api";

export async function GET(req: NextRequest) {
  const RAWG_api_key = process.env.RAWG;
  if (!RAWG_api_key) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const incoming = req.nextUrl.searchParams;

  // Build RAWG params, forwarding only valid params
  const params = new URLSearchParams({ key: RAWG_api_key });

  const forwardable = [
    "search",
    "genres",
    "platforms",
    "tags",
    "publishers",
    "dates",
    "metacritic",
    "ordering",
    "page",
    "page_size",
  ];

  for (const key of forwardable) {
    const val = incoming.get(key);
    if (val && val.trim() !== "") {
      params.set(key, val);
    }
  }

  // Suggestion mode — lightweight fields only
  const suggest = incoming.get("suggest") === "1";
  if (suggest) {
    params.set("page_size", "6");
    params.set("fields", "id,slug,name,background_image,rating,released,publishers,genres");
  }

  // Always request essential fields + enable fuzzy search
  if (incoming.get("search")) {
    params.set("search_exact", "false");
  }

  const url = `${RAWG_BASE}/games?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60s
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `RAWG error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (suggest) {
      // Return lightweight suggestion payload
      const suggestions = (data.results || []).map(
        (g: {
          id: number;
          slug: string;
          name: string;
          background_image: string | null;
          rating: number;
          released: string;
          publishers?: { id: number; name: string }[];
          genres?: { id: number; name: string; slug: string }[];
        }) => ({
          id: g.id,
          slug: g.slug,
          name: g.name,
          background_image: g.background_image,
          rating: g.rating,
          released: g.released,
          publishers: g.publishers?.slice(0, 1) ?? [],
          genres: g.genres?.slice(0, 2) ?? [],
          type: "game",
        })
      );
      return NextResponse.json({ suggestions, count: data.count });
    }

    return NextResponse.json({
      games: data.results,
      count: data.count,
      next: data.next,
    });
  } catch (err) {
    console.error("RAWG fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
