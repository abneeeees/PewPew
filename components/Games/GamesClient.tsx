"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import ActiveFiltersBar from "./ActiveFiltersBar";
import GameGrid from "./GameGrid";
import type { ActiveFilters, Game, SortOption } from "@/lib/types";

const DEFAULT_FILTERS: ActiveFilters = {
  search: "",
  genres: [],
  platforms: [],
  tags: [],
  publishers: [],
  releaseYearMin: "",
  releaseYearMax: "",
  metacriticMin: "",
  metacriticMax: "",
  ordering: "-released",
};

function filtersToURLParams(filters: ActiveFilters, page: number): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.genres.length) params.set("genres", filters.genres.join(","));
  if (filters.platforms.length) params.set("platforms", filters.platforms.join(","));
  if (filters.tags.length) params.set("tags", filters.tags.join(","));
  if (filters.publishers.length) params.set("publishers", filters.publishers.join(","));
  if (filters.releaseYearMin || filters.releaseYearMax) {
    const from = filters.releaseYearMin || "1980";
    const to = filters.releaseYearMax || "2025";
    params.set("dates", `${from}-01-01,${to}-12-31`);
  }
  if (filters.metacriticMin || filters.metacriticMax) {
    params.set("metacritic", `${filters.metacriticMin || "0"},${filters.metacriticMax || "100"}`);
  }
  if (filters.ordering) params.set("ordering", filters.ordering);
  if (page > 1) params.set("page", String(page));

  return params;
}

function parseURLToFilters(searchParams: URLSearchParams): { filters: ActiveFilters; page: number } {
  const dates = searchParams.get("dates") || "";
  let releaseYearMin = "";
  let releaseYearMax = "";
  if (dates) {
    const [from, to] = dates.split(",");
    releaseYearMin = from?.slice(0, 4) || "";
    releaseYearMax = to?.slice(0, 4) || "";
  }

  const metacritic = searchParams.get("metacritic") || "";
  let metacriticMin = "";
  let metacriticMax = "";
  if (metacritic) {
    const [min, max] = metacritic.split(",");
    metacriticMin = min || "";
    metacriticMax = max || "";
  }

  return {
    filters: {
      search: searchParams.get("search") || "",
      genres: searchParams.get("genres")?.split(",").filter(Boolean) || [],
      platforms: searchParams.get("platforms")?.split(",").filter(Boolean) || [],
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      publishers: searchParams.get("publishers")?.split(",").filter(Boolean) || [],
      releaseYearMin,
      releaseYearMax,
      metacriticMin,
      metacriticMax,
      ordering: (searchParams.get("ordering") as SortOption) || "-released",
    },
    page: Number(searchParams.get("page")) || 1,
  };
}

export default function GamesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { filters: initialFilters, page: initialPage } = parseURLToFilters(searchParams);

  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [games, setGames] = useState<Game[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const abortRef = useRef<AbortController | null>(null);

  // Sync URL whenever filters/page change
  const pushToURL = useCallback(
    (nextFilters: ActiveFilters, nextPage: number) => {
      const params = filtersToURLParams(nextFilters, nextPage);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  // Fetch games from proxy API
  const fetchGames = useCallback(async (nextFilters: ActiveFilters, nextPage: number) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    try {
      const params = filtersToURLParams(nextFilters, nextPage);
      params.set("page_size", "20");
      const res = await fetch(`/api/games?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) return;
      const data = await res.json();
      setGames(data.games || []);
      setTotalCount(data.count || 0);
      setHasNextPage(!!data.next);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Fetch error:", err);
        setGames([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on filter/page change
  // The lint rule fires because fetchGames internally calls setState.
  // We use a zero-timeout to move the call out of the synchronous effect body.
  useEffect(() => {
    const id = setTimeout(() => fetchGames(filters, page), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // Handle filter change: reset to page 1
  const handleFiltersChange = (next: ActiveFilters) => {
    setFilters(next);
    setPage(1);
    pushToURL(next, 1);
  };

  // Handle search submit
  const handleSearchSubmit = (value: string) => {
    const next = { ...filters, search: value };
    setSearchInput(value);
    handleFiltersChange(next);
  };

  // Handle chip removal
  const handleRemoveFilter = (key: string, value?: string) => {
    const next = { ...filters };
    if (key === "search") {
      next.search = "";
      setSearchInput("");
    } else if (key === "genres" && value) {
      next.genres = next.genres.filter((v) => v !== value);
    } else if (key === "platforms" && value) {
      next.platforms = next.platforms.filter((v) => v !== value);
    } else if (key === "tags" && value) {
      next.tags = next.tags.filter((v) => v !== value);
    } else if (key === "publishers" && value) {
      next.publishers = next.publishers.filter((v) => v !== value);
    } else if (key === "releaseYear") {
      next.releaseYearMin = "";
      next.releaseYearMax = "";
    } else if (key === "metacritic") {
      next.metacriticMin = "";
      next.metacriticMax = "";
    } else if (key === "ordering") {
      next.ordering = "-released";
    }
    handleFiltersChange(next);
  };

  const handleClearAll = () => {
    setSearchInput("");
    handleFiltersChange(DEFAULT_FILTERS);
  };

  const noResults = !isLoading && games.length === 0;

  return (
    <div className="flex flex-col min-h-0">
      {/* Search Bar */}
      <div className="px-4 py-4 sm:px-6 border-b border-white/5">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* Active Filters Bar */}
      <ActiveFiltersBar
        filters={filters}
        totalCount={totalCount}
        isLoading={isLoading}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
        onOpenFilters={() => setShowFilters(true)}
      />

      {/* Main layout: sidebar + grid */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col w-72 shrink-0 border-r border-white/5 overflow-y-auto transition-all duration-300 sticky top-0 self-start max-h-screen`}
        >
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClose={() => setShowFilters(false)}
                isDrawer
              />
            </div>
          </>
        )}

        {/* Game Grid Area */}
        <main className="flex-1 px-4 py-5 sm:px-6 min-w-0">
          {noResults ? (
            <NoResults query={filters.search} onClear={handleClearAll} />
          ) : (
            <GameGrid
              games={games}
              isLoading={isLoading}
              hasPreviousPage={page > 1}
              hasNextPage={hasNextPage}
              onPreviousPage={() => {
                const next = page - 1;
                setPage(next);
                pushToURL(filters, next);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNextPage={() => {
                const next = page + 1;
                setPage(next);
                pushToURL(filters, next);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// Empty state component
function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-20 h-20 rounded-3xl bg-surface-raised border border-white/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
      {query ? (
        <p className="text-muted max-w-sm">
          No games matched <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span>. Try adjusting your search or filters.
        </p>
      ) : (
        <p className="text-muted max-w-sm">
          No games matched your current filters. Try removing some filters to see more results.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          type="button"
          onClick={onClear}
          className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
        >
          Clear all filters
        </button>
      </div>

      <div className="mt-10 text-sm text-muted">
        <p className="font-semibold text-zinc-400 mb-3">Try searching for:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Portal", "The Witcher", "Cyberpunk", "Minecraft", "GTA V", "Doom"].map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 cursor-default hover:border-white/25 hover:text-white transition-all"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
