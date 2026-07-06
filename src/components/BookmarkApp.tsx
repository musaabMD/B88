"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { BookmarkTile } from "@/components/BookmarkTile";
import { CategoryTabs } from "@/components/CategoryTabs";
import { GoogleSearch } from "@/components/GoogleSearch";
import { filterBookmarks, urlsMatch } from "@/lib/bookmarks";
import type { Bookmark } from "@/types/bookmark";

export function BookmarkApp() {
  const bookmarks = useQuery(api.bookmarks.list);
  const addFromUrl = useAction(api.bookmarkActions.addFromUrl);
  const trackClick = useMutation(api.bookmarks.trackClick);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const filteredBookmarks = useMemo(() => {
    const list = bookmarks ?? [];
    return filterBookmarks(list, searchQuery, selectedCategory);
  }, [bookmarks, searchQuery, selectedCategory]);

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
      const bookmark = await addFromUrl({ url: query });
      setSearchQuery("");
      setMessage(`Saved ${bookmark.title}`);
      setTimeout(() => setMessage(undefined), 2000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Could not bookmark";
      if (msg.includes("already saved")) {
        setMessage("Already saved");
      } else {
        setMessage(msg);
      }
    } finally {
      setIsAdding(false);
    }
  }, [searchQuery, isAdding, addFromUrl]);

  const handleOpen = useCallback(
    async (bookmark: Bookmark) => {
      window.open(bookmark.url, "_blank", "noopener,noreferrer");

      try {
        await trackClick({ id: bookmark._id as Id<"bookmarks"> });
      } catch {
        // click tracking is best-effort
      }
    },
    [trackClick]
  );

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
      setSearchQuery("");
      return;
    }

    if (showAddHint || filteredBookmarks.length === 0) {
      void handleAdd();
    }
  }, [searchQuery, filteredBookmarks, showAddHint, handleAdd, handleOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex flex-col items-center px-4 pt-8 pb-4">
        <h1 className="text-lg font-medium tracking-wide text-foreground">
          B88
        </h1>
      </header>

      <div className="mb-4 flex justify-center px-4">
        <CategoryTabs
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <main className="flex flex-1 flex-col items-center px-4 pb-28">
        {bookmarks === undefined ? (
          <p className="mt-8 text-center text-xs text-muted">Loading...</p>
        ) : filteredBookmarks.length === 0 ? (
          <p className="mt-8 text-center text-xs text-muted">
            {searchQuery
              ? "No match — press Enter to bookmark"
              : "No bookmarks yet"}
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-1">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkTile
                key={bookmark._id}
                bookmark={bookmark}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-md flex-col items-center">
          {message && (
            <p className="mb-2 text-center text-xs text-muted">{message}</p>
          )}
          <GoogleSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            isAdding={isAdding}
            showAddHint={showAddHint}
            addHint={`Bookmark "${searchQuery.trim()}"`}
          />
        </div>
      </footer>
    </div>
  );
}
