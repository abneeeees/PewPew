interface FilterBarProps {
  totalCount: number;
}

export default function FilterBar({ totalCount }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
      <p className="text-sm text-muted">
        <span className="font-medium text-foreground">{totalCount.toLocaleString()}</span> Games
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Apply Filters
        </button>

        <div className="relative">
          <select
            defaultValue="trending"
            className="appearance-none rounded-lg border border-border bg-surface-raised py-1.5 pl-3 pr-8 text-sm text-foreground outline-none transition-colors hover:border-muted/50 focus:border-accent/50"
          >
            <option value="trending">Trending</option>
            <option value="popular">Popular</option>
            <option value="recent">Recently Added</option>
            <option value="rating">Top Rated</option>
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
