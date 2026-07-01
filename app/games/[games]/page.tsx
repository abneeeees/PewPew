import AppShell from "@/components/AppShell";
import { eachGame } from "@/lib/Data";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Global/Footer";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ games: string }>;
}): Promise<Metadata> {
  const { games } = await params;
  const game = await eachGame(games);

  if (!game) {
    return { title: "Game not found | pewpew" };
  }

  return {
    title: `${game.name} | pewpew`,
    description: `View ${game.name} on pewpew.`,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ games: string }>;
}) {
  const { games } = await params;
  const game = await eachGame(games);

  if (!game) {
    notFound();
  }

  return (
    <AppShell>
      {/* header */}
        <section className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              unoptimized
              sizes="100vw"
              className="z-0 opacity-20 blur-xs object-cover saturate-100 contrast-130 brightness-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-surface to-background" />
          )}
  
          <div className="absolute opacity-40 inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
  
          <div className="relative flex h-full flex-col justify-end px-4 pb-8 sm:px-6 lg:px-8">
            <Link
              href="/games"
              className="mt-10 mb-45 inline-flex w-fit items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
            >
              ← Back to games
            </Link>

          <Link
            href={`${game.website}`}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl lg:text-5xl hover:text-white">
              {game.name}
            </h1>
          </Link>
  
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {game.released && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-muted backdrop-blur">{(game.released)}</span>
              )}
  
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-yellow-400 backdrop-blur">
                ★ {game.rating.toFixed(1)}
              </span>
  
              {game.metacritic != null && (
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    game.metacritic >= 75
                      ? "bg-green-500/20 text-green-400"
                      : game.metacritic >= 50
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  Metacritic {game.metacritic}
                </span>
              )}
            </div>
          
            <div className="align-left mt-4">
              <p className="text-left font-semibold text-sm text-white/80">A Game by {game.publishers[0].name}</p>
            </div>
          </div>
        </section>
  
        {/* tags and genre */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {game.tags.map((gameTag) => (
                <span
                  className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 transition-colors hover:bg-white/20 backdrop-blur"
                  key={gameTag.id}
                >
                  {gameTag.name}
                </span>
              ))}
            </div>
          </div>
        </section>

      {/* description */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div>
              <span className="font-sans font-medium text-sm text-muted">
                Description
              </span>
             
            <div className="rounded-xl mt-3 border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <pre className="whitespace-pre-wrap font-semilight rounded-lg bg-black/20 p-3 text-sm leading-6 text-white">
                {game.description_raw}
              </pre>
            </div>
          </div>
        </section>
  
        {/* platforms */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <span className="font-sans font-medium text-sm text-muted">Platforms</span>
          
        
            <div className="flex mt-3 flex-wrap items-center gap-2">
              {game.platforms.map(({ platform }) => (
                <span
                  key={platform.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 transition-colors hover:bg-white/20 backdrop-blur"
                >
                  {platform.name}
                </span>
              ))}
            </div>
          </div>
      </section>

      {/* Requirements */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div>
            <span className="font-sans font-medium text-sm text-muted">
                Requirements
            </span>

          <div className="mt-4 flex flex-col gap-4">
            {game.platforms
              .filter(({ requirements }) => 
                requirements?.minimum || requirements?.recommended
              )
              .map(({ platform, requirements }) => (
                
                <div
                  key={platform.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  
                  <h2 className="mb-3 text-base font-semibold text-white">
                    For {platform.name}
                  </h2>
            
                  <div className="space-y-3">

            
                    {requirements?.minimum && (
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/50">
                          Minimum
                        </p>
            
                        <pre className="whitespace-pre-wrap rounded-lg bg-black/20 p-3 text-sm leading-6 text-white/70">
                          {requirements.minimum}
                        </pre>
                      </div>
                    )}
            
                    {requirements?.recommended && (
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/50">
                          Recommended
                        </p>
            
                        <pre className="whitespace-pre-wrap rounded-lg bg-black/20 p-3 text-sm leading-6 text-white/70">
                          {requirements.recommended}
                        </pre>
                      </div>
                    )}
            
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}

// <div>
//   <dt className="text-sm font-medium text-muted">Release date</dt>
//   <dd className="mt-1 text-foreground">
//     {game.released ?? "Unknown"}
//   </dd>
// </div>