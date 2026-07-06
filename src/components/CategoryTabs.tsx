"use client";

import { CATEGORIES } from "@/types/bookmark";

interface CategoryTabsProps {
  selected: string;
  onChange: (category: string) => void;
  counts: Record<string, number>;
}

export function CategoryTabs({
  selected,
  onChange,
  counts,
}: CategoryTabsProps) {
  return (
    <nav
      className="flex gap-1 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((category) => {
        const isActive = selected === category;
        const count = counts[category] ?? 0;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#e8f0fe] text-tab-active"
                : "text-muted hover:bg-tile-hover hover:text-foreground"
            }`}
          >
            {category}
            {category !== "All" && (
              <span className="ml-1 opacity-60">{count}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
