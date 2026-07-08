"use client";

import { CATEGORIES } from "@/types/bookmark";

interface CategoryTabsProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({
  selected,
  onChange,
}: CategoryTabsProps) {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "text-muted hover:bg-tile-hover hover:text-foreground"
            }`}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
