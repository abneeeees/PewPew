import AppShell from "@/components/AppShell";
import Hero from "@/components/UI/Hero";
import HomeGamesSection from "@/components/Games/HomeGamesSection";

export const metadata = {
  title: "pewpew — Discover Games",
  description: "Browse, discover, and explore the world's best games.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <Hero />
        <HomeGamesSection currentPage={currentPage} />
      </div>
    </AppShell>
  );
}
