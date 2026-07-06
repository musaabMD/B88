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
      className="flex justify-center gap-1 overflow-x-auto px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
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
