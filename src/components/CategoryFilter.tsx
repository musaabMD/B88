"use client";

import { CATEGORIES } from "@/data/default-bookmarks";

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  counts: Record<string, number>;
}

export function CategoryFilter({
  selected,
  onChange,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const count = counts[category] ?? 0;
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? "bg-accent text-white shadow-lg shadow-accent/25"
                : "border border-border bg-card text-muted hover:border-accent/50 hover:text-foreground"
            }`}
          >
            {category}
            {category !== "All" && (
              <span className="ml-1.5 opacity-70">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
