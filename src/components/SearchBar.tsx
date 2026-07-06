"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export function SearchBar({
  value,
  onChange,
  resultCount,
  totalCount,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          inputMode="search"
          enterKeyHint="search"
          placeholder="Search your sites..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-base text-foreground placeholder:text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      {value && (
        <p className="mt-2 px-1 text-sm text-muted">
          {resultCount} of {totalCount} site{totalCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
