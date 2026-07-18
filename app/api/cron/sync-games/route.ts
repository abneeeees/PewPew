import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

interface Tags {
  name: string;
}

interface Publishers {
  name: string;
}

interface Platform {
  platform: {
    name: string;
  };
}

// Define a type matching the API's response structure
interface GameData {
  id: number;
  name: string;
  slug: string;
  tags: Tags[];
  platforms: Platform[];
  background_image: string | null;
  released: string;
  rating: number;
}

interface OtherGameData {
  id: number;
  slug: string;
  description_raw: string;
  publishers: Publishers[];
}


export async function FetchOtherGameDetails(
  slug: string
): Promise<OtherGameData | null | undefined> {
  
  const RAWG_api_key = process.env.RAWG;

  if (!RAWG_api_key) {
    throw new Error("RAWG API key not set");
  }

  const response = await fetch(
    `https://api.rawg.io/api/games/${slug}?key=${RAWG_api_key}`
  );

  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error("Failed to fetch game");
  }

  const gamedata = await response.json();
  
  return {
    id: gamedata.id,
    slug: gamedata.slug,
    description_raw: gamedata.description_raw,
    publishers: gamedata.publishers
  };   
}

export async function GET() {
  try {
    const RAWG_api_key = process.env.RAWG;

    if (!RAWG_api_key) {
      throw new Error("RAWG API Key not found");
    }
    
    const page = 1;
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_api_key}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch data from RAWG API");
    }
    
    const { results } = (await response.json()) as { results: GameData[] };
    console.log(`Fetched ${results.length} games. Saving to PostgreSQL...`);


    const detailsList = await Promise.all(
      results.map((game) => FetchOtherGameDetails(game.slug))
    );
    
    for (let i = 0; i < results.length; i++) {
      const game = results[i]
      const details = detailsList[i]
          
      const gamedata = {
        name: game.name,
        
        slug: details?.slug ?? null,

        description: details?.description_raw ?? null,

        tags: game.tags.map((tag) => tag.name),

        platforms: game.platforms.map(
          (platform) => platform.platform.name
        ),

        publishers:
          details?.publishers.map(
            (publisher) => publisher.name
          ) ?? [],
        backgroundImage: game.background_image,

        released: game.released ? new Date(game.released) : null,

        rating: game.rating,
      };
      
      await prisma.gameSearch.upsert({
        where: {
          game_id: game.id,
        },
        update: gamedata,
        create: {
          game_id: game.id,
          ...gamedata
        }
      });
    }

    console.log("database sync complete");

    return NextResponse.json({ 
          success: true, 
          message: `Successfully synced ${results.length} games.` 
        }, { status: 200 });
    
  } catch (error: Error | unknown) {
    return NextResponse.json(
      { error: "Error" ,
       status: 500 ,
       message: error instanceof Error ? error.message : String(error)
      },
    )
  }
}