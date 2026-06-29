import AppShell from "@/components/AppShell";
import { eachGame } from "@/lib/Data";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <section className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-surface to-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

        <div className="relative flex h-full flex-col justify-end px-4 pb-8 sm:px-6 lg:px-8">
          <Link
            href="/games"
            className="mb-4 inline-flex w-fit items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            ← Back to games
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {game.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {game.released && (
              <span className="text-sm text-muted">{game.released}</span>
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
        </div>
      </section>

      <section className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <dl className="grid max-w-2xl gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-muted">Release date</dt>
            <dd className="mt-1 text-foreground">
              {game.released ?? "Unknown"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted">User rating</dt>
            <dd className="mt-1 text-foreground">
              {game.rating.toFixed(1)} / 5
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted">Metacritic</dt>
            <dd className="mt-1 text-foreground">
              {game.metacritic ?? "N/A"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="flex flex-col text-lg gap-1.5"
          dangerouslySetInnerHTML={{
            __html: game.description ?? "",
          }}
        />
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          {game.platforms.map(({ platform }) => (
            <span
              key={platform.id}
              className="rounded bg-zinc-800 border border-zinc-700 px-auto py-auto"
            >
              <span className="text-xl text-white">{platform.name}</span>
              <Image
                src={platform.image_background}
                width={2000}
                height={2000}
                alt={game.name}
                className="w-full h-auto"
              />
            </span>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
