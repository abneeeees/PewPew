import AppShell from "@/components/AppShell";
import GameGrid from "@/components/Games/GameGrid";
import FilterBar from "@/components/Games/FilterBar";
import Hero from "@/components/UI/Hero";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <AppShell>
      <div className="flex flex-col">
        <Hero />
        <GameGrid page={currentPage} />
      </div>
    </AppShell>
  );
}
