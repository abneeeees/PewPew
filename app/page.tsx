import AppShell from "@/components/AppShell";
import GameGrid from "@/components/Games/GameGrid";
import Hero from "@/components/UI/Hero";
import { getGames } from "@/lib/Data";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { games, previousPage, nextPage } = await getGames(currentPage);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <Hero />
        <GameGrid
          games={games}
          hasPreviousPage={!!previousPage}
          hasNextPage={!!nextPage}
          onPreviousPage={() => {}}
          onNextPage={() => {}}
        />
      </div>
    </AppShell>
  );
}
