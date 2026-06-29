"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex flex-col px-4 lg:px-6">
    
        {/* Top Row */}
        <div className="flex h-14 items-center">
    
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-raised hover:text-foreground lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
    
          {/* Logo */}
          <Link
            href="/"
            className="ml-0 text-xl font-bold tracking-tight text-foreground lg:ml-0"
          >
            pewpew
          </Link>
    
          {/* Desktop Search */}
          <div className="mx-8 hidden flex-1 md:block">
            <div className="relative max-w-md">
              <input
                type="search"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-4 pr-10 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
              />
    
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </div>
          </div>
    
          {/* Auth */}
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <Link
              href="/login"
              className="text-sm text-muted hover:text-foreground"
            >
              Log In
            </Link>
    
            <Link
              href="/register"
              className="text-sm text-muted hover:text-foreground"
            >
              Register
            </Link>
          </nav>
        </div>
    
        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="search"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-4 pr-10 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
            />
    
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </div>
        </div>
    
      </div>
    </header>
  );
}
