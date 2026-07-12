"use client";

import type { ActiveFilters, SortOption } from "@/lib/types";

const SORT_LABELS: Record<SortOption, string> = {
  "-released": "Newest Release",
  "released": "Oldest Release",
  "-rating": "Highest Rated",
  "rating": "Lowest Rated",
  "name": "A – Z",
  "-name": "Z – A",
  "-added": "Recently Added",
  "-metacritic": "Best Metacritic",
  "metacritic": "Lowest Metacritic",
};

interface ActiveFiltersBarProps {
  filters: ActiveFilters;
  totalCount: number;
  isLoading: boolean;
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
  onOpenFilters: () => void;
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent/25 shrink-0">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-accent/70 hover:text-white transition-colors cursor-pointer leading-none"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

export default function ActiveFiltersBar({
  filters,
  totalCount,
  isLoading,
  onRemove,
  onClearAll,
  onOpenFilters,
}: ActiveFiltersBarProps) {
  const chips: { key: string; label: string; value?: string }[] = [];

  if (filters.search) {
    chips.push({ key: "search", label: `"${filters.search}"` });
  }

  filters.genres.forEach((g) => chips.push({ key: "genres", value: g, label: g.replace(/-/g, " ") }));
  filters.platforms.forEach((p) => chips.push({ key: "platforms", value: p, label: `Platform: ${p}` }));
  filters.tags.forEach((t) => chips.push({ key: "tags", value: t, label: t.replace(/-/g, " ") }));
  filters.publishers.forEach((p) => chips.push({ key: "publishers", value: p, label: `Publisher: ${p}` }));

  if (filters.releaseYearMin || filters.releaseYearMax) {
    const from = filters.releaseYearMin || "Any";
    const to = filters.releaseYearMax || "Any";
    chips.push({ key: "releaseYear", label: `${from} – ${to}` });
  }

  if (filters.metacriticMin || filters.metacriticMax) {
    const from = filters.metacriticMin || "0";
    const to = filters.metacriticMax || "100";
    chips.push({ key: "metacritic", label: `Metacritic: ${from}–${to}` });
  }

  const hasActiveFilters = chips.length > 0;
  const isNonDefaultSort = filters.ordering !== "-released";

  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-6 border-b border-white/5 min-h-[56px]">
      {/* Filters Button */}
      <button
        type="button"
        onClick={onOpenFilters}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
          hasActiveFilters || isNonDefaultSort
            ? "bg-accent/15 border-accent/40 text-accent hover:bg-accent/25"
            : "bg-surface-raised border-border text-muted hover:border-white/20 hover:text-white"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
        </svg>
        Filters
        {(hasActiveFilters || isNonDefaultSort) && (
          <span className="px-1.5 py-0.5 rounded bg-accent text-white text-[9px] font-bold leading-none">
            {chips.length + (isNonDefaultSort ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Active Sort chip (if non-default) */}
      {isNonDefaultSort && (
        <Chip
          label={`↕ ${SORT_LABELS[filters.ordering]}`}
          onRemove={() => onRemove("ordering")}
        />
      )}

      {/* Filter chips – scrollable */}
      {chips.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {chips.map((chip) => (
            <Chip
              key={`${chip.key}-${chip.value ?? ""}`}
              label={chip.label}
              onRemove={() => onRemove(chip.key, chip.value)}
            />
          ))}
        </div>
      )}

      {/* Spacer */}
      {chips.length === 0 && !isNonDefaultSort && <div className="flex-1" />}

      {/* Clear all */}
      {(hasActiveFilters || isNonDefaultSort) && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-muted hover:text-accent transition-colors shrink-0 cursor-pointer"
        >
          Clear all
        </button>
      )}

      {/* Result count */}
      <div className="shrink-0 text-sm text-muted">
        {isLoading ? (
          <span className="inline-block w-16 h-4 rounded bg-white/10 animate-pulse" />
        ) : (
          <span>
            <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> games
          </span>
        )}
      </div>
    </div>
  );
}
