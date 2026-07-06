"use client";

import { useEffect, useRef } from "react";
import type { BookmarkInput } from "@/types/bookmark";

interface AddBookmarkFormProps {
  onSubmit: (data: BookmarkInput) => void;
  onCancel: () => void;
  isSaving: boolean;
  error?: string;
}

export function AddBookmarkForm({
  onSubmit,
  onCancel,
  isSaving,
  error,
}: AddBookmarkFormProps) {
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    urlRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string).trim();
    const url = (formData.get("url") as string).trim();

    if (!title || !url) return;
    onSubmit({ title, url });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-muted">
          Website URL
        </label>
        <input
          ref={urlRef}
          id="url"
          name="url"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          required
          placeholder="google.com"
          className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-muted">
          Name
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Google"
          className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border px-4 py-3.5 text-base font-medium text-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 rounded-xl bg-accent px-4 py-3.5 text-base font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save to GitHub"}
        </button>
      </div>
    </form>
  );
}
