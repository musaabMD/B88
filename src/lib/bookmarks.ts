import type { Bookmark } from "@/types/bookmark";

export function filterBookmarks(
  bookmarks: Bookmark[],
  query: string,
  category: string
): Bookmark[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery && category === "All") return bookmarks;

  return bookmarks.filter((bookmark) => {
    const matchesCategory =
      category === "All" || bookmark.category === category;

    if (!normalizedQuery) return matchesCategory;

    const haystack = [
      bookmark.title,
      bookmark.url,
      bookmark.description ?? "",
      bookmark.category,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && haystack.includes(normalizedQuery);
  });
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    return `https://${trimmed.replace(/\/$/, "")}`;
  }

  const slug = trimmed.toLowerCase().replace(/\s+/g, "");
  return `https://${slug}.com`;
}

export function urlsMatch(a: string, b: string): boolean {
  try {
    const urlA = new URL(normalizeUrl(a));
    const urlB = new URL(normalizeUrl(b));
    return (
      urlA.hostname.replace(/^www\./, "") ===
      urlB.hostname.replace(/^www\./, "")
    );
  } catch {
    return a.toLowerCase() === b.toLowerCase();
  }
}
