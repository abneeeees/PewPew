import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import GamesClient from "@/components/Games/GamesClient";

export const metadata = {
  title: "Games | pewpew",
  description: "Browse, search, and filter thousands of games on pewpew.",
};

export default function GamesPage() {
  return (
    <AppShell>
      <Suspense fallback={<GamesPageSkeleton />}>
        <GamesClient />
      </Suspense>
    </AppShell>
  );
}

function GamesPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 animate-pulse">
      <div className="h-12 rounded-2xl bg-surface-raised w-full" />
      <div className="h-10 rounded-xl bg-surface-raised w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-surface-raised" />
        ))}
      </div>
    </div>
  );
}
