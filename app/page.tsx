import AppShell from "@/components/AppShell";
import GameGrid from "@/components/Games/GameGrid";
import Hero from "@/components/UI/Hero";
import UserLoggedIn from "@/components/Global/UserLoggedIn";


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <AppShell user={<UserLoggedIn />}>
      <div className="flex flex-col">
        <Hero />
        <GameGrid page={currentPage} />
      </div>
    </AppShell>
  );
}
