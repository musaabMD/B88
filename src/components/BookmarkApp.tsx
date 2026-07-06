"use client";

import { useCallback, useMemo, useState } from "react";
import { BookmarkTile } from "@/components/BookmarkTile";
import { CategoryTabs } from "@/components/CategoryTabs";
import { GoogleSearch } from "@/components/GoogleSearch";
import { filterBookmarks, sortBookmarks, urlsMatch } from "@/lib/bookmarks";
import type { Bookmark } from "@/types/bookmark";

interface BookmarkAppProps {
  initialBookmarks: Bookmark[];
}

export function BookmarkApp({ initialBookmarks }: BookmarkAppProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(
    sortBookmarks(initialBookmarks)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const filteredBookmarks = useMemo(
    () => filterBookmarks(bookmarks, searchQuery, selectedCategory),
    [bookmarks, searchQuery, selectedCategory]
  );

  const maxClicks = useMemo(
    () => Math.max(0, ...filteredBookmarks.map((b) => b.clicks)),
    [filteredBookmarks]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: bookmarks.length };
    for (const bookmark of bookmarks) {
      counts[bookmark.category] = (counts[bookmark.category] ?? 0) + 1;
    }
    return counts;
  }, [bookmarks]);

  const hasExactMatch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return filteredBookmarks.some((bookmark) => {
      const haystack = [bookmark.title, bookmark.url, bookmark.description ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [filteredBookmarks, searchQuery]);

  const showAddHint = searchQuery.trim().length > 0 && !hasExactMatch;

  const handleAdd = useCallback(async () => {
    const query = searchQuery.trim();
    if (!query || isAdding) return;

    setIsAdding(true);
    setMessage(undefined);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: query }),
      });

      const result = (await response.json()) as {
        bookmarks?: Bookmark[];
        bookmark?: Bookmark;
        error?: string;
      };

      if (response.status === 409 && result.bookmark) {
        setMessage("Already saved — opening it");
        window.open(result.bookmark.url, "_blank", "noopener,noreferrer");
        return;
      }

      if (!response.ok) {
        setMessage(result.error ?? "Could not add site");
        return;
      }

      if (result.bookmarks) {
        setBookmarks(result.bookmarks);
      }
      setSearchQuery("");
      setMessage(`Added ${result.bookmark?.title ?? "site"}`);
    } catch {
      setMessage("Could not add site. Try again.");
    } finally {
      setIsAdding(false);
    }
  }, [searchQuery, isAdding]);

  const handleOpen = useCallback(async (bookmark: Bookmark) => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");

    try {
      const response = await fetch("/api/bookmarks/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookmark.id }),
      });

      const result = (await response.json()) as { bookmarks?: Bookmark[] };

      if (response.ok && result.bookmarks) {
        setBookmarks(result.bookmarks);
      } else {
        setBookmarks((prev) =>
          sortBookmarks(
            prev.map((item) =>
              item.id === bookmark.id
                ? { ...item, clicks: item.clicks + 1 }
                : item
            )
          )
        );
      }
    } catch {
      setBookmarks((prev) =>
        sortBookmarks(
          prev.map((item) =>
            item.id === bookmark.id
              ? { ...item, clicks: item.clicks + 1 }
              : item
          )
        )
      );
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) return;

    const match = filteredBookmarks.find(
      (bookmark) =>
        bookmark.title.toLowerCase() === query.toLowerCase() ||
        urlsMatch(bookmark.url, query)
    );

    if (match) {
      void handleOpen(match);
      return;
    }

    if (showAddHint || filteredBookmarks.length === 0) {
      void handleAdd();
    }
  }, [
    searchQuery,
    filteredBookmarks,
    showAddHint,
    handleAdd,
    handleOpen,
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pb-10 pt-[12vh] sm:pt-[16vh]">
      <header className="mb-8 flex w-full max-w-3xl flex-col items-center">
        <h1 className="mb-8 text-5xl font-normal tracking-tight sm:text-6xl">
          <span className="text-[#4285f4]">B</span>
          <span className="text-[#ea4335]">8</span>
          <span className="text-[#fbbc04]">8</span>
        </h1>

        <GoogleSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearchSubmit}
          isAdding={isAdding}
          showAddHint={showAddHint}
          addHint={`Press Enter to add "${searchQuery.trim()}"`}
        />

        {message && (
          <p className="mt-3 text-sm text-muted">{message}</p>
        )}
      </header>

      <div className="mb-6 w-full max-w-3xl">
        <CategoryTabs
          selected={selectedCategory}
          onChange={setSelectedCategory}
          counts={categoryCounts}
        />
      </div>

      <main className="w-full max-w-3xl">
        {filteredBookmarks.length === 0 ? (
          <p className="text-center text-sm text-muted">
            {searchQuery
              ? "No matches — press Enter to add this site"
              : "No sites in this tab yet"}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {filteredBookmarks.map((bookmark, index) => (
              <BookmarkTile
                key={bookmark.id}
                bookmark={bookmark}
                maxClicks={maxClicks}
                rank={index}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-10 text-center text-xs text-muted">
        {bookmarks.length} sites · most visited appear first & larger
      </footer>
    </div>
  );
}
