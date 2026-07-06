import type { Bookmark } from "@/types/bookmark";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
    return urlA.hostname.replace(/^www\./, "") === urlB.hostname.replace(/^www\./, "");
  } catch {
    return a.toLowerCase() === b.toLowerCase();
  }
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  query: string,
  category: string
): Bookmark[] {
  const normalizedQuery = query.trim().toLowerCase();

  let result = bookmarks;

  if (category !== "All") {
    result = result.filter((bookmark) => bookmark.category === category);
  }

  if (!normalizedQuery) return result;

  return result.filter((bookmark) => {
    const haystack = [
      bookmark.title,
      bookmark.url,
      bookmark.description ?? "",
      bookmark.category,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function sortBookmarks(bookmarks: Bookmark[]): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    if (b.clicks !== a.clicks) return b.clicks - a.clicks;
    return b.createdAt - a.createdAt;
  });
}

export function getVisibilityScale(clicks: number, maxClicks: number): number {
  if (maxClicks <= 0) return 1;
  const ratio = clicks / maxClicks;
  return 0.85 + ratio * 0.55;
}

export function guessCategory(url: string): Bookmark["category"] {
  try {
    const host = new URL(url).hostname.toLowerCase();

    if (
      /github|gitlab|stackoverflow|npm|vercel|nextjs|developer\.mozilla/.test(host)
    ) {
      return "Dev";
    }
    if (/twitter|x\.com|facebook|instagram|linkedin|reddit|tiktok/.test(host)) {
      return "Social";
    }
    if (/news|bbc|cnn|reuters|techcrunch|theverge/.test(host)) {
      return "News";
    }
    if (/notion|slack|google\.com\/docs|office|asana|trello/.test(host)) {
      return "Work";
    }
  } catch {
    // ignore
  }
  return "Other";
}

export function migrateBookmark(raw: Partial<Bookmark> & { url: string; title: string; id: string }): Bookmark {
  return {
    id: raw.id,
    title: raw.title,
    url: raw.url,
    description: raw.description,
    category: raw.category ?? guessCategory(raw.url),
    clicks: raw.clicks ?? 0,
    createdAt: raw.createdAt ?? Date.now(),
  };
}
