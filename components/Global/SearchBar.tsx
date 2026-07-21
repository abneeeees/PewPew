"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

interface SearchResult {
  game_id: number;
  name: string;
  slug: string | null;
  backgroundImage: string | null;
  rating: number | null;
  released: string;
  score?: number;
}

export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = "search-results";
  const inputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // dont target if user is typing
      const target = event.target as HTMLElement;
      
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (event.key === "/") {
        event.preventDefault();
  
        inputRef.current?.focus();
  
        setOpen(true);
      }
    }
  
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [query, results]);
  
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setResults([]);
          setOpen(true);
          return;
        }

        const data = await res.json();
        setResults(Array.isArray(data) ? (data as SearchResult[]) : []);
        setOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setResults([]);
        setOpen(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query]);

  function updateQuery(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setResults([]);
      setLoading(false);
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function goToResult(result: SearchResult) {
    if (!result.slug) return;
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/games/${result.slug}`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) goToResult(target);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative mx-3 min-w-0 flex-1 max-w-xl">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || query.trim().length >= 2) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="press / to search games"
          aria-label="Search games"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent"
        />
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-surface-raised shadow-xl"
        >
          {results.length === 0 && !loading && (
            <li className="px-3 py-3 text-sm text-muted">
              No games found for &quot;{query.trim()}&quot;
            </li>
          )}

          {results.map((result, index) => {
            const content = (
              <>
                {result.backgroundImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.backgroundImage}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded bg-surface" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {result.name}
                  </p>
                  {result.rating != null && (
                    <p className="text-xs text-muted">
                      ★ {Number(result.rating).toFixed(1)}
                    </p>
                  )}
                  <p className="text-xs font-light text-shadow-foreground">
                    {result.released}
                  </p>
                </div>
              </>
            );

            const itemClass = `flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
              index === activeIndex
                ? "bg-surface text-foreground"
                : "hover:bg-surface"
            }`;

            return (
              <li
                key={result.game_id}
                id={`search-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                {result.slug ? (
                  <Link
                    href={`/games/${result.slug}`}
                    className={itemClass}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      setResults([]);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={itemClass}
                    onClick={() => goToResult(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
