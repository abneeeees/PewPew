import { NextResponse } from "next/server";

export async function GET() {
  const RAWG_api_key = process.env.RAWG;
  if (!RAWG_api_key) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.rawg.io/api/platforms?key=${RAWG_api_key}&page_size=40`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      return NextResponse.json({ error: `RAWG error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      platforms: data.results.map((p: { id: number; name: string; slug: string }) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
      })),
    });
  } catch (err) {
    console.error("Platforms fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch platforms" }, { status: 500 });
  }
}
