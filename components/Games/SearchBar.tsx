"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import type { SuggestionItem } from "@/lib/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-transparent text-accent font-bold not-italic">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search games, genres, publishers…" }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/games?search=${encodeURIComponent(query)}&suggest=1`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        onSubmit(value);
        setShowSuggestions(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const selected = suggestions[activeIndex];
        onChange(selected.name);
        onSubmit(selected.name);
        setShowSuggestions(false);
        setActiveIndex(-1);
      } else {
        onSubmit(value);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
    onChange(item.name);
    onSubmit(item.name);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    onChange("");
    onSubmit("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const hasSuggestions = showSuggestions && suggestions.length > 0;
  const isOpen = hasSuggestions || (showSuggestions && loading);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Container */}
      <div
        className={`relative flex items-center gap-2 rounded-2xl border bg-surface/80 backdrop-blur-md transition-all duration-300 ${
          isOpen
            ? "border-accent/50 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] rounded-b-none border-b-transparent"
            : "border-border hover:border-white/20 focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
        }`}
      >
        {/* Search Icon */}
        <div className="pl-4 shrink-0 text-muted transition-colors duration-200 group-focus-within:text-accent">
          {loading ? (
            <svg className="w-5 h-5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full py-3.5 bg-transparent text-foreground placeholder:text-muted text-sm outline-none"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear / Submit Buttons */}
        <div className="flex items-center gap-1 pr-2 shrink-0">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onSubmit(value);
              setShowSuggestions(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all duration-200 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 border border-accent/30 border-t-0 rounded-b-2xl bg-surface/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {loading && suggestions.length === 0 && (
            <div className="px-4 py-5 text-center text-sm text-muted">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching…
              </div>
            </div>
          )}

          {suggestions.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(item);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 cursor-pointer border-t border-white/[0.04] first:border-t-0 ${
                activeIndex === idx ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {/* Thumbnail */}
              {item.background_image ? (
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={item.background_image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-lg bg-surface-raised shrink-0 flex items-center justify-center border border-white/10">
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.07A1 1 0 0121 8.87V8a2 2 0 00-2-2H5a2 2 0 00-2 2v.87a1 1 0 00.447.93L8 10m7 0v5m0-5H9m6 0l1.553 4.07A1 1 0 0115.553 15H8.447a1 1 0 01-.894-1.447L8 10" />
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {highlightMatch(item.name, value)}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.genres && item.genres.length > 0 && (
                    <span className="text-xs text-muted truncate">
                      {item.genres.map((g) => g.name).join(", ")}
                    </span>
                  )}
                  {item.released && (
                    <span className="text-xs text-zinc-600 shrink-0">
                      {item.released.slice(0, 4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              {item.rating > 0 && (
                <span className="text-xs font-semibold text-amber-400 shrink-0 flex items-center gap-0.5">
                  ★ {item.rating.toFixed(1)}
                </span>
              )}
            </button>
          ))}

          {/* Search all results link */}
          {suggestions.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSubmit(value);
                setShowSuggestions(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-white/[0.06] text-xs font-semibold text-accent hover:text-accent-hover hover:bg-white/5 transition-all duration-150 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              See all results for &ldquo;{value}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
