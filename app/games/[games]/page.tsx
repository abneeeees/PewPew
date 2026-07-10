import AppShell from "@/components/AppShell";
import { eachGame, getGameScreenshots } from "@/lib/Data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Global/Footer";
import GameDetailsClient from "./GameDetailsClient";

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
  const screenshots = await getGameScreenshots(games);

  if (!game) {
    notFound();
  }

  return (
    <AppShell>
      <GameDetailsClient game={game} screenshots={screenshots} />
      <Footer />
    </AppShell>
  );
}