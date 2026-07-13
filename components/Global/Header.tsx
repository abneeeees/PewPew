"use client";

import Link from "next/link";
import NavSearchBar from "./NavSearchBar";

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-raised hover:text-foreground lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-foreground"
        >
          pewpew
        </Link>

        {/* Search — grows to fill available space */}
        <div className="mx-4 flex-1 max-w-xl">
          <NavSearchBar />
        </div>

        {/* Auth links */}
        <nav className="ml-auto hidden shrink-0 items-center gap-6 md:flex">
          <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors">
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}
