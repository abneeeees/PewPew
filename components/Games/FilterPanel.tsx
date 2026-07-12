"use client";

import { useState, useEffect } from "react";
import type { Genre, PlatformOption, ActiveFilters, SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "-released", label: "Newest Release" },
  { value: "released", label: "Oldest Release" },
  { value: "-rating", label: "Highest Rated" },
  { value: "rating", label: "Lowest Rated" },
  { value: "name", label: "A – Z" },
  { value: "-name", label: "Z – A" },
  { value: "-added", label: "Recently Added" },
  { value: "-metacritic", label: "Best Metacritic" },
  { value: "metacritic", label: "Lowest Metacritic" },
];

const RELEASE_YEARS = Array.from({ length: 2026 - 1980 }, (_, i) => 2025 - i);

const POPULAR_TAGS = [
  { slug: "singleplayer", name: "Singleplayer" },
  { slug: "multiplayer", name: "Multiplayer" },
  { slug: "co-op", name: "Co-op" },
  { slug: "open-world", name: "Open World" },
  { slug: "rpg", name: "RPG" },
  { slug: "story-rich", name: "Story Rich" },
  { slug: "first-person", name: "First Person" },
  { slug: "third-person", name: "Third Person" },
  { slug: "atmospheric", name: "Atmospheric" },
  { slug: "action-rpg", name: "Action RPG" },
  { slug: "survival", name: "Survival" },
  { slug: "sandbox", name: "Sandbox" },
  { slug: "stealth", name: "Stealth" },
  { slug: "horror", name: "Horror" },
  { slug: "sci-fi", name: "Sci-Fi" },
  { slug: "fantasy", name: "Fantasy" },
  { slug: "strategy", name: "Strategy" },
  { slug: "puzzle", name: "Puzzle" },
];

interface FilterPanelProps {
  filters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClose?: () => void;
  isDrawer?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  activeCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, activeCount = 0, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-1 py-3.5 text-sm font-semibold text-white hover:text-white/80 transition-colors cursor-pointer group"
      >
        <span className="flex items-center gap-2">
          {title}
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-accent text-white text-[10px] font-bold leading-none">
              {activeCount}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FilterPanel({ filters, onFiltersChange, onClose, isDrawer = false }: FilterPanelProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<PlatformOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState<ActiveFilters>(filters);

  // Load genres and platforms once
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/genres").then((r) => r.json()),
      fetch("/api/platforms").then((r) => r.json()),
    ])
      .then(([g, p]) => {
        if (cancelled) return;
        setGenres(g.genres || []);
        setPlatforms(p.platforms || []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Sync local state when parent filters change
  useEffect(() => {
    // Intentional: sync derived state from parent prop
    // This is only triggered by explicit user actions in the parent
    const timer = setTimeout(() => setLocal(filters), 0);
    return () => clearTimeout(timer);
  }, [filters]);

  const update = (patch: Partial<ActiveFilters>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onFiltersChange(next);
  };

  const toggleArray = (key: "genres" | "platforms" | "tags" | "publishers", value: string) => {
    const arr = local[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    update({ [key]: next });
  };

  const Checkbox = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group/check">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-200 ${
          checked
            ? "bg-accent border-accent"
            : "border-white/20 group-hover/check:border-white/40 bg-transparent"
        }`}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-zinc-300 group-hover/check:text-white transition-colors leading-none" onClick={onChange}>
        {label}
      </span>
    </label>
  );

  const totalActive = (
    local.genres.length +
    local.platforms.length +
    local.tags.length +
    local.publishers.length +
    (local.releaseYearMin ? 1 : 0) +
    (local.releaseYearMax ? 1 : 0) +
    (local.metacriticMin ? 1 : 0) +
    (local.metacriticMax ? 1 : 0)
  );

  const clearAll = () => {
    const reset: ActiveFilters = {
      search: local.search,
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
    setLocal(reset);
    onFiltersChange(reset);
  };

  return (
    <div className={`flex flex-col ${isDrawer ? "h-full" : ""}`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          <span className="text-sm font-bold text-white tracking-wide">Filters</span>
          {totalActive > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-accent text-white text-[10px] font-bold leading-none">
              {totalActive}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalActive > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-muted hover:text-accent transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-2">

        {/* Sort By */}
        <CollapsibleSection title="Sort By" defaultOpen>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer group/radio">
                <div
                  onClick={() => update({ ordering: opt.value })}
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                    local.ordering === opt.value
                      ? "border-accent"
                      : "border-white/20 group-hover/radio:border-white/40"
                  }`}
                >
                  {local.ordering === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <span
                  onClick={() => update({ ordering: opt.value })}
                  className={`text-sm transition-colors ${
                    local.ordering === opt.value ? "text-white font-semibold" : "text-zinc-300 group-hover/radio:text-white"
                  }`}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Genre */}
        <CollapsibleSection title="Genre" activeCount={local.genres.length} defaultOpen>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-5 rounded bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
              {genres.map((genre) => (
                <Checkbox
                  key={genre.id}
                  label={genre.name}
                  checked={local.genres.includes(genre.slug)}
                  onChange={() => toggleArray("genres", genre.slug)}
                />
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* Platform */}
        <CollapsibleSection title="Platform" activeCount={local.platforms.length} defaultOpen>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 rounded bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {platforms.slice(0, 20).map((p) => (
                <Checkbox
                  key={p.id}
                  label={p.name}
                  checked={local.platforms.includes(String(p.id))}
                  onChange={() => toggleArray("platforms", String(p.id))}
                />
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection title="Tags" activeCount={local.tags.length}>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map((tag) => {
              const active = local.tags.includes(tag.slug);
              return (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleArray("tags", tag.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-accent border-accent text-white"
                      : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Release Year */}
        <CollapsibleSection
          title="Release Year"
          activeCount={local.releaseYearMin || local.releaseYearMax ? 1 : 0}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">From</label>
              <select
                value={local.releaseYearMin}
                onChange={(e) => update({ releaseYearMin: e.target.value })}
                className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40 cursor-pointer"
              >
                <option value="">Any</option>
                {RELEASE_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">To</label>
              <select
                value={local.releaseYearMax}
                onChange={(e) => update({ releaseYearMax: e.target.value })}
                className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40 cursor-pointer"
              >
                <option value="">Any</option>
                {RELEASE_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* Metacritic Score */}
        <CollapsibleSection
          title="Metacritic Score"
          activeCount={local.metacriticMin || local.metacriticMax ? 1 : 0}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">Min</label>
              <input
                type="number"
                min={0}
                max={100}
                value={local.metacriticMin}
                onChange={(e) => update({ metacriticMin: e.target.value })}
                placeholder="0"
                className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">Max</label>
              <input
                type="number"
                min={0}
                max={100}
                value={local.metacriticMax}
                onChange={(e) => update({ metacriticMax: e.target.value })}
                placeholder="100"
                className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40"
              />
            </div>
          </div>
          <p className="text-xs text-muted mt-2">Only shows games with Metacritic scores</p>
        </CollapsibleSection>

      </div>
    </div>
  );
}
