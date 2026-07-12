"use client";

import GameCard from "./GameCard";
import type { Game } from "@/lib/types";

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-raised border border-white/5 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-4 rounded bg-white/10 w-3/4" />
        <div className="h-3 rounded bg-white/5 w-1/2" />
      </div>
    </div>
  );
}

export default function GameGrid({
  games,
  isLoading = false,
  hasPreviousPage,
  hasNextPage,
  onPreviousPage = () => {},
  onNextPage = () => {},
}: GameGridProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Grid */}
      <div
        className={`grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 transition-opacity duration-300 ${
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {isLoading
          ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
          : games.map((game) => <GameCard key={game.id} game={game} />)}
      </div>

      {/* Pagination */}
      {(hasPreviousPage || hasNextPage) && (
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            disabled={!hasPreviousPage}
            onClick={onPreviousPage}
            className={`rounded-xl border px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              hasPreviousPage
                ? "border-border text-accent hover:bg-surface-raised hover:border-accent/40"
                : "border-border/30 text-muted/30 cursor-not-allowed"
            }`}
          >
            ← Previous
          </button>

          <button
            type="button"
            disabled={!hasNextPage}
            onClick={onNextPage}
            className={`rounded-xl border px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              hasNextPage
                ? "border-border text-accent hover:bg-surface-raised hover:border-accent/40"
                : "border-border/30 text-muted/30 cursor-not-allowed"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}