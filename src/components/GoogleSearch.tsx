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
    <div className="w-full max-w-md">
      {showAddHint && value.trim() && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isAdding}
          className="mb-2 w-full rounded-lg border border-border bg-tile-bg px-3 py-2 text-xs text-foreground transition-colors hover:bg-tile-hover disabled:opacity-60"
        >
          {isAdding ? "Saving..." : addHint}
        </button>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-4 w-4 text-muted"
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
          placeholder="Search or bookmark a site..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isAdding}
          className="w-full rounded-xl border border-border bg-tile-bg py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-muted disabled:opacity-60"
        />
      </form>
    </div>
  );
}
