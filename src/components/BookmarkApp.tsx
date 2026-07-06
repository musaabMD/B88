"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { BookmarkModal } from "@/components/BookmarkModal";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { DEFAULT_BOOKMARKS } from "@/data/default-bookmarks";
import {
  filterBookmarks,
  generateId,
  loadBookmarks,
  saveBookmarks,
} from "@/lib/bookmarks";
import type { Bookmark, BookmarkInput } from "@/types/bookmark";

export function BookmarkApp() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setBookmarks(loadBookmarks(DEFAULT_BOOKMARKS));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveBookmarks(bookmarks);
    }
  }, [bookmarks, isHydrated]);

  const filteredBookmarks = useMemo(
    () => filterBookmarks(bookmarks, searchQuery, selectedCategory),
    [bookmarks, searchQuery, selectedCategory]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: bookmarks.length };
    for (const bookmark of bookmarks) {
      counts[bookmark.category] = (counts[bookmark.category] ?? 0) + 1;
    }
    return counts;
  }, [bookmarks]);

  const handleAdd = useCallback((data: BookmarkInput) => {
    const newBookmark: Bookmark = {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [newBookmark, ...prev]);
    setIsModalOpen(false);
    setEditingBookmark(null);
  }, []);

  const handleEdit = useCallback(
    (data: BookmarkInput) => {
      if (!editingBookmark) return;
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === editingBookmark.id ? { ...b, ...data } : b
        )
      );
      setIsModalOpen(false);
      setEditingBookmark(null);
    },
    [editingBookmark]
  );

  const handleDelete = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const openAddModal = () => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBookmark(null);
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-accent">B88</span> Bookmarks
            </h1>
            <p className="mt-1 text-muted">
              Search and open your saved links
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-accent/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredBookmarks.length}
          totalCount={bookmarks.length}
        />
      </header>

      <section className="mb-6">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          counts={categoryCounts}
        />
      </section>

      <section className="space-y-3">
        {!isHydrated ? (
          <div className="py-20 text-center text-muted">Loading bookmarks...</div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-lg text-muted">No bookmarks found</p>
            <p className="mt-1 text-sm text-muted/70">
              {searchQuery
                ? "Try a different search term"
                : "Add your first bookmark to get started"}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 text-sm font-medium text-accent hover:text-accent-hover"
              >
                + Add bookmark
              </button>
            )}
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDelete}
              onEdit={openEditModal}
            />
          ))
        )}
      </section>

      <footer className="mt-12 text-center text-xs text-muted/50">
        Click any bookmark to open in a new tab · {bookmarks.length} saved
      </footer>

      <BookmarkModal
        isOpen={isModalOpen}
        editingBookmark={editingBookmark}
        onClose={closeModal}
        onSubmit={editingBookmark ? handleEdit : handleAdd}
      />
    </main>
  );
}
