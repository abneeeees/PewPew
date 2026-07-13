"use client";

import { useState, useEffect, useRef } from "react";
import type { Genre, PlatformOption, ActiveFilters, SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "-metacritic", label: "Best Metacritic" },
  { value: "metacritic", label: "Lowest Metacritic" },
  { value: "-released", label: "Newest Release" },
  { value: "released", label: "Oldest Release" },
  { value: "-rating", label: "Highest Rated" },
  { value: "rating", label: "Lowest Rated" },
  { value: "name", label: "A – Z" },
  { value: "-name", label: "Z – A" },
  { value: "-added", label: "Recently Added" },
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
  isHorizontal?: boolean;
}

// ── Floating dropdown wrapper ────────────────────────────────────────────────
function FilterDropdown({
  label,
  activeCount = 0,
  children,
}: {
  label: string;
  activeCount?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
          activeCount > 0
            ? "bg-accent/15 border-accent/40 text-accent hover:bg-accent/25"
            : open
            ? "bg-surface-raised border-white/20 text-foreground"
            : "bg-surface-raised border-border text-muted hover:border-white/20 hover:text-foreground"
        }`}
      >
        {label}
        {activeCount > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-accent text-white text-[9px] font-bold leading-none">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-0 mt-2 z-50 min-w-[200px] bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// ── Simple checkbox row ───────────────────────────────────────────────────────
function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors group">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-150 ${
          checked ? "bg-accent border-accent" : "border-white/20 group-hover:border-white/40"
        }`}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span
        className={`text-sm transition-colors ${checked ? "text-white font-medium" : "text-zinc-300 group-hover:text-white"}`}
        onClick={onChange}
      >
        {label}
      </span>
    </label>
  );
}

// ── Main FilterPanel ──────────────────────────────────────────────────────────
export default function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
  isHorizontal = false,
}: FilterPanelProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<PlatformOption[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [local, setLocal] = useState<ActiveFilters>(filters);

  // Load genres / platforms once
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
        setLoadingMeta(false);
      })
      .catch(() => { if (!cancelled) setLoadingMeta(false); });
    return () => { cancelled = true; };
  }, []);

  // Sync local state when parent changes (e.g. navbar search clears filters)
  useEffect(() => {
    const id = setTimeout(() => setLocal(filters), 0);
    return () => clearTimeout(id);
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
      ordering: "-metacritic",
    };
    setLocal(reset);
    onFiltersChange(reset);
  };

  const totalActive =
    local.genres.length +
    local.platforms.length +
    local.tags.length +
    (local.releaseYearMin ? 1 : 0) +
    (local.releaseYearMax ? 1 : 0) +
    (local.metacriticMin ? 1 : 0) +
    (local.metacriticMax ? 1 : 0);

  // ── HORIZONTAL MODE (top bar) ─────────────────────────────────────────────
  if (isHorizontal) {
    return (
      <div className="px-4 sm:px-6 py-3 border-t border-white/5 bg-background/60">
        {/* Filter pills row */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Sort */}
          <FilterDropdown label={`Sort: ${SORT_OPTIONS.find((o) => o.value === local.ordering)?.label ?? "Best Metacritic"}`}>
            <div className="py-1 max-h-64 overflow-y-auto">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ ordering: opt.value })}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                    local.ordering === opt.value
                      ? "text-accent bg-accent/10"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {local.ordering === opt.value && (
                    <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className={local.ordering === opt.value ? "ml-0 font-semibold" : "ml-6"}>{opt.label}</span>
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Genre */}
          <FilterDropdown label="Genre" activeCount={local.genres.length}>
            <div className="py-1 max-h-64 overflow-y-auto">
              {loadingMeta
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="mx-4 my-2 h-4 rounded bg-white/5 animate-pulse" />
                  ))
                : genres.map((g) => (
                    <CheckboxRow
                      key={g.id}
                      label={g.name}
                      checked={local.genres.includes(g.slug)}
                      onChange={() => toggleArray("genres", g.slug)}
                    />
                  ))}
            </div>
          </FilterDropdown>

          {/* Platform */}
          <FilterDropdown label="Platform" activeCount={local.platforms.length}>
            <div className="py-1 max-h-64 overflow-y-auto">
              {loadingMeta
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="mx-4 my-2 h-4 rounded bg-white/5 animate-pulse" />
                  ))
                : platforms.slice(0, 20).map((p) => (
                    <CheckboxRow
                      key={p.id}
                      label={p.name}
                      checked={local.platforms.includes(String(p.id))}
                      onChange={() => toggleArray("platforms", String(p.id))}
                    />
                  ))}
            </div>
          </FilterDropdown>

          {/* Tags */}
          <FilterDropdown label="Tags" activeCount={local.tags.length}>
            <div className="p-3 flex flex-wrap gap-1.5 w-72">
              {POPULAR_TAGS.map((tag) => {
                const active = local.tags.includes(tag.slug);
                return (
                  <button
                    key={tag.slug}
                    type="button"
                    onClick={() => toggleArray("tags", tag.slug)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer ${
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
          </FilterDropdown>

          {/* Release Year */}
          <FilterDropdown
            label="Year"
            activeCount={local.releaseYearMin || local.releaseYearMax ? 1 : 0}
          >
            <div className="p-4 space-y-3 w-52">
              <div>
                <label className="block text-xs text-muted mb-1">From</label>
                <select
                  value={local.releaseYearMin}
                  onChange={(e) => update({ releaseYearMin: e.target.value })}
                  className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40 cursor-pointer"
                >
                  <option value="">Any</option>
                  {RELEASE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">To</label>
                <select
                  value={local.releaseYearMax}
                  onChange={(e) => update({ releaseYearMax: e.target.value })}
                  className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40 cursor-pointer"
                >
                  <option value="">Any</option>
                  {RELEASE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </FilterDropdown>

          {/* Metacritic */}
          <FilterDropdown
            label="Metacritic"
            activeCount={local.metacriticMin || local.metacriticMax ? 1 : 0}
          >
            <div className="p-4 space-y-3 w-48">
              <div>
                <label className="block text-xs text-muted mb-1">Min score</label>
                <input
                  type="number" min={0} max={100}
                  value={local.metacriticMin}
                  onChange={(e) => update({ metacriticMin: e.target.value })}
                  placeholder="0"
                  className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Max score</label>
                <input
                  type="number" min={0} max={100}
                  value={local.metacriticMax}
                  onChange={(e) => update({ metacriticMax: e.target.value })}
                  placeholder="100"
                  className="w-full bg-surface-raised border border-white/10 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none focus:border-accent/40"
                />
              </div>
              <p className="text-xs text-muted">Only games with Metacritic scores</p>
            </div>
          </FilterDropdown>

          {/* Clear all */}
          {(totalActive > 0 || local.ordering !== "-metacritic") && (
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-2 text-xs font-semibold text-muted hover:text-accent transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── VERTICAL MODE (legacy, kept for backwards compat) ─────────────────────
  return (
    <div className="flex flex-col">
      {/* Header */}
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
            <button type="button" onClick={clearAll} className="text-xs text-muted hover:text-accent transition-colors cursor-pointer">
              Clear all
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        {/* Sort */}
        <div className="border-b border-white/5 pb-3 mb-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Sort By</p>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer group/radio">
                <div
                  onClick={() => update({ ordering: opt.value })}
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                    local.ordering === opt.value ? "border-accent" : "border-white/20 group-hover/radio:border-white/40"
                  }`}
                >
                  {local.ordering === opt.value && <div className="w-2 h-2 rounded-full bg-accent" />}
                </div>
                <span
                  onClick={() => update({ ordering: opt.value })}
                  className={`text-sm transition-colors ${local.ordering === opt.value ? "text-white font-semibold" : "text-zinc-300 group-hover/radio:text-white"}`}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
