import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type SearchResult = {
  game_id: number;
  name: string;
  slug: string | null;
  backgroundImage: string | null;
  rating: number | null;
  score: number;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json(
      { message: "No search parameter provided." },
      { status: 400 }
    );
  }

  try {
    const games = await prisma.$queryRaw<SearchResult[]>`
      SELECT
        game_id,
        name,
        slug,
        "backgroundImage",
        rating,

        GREATEST(
          ts_rank(
            search_vector,
            websearch_to_tsquery('english', ${q})
          ),
          similarity(name, ${q})
        ) AS score

      FROM game_searches

      WHERE
        search_vector @@ websearch_to_tsquery('english', ${q})
        OR name ILIKE ${`%${q}%`}
        OR name % ${q}

      ORDER BY
        score DESC,
        rating DESC NULLS LAST

      LIMIT 10;
    `;

    return NextResponse.json(games);
  } catch (error) {
    console.error("Search query failed:", error);
    return NextResponse.json(
      { message: "Search failed." },
      { status: 500 }
    );
  }
}