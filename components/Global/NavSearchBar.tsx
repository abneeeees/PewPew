"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SuggestionItem } from "@/lib/types";

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-transparent text-accent font-bold not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface NavSearchBarProps {
  /** Seed value when the search page passes its current query down */
  initialQuery?: string;
}

export default function NavSearchBar({ initialQuery = "" }: NavSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Suggestions fetch ──────────────────────────────────────────────────────
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/games?search=${encodeURIComponent(q)}&suggest=1`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const goToSearchPage = (q: string) => {
    if (!q.trim()) return;
    setOpen(false);
    setActiveIdx(-1);
    router.push(`/games?search=${encodeURIComponent(q.trim())}&ordering=-metacritic`);
  };

  const goToGame = (slug: string) => {
    setOpen(false);
    setActiveIdx(-1);
    router.push(`/games/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        goToGame(suggestions[activeIdx].slug);
      } else {
        goToSearchPage(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  };

  const hasSuggestions = open && suggestions.length > 0;
  const showDropdown = hasSuggestions || (open && loading);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input row */}
      <div
        className={`relative flex items-center rounded-xl border bg-surface transition-all duration-200 ${
          showDropdown
            ? "border-accent/50 rounded-b-none shadow-[0_0_0_2px_rgba(239,68,68,0.12)]"
            : "border-border hover:border-white/20 focus-within:border-accent/40"
        }`}
      >
        {/* Search icon / spinner */}
        <button
          type="button"
          onClick={() => goToSearchPage(query)}
          className="pl-3 pr-1 shrink-0 text-muted hover:text-accent transition-colors cursor-pointer"
          aria-label="Search"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          placeholder="Search games…"
          className="flex-1 py-2 px-2 bg-transparent text-sm text-foreground placeholder:text-muted outline-none min-w-0"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setSuggestions([]); setOpen(false); inputRef.current?.focus(); }}
            className="pr-2 shrink-0 text-muted hover:text-white transition-colors cursor-pointer"
            aria-label="Clear"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 z-50 border border-accent/30 border-t-0 rounded-b-xl bg-surface/98 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Loading skeleton */}
          {loading && suggestions.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching…
            </div>
          )}

          {/* Suggestion rows */}
          {suggestions.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); goToGame(item.slug); }}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer border-t border-white/[0.04] first:border-t-0 ${
                activeIdx === idx ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {/* Thumb */}
              {item.background_image ? (
                <div className="relative w-9 h-9 rounded-md overflow-hidden shrink-0 border border-white/10">
                  <Image src={item.background_image} alt={item.name} fill className="object-cover" sizes="36px" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-md bg-surface-raised shrink-0 border border-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9a2 2 0 10-4 0v5m-2 0h8" />
                  </svg>
                </div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{highlightMatch(item.name, query)}</p>
                {item.genres && item.genres.length > 0 && (
                  <p className="text-xs text-muted truncate mt-0.5">
                    {item.genres.map((g) => g.name).join(", ")}
                  </p>
                )}
              </div>

              {/* Rating */}
              {item.rating > 0 && (
                <span className="text-xs font-semibold text-amber-400 shrink-0">★ {item.rating.toFixed(1)}</span>
              )}
            </button>
          ))}

          {/* Footer: go to full search results */}
          {suggestions.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); goToSearchPage(query); }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-white/[0.06] text-xs font-semibold text-accent hover:text-accent-hover hover:bg-white/5 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              See all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
