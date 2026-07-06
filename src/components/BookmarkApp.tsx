"use client";

import { useCallback, useMemo, useState } from "react";
import { AddBookmarkModal } from "@/components/AddBookmarkModal";
import { BookmarkCard } from "@/components/BookmarkCard";
import { SearchBar } from "@/components/SearchBar";
import { filterBookmarks } from "@/lib/bookmarks";
import type { Bookmark, BookmarkInput } from "@/types/bookmark";

interface BookmarkAppProps {
  initialBookmarks: Bookmark[];
}

export function BookmarkApp({ initialBookmarks }: BookmarkAppProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const filteredBookmarks = useMemo(
    () => filterBookmarks(bookmarks, searchQuery),
    [bookmarks, searchQuery]
  );

  const handleAdd = useCallback(async (data: BookmarkInput) => {
    setIsSaving(true);
    setError(undefined);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        bookmarks?: Bookmark[];
        error?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "Could not save bookmark");
        return;
      }

      if (result.bookmarks) {
        setBookmarks(result.bookmarks);
      }
      setIsModalOpen(false);
    } catch {
      setError("Could not save bookmark. Try again.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);

    try {
      const response = await fetch(`/api/bookmarks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        bookmarks?: Bookmark[];
        error?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "Could not delete bookmark");
        return;
      }

      if (result.bookmarks) {
        setBookmarks(result.bookmarks);
      }
    } catch {
      setError("Could not delete bookmark. Try again.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                My Sites
              </h1>
              <p className="text-sm text-muted">
                {bookmarks.length} saved · synced to GitHub
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setError(undefined);
                setIsModalOpen(true);
              }}
              className="hidden h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white sm:flex"
            >
              + Add site
            </button>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredBookmarks.length}
            totalCount={bookmarks.length}
          />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
        {error && !isModalOpen && (
          <p className="mb-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {filteredBookmarks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-lg text-muted">
              {searchQuery ? "No sites match your search" : "No sites yet"}
            </p>
            <p className="mt-1 text-sm text-muted/70">
              {searchQuery
                ? "Try another word"
                : "Tap + to save your first site"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredBookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <BookmarkCard
                  bookmark={bookmark}
                  onDelete={handleDelete}
                  isDeleting={deletingId === bookmark.id}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <button
        type="button"
        onClick={() => {
          setError(undefined);
          setIsModalOpen(true);
        }}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-light text-white shadow-lg shadow-accent/30 sm:hidden"
        aria-label="Add site"
      >
        +
      </button>

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(undefined);
        }}
        onSubmit={handleAdd}
        isSaving={isSaving}
        error={error}
      />
    </div>
  );
}
