import type { Bookmark } from "@/types/bookmark";

const STORAGE_KEY = "b88-bookmarks";

export function loadBookmarks(defaults: Bookmark[]): Bookmark[] {
  if (typeof window === "undefined") return defaults;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed = JSON.parse(stored) as Bookmark[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaults;
  } catch {
    return defaults;
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  query: string,
  category: string
): Bookmark[] {
  const normalizedQuery = query.trim().toLowerCase();

  return bookmarks.filter((bookmark) => {
    const matchesCategory =
      category === "All" || bookmark.category === category;

    if (!normalizedQuery) return matchesCategory;

    const haystack = [
      bookmark.title,
      bookmark.url,
      bookmark.description ?? "",
      bookmark.category,
      ...bookmark.tags,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && haystack.includes(normalizedQuery);
  });
}
