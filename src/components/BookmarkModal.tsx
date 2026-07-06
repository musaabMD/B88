"use client";

import { BookmarkForm } from "./BookmarkForm";
import type { Bookmark, BookmarkInput } from "@/types/bookmark";

interface BookmarkModalProps {
  isOpen: boolean;
  editingBookmark: Bookmark | null;
  onClose: () => void;
  onSubmit: (data: BookmarkInput) => void;
}

export function BookmarkModal({
  isOpen,
  editingBookmark,
  onClose,
  onSubmit,
}: BookmarkModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h2 id="modal-title" className="mb-4 text-lg font-semibold">
          {editingBookmark ? "Edit Bookmark" : "Add Bookmark"}
        </h2>
        <BookmarkForm
          initial={editingBookmark}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
