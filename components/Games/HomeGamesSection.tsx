/**
 * HomeGamesSection — Pure Server Component
 *
 * Fetches game data server-side and renders pagination using <Link> tags
 * (URL-based navigation). No event handler props. No client boundary crossing.
 */

import Link from "next/link";
import GameCard from "./GameCard";
import { getGames } from "@/lib/Data";

interface HomeGamesSectionProps {
  currentPage: number;
}

export default async function HomeGamesSection({ currentPage }: HomeGamesSectionProps) {
  const { games, previousPage, nextPage } = await getGames(currentPage);

  return (
    <div className="flex flex-col gap-6">
      {/* Game Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Link-based pagination — no JS callbacks required */}
      {(previousPage || nextPage) && (
        <div className="flex items-center justify-between px-1">
          {previousPage ? (
            <Link
              href={previousPage}
              className="rounded-xl border border-border px-5 py-2 text-sm font-semibold text-accent transition-all duration-200 hover:bg-surface-raised hover:border-accent/40"
            >
              ← Previous
            </Link>
          ) : (
            <span className="rounded-xl border border-border/30 px-5 py-2 text-sm font-semibold text-muted/30 cursor-not-allowed">
              ← Previous
            </span>
          )}

          {nextPage ? (
            <Link
              href={nextPage}
              className="rounded-xl border border-border px-5 py-2 text-sm font-semibold text-accent transition-all duration-200 hover:bg-surface-raised hover:border-accent/40"
            >
              Next →
            </Link>
          ) : (
            <span className="rounded-xl border border-border/30 px-5 py-2 text-sm font-semibold text-muted/30 cursor-not-allowed">
              Next →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
