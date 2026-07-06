"use client";

interface GoogleSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isAdding: boolean;
  showAddHint: boolean;
  addHint: string;
}

export function GoogleSearch({
  value,
  onChange,
  onSubmit,
  isAdding,
  showAddHint,
  addHint,
}: GoogleSearchProps) {
  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
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
          placeholder="Search or add a site..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isAdding}
          className="w-full rounded-full border border-border bg-white py-4 pl-14 pr-5 text-base text-foreground shadow-[var(--search-shadow)] outline-none transition-shadow placeholder:text-muted hover:shadow-[var(--search-shadow-hover)] focus:border-transparent focus:shadow-[var(--search-shadow-hover)] disabled:opacity-60"
        />
      </form>

      {showAddHint && value.trim() && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isAdding}
          className="mt-3 w-full rounded-full border border-border bg-tile-bg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-tile-hover disabled:opacity-60"
        >
          {isAdding ? "Adding site..." : addHint}
        </button>
      )}
    </div>
  );
}
