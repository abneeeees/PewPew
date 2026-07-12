import { getGames } from "@/lib/Data";
import Link from "next/link";
import GameCard from "./GameCard";

interface GameGridProps {
  page?: number;
}

export default async function GameGrid({ page = 1 }: GameGridProps) {
  const { games, previousPage, nextPage } = await getGames(page);

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-3 flex items-center justify-between px-1 sm:px-6">
        {previousPage ? (
          <Link
            href={previousPage}
            className="rounded-lg border border-border px-4 py-1 text-l font-medium text-accent transition-colors hover:bg-surface-raised hover:text-accent-hover"
          >
            ← Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-border px-4 py-2 text-sm text-muted opacity-50">
            ← Previous
          </span>
        )}
      
        {nextPage ? (
          <Link
            href={nextPage}
            className="rounded-lg border border-border px-4 py-2 text-l font-medium text-accent transition-colors hover:bg-surface-raised hover:text-accent-hover"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-lg border border-border px-4 py-2 text-sm text-muted opacity-50">
            Next →
          </span>
        )}
      </div>
      
      <div className="grid ml-3 mr-2.5 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

    </div>
  );
}