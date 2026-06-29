import AppShell from "@/components/AppShell";
import GameGrid from "@/components/Games/GameGrid";
import Section from "@/components/UI/Section";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <AppShell>
      <div className="flex flex-col">
        <GameGrid page={currentPage} />
      </div>
    </AppShell>
  );
}
