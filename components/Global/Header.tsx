"use client";

import Link from "next/link";
import { SearchBox } from "./SearchBar";

import type { ReactNode } from "react";

export default function Header({
  onMenuToggle,
  children,
}: {
  onMenuToggle?: () => void;
  children?: ReactNode;
}) {

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex flex-col px-4 lg:px-6">
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
            className="shrink-0 text-xl font-bold tracking-tight text-foreground"
          >
            pewpew
          </Link>

          <SearchBox />

          {/* Auth */}
          <div className="ml-auto shrink-0">{children}</div>
        </div>
    
      </div>
    </header>
  );
}
