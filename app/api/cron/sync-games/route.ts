import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

// Define a type matching the API's response structure
interface GameData {
  id: number;
  name: string;
  slug: string;
  description_raw: string;
  tags: string[];
  platforms: string[];
  background_image: string | null;
}

export async function GET() {
  try {
    const RAWG_api_key = process.env.RAWG;

    try {
      const page = 1;
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${RAWG_api_key}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch data from RAWG API");
      }
      
      const gamedata = (await response.json()) as { results: GameData[] };
      console.log(`Fetched ${gamedata.results.length} games. Saving to PostgreSQL...`);

      for (const game of gamedata.results) {
        await prisma.gameSearch.upsert({
            where: { game_id: game.id },
            update: {
              name: game.name,
              slug: game.slug,
              tags: {
                connectorCreate: game.tags.map((tag: any) => ({
                  where: { tag_id: tag },
                  create: { tag_id: tag, name: tag.name },
                }))
              },
              platforms: game.platforms,
              background_image: game.background_image,
            },
            create: {
              game_id: game.id,
              name: game.name,
              slug: game.slug,
              tags: {
                connectorCreate: game.tags.map((tag: any) => ({
                  where: { tag_id: tag },
                  create: { tag_id: tag, name: tag.name },
                }))
              },
              platforms: game.platforms,
              background_image: game.background_image,
            },
        });
      }

      console.log("database sync complete");

      return NextResponse.json({ 
            success: true, 
            message: `Successfully synced ${gamedata.results.length} games.` 
          }, { status: 200 });
      
    } catch (error: Error | unknown) {
      return NextResponse.json(
        { error: "Error" ,
         message: error instanceof Error ? error.message : String(error)
        },
        { status: 500 },
      )
    } finally {
        await prisma.$disconnect();
    }
    
  } catch (error: Error | unknown) {
    return NextResponse.json(
      { error: "Error" ,
       status: 500 ,
       message: error instanceof Error ? error.message : String(error)
      },
    )
  }
}