import type { Bookmark } from "@/types/bookmark";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  query: string
): Bookmark[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return bookmarks;

  return bookmarks.filter((bookmark) => {
    const haystack = [bookmark.title, bookmark.url].join(" ").toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function sortBookmarks(bookmarks: Bookmark[]): Bookmark[] {
  return [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);
}
