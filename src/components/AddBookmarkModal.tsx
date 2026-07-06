"use client";

import { AddBookmarkForm } from "./AddBookmarkForm";
import type { BookmarkInput } from "@/types/bookmark";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookmarkInput) => void;
  isSaving: boolean;
  error?: string;
}

export function AddBookmarkModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  error,
}: AddBookmarkModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-bookmark-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:p-6">
        <h2 id="add-bookmark-title" className="mb-4 text-lg font-semibold">
          Add a site
        </h2>
        <AddBookmarkForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isSaving={isSaving}
          error={error}
        />
      </div>
    </div>
  );
}
