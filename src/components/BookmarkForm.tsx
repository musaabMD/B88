"use client";

import { useEffect, useRef } from "react";
import type { Bookmark, BookmarkInput } from "@/types/bookmark";
import { CATEGORIES } from "@/data/default-bookmarks";

interface BookmarkFormProps {
  initial?: Bookmark | null;
  onSubmit: (data: BookmarkInput) => void;
  onCancel: () => void;
}

export function BookmarkForm({ initial, onSubmit, onCancel }: BookmarkFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string).trim();
    const url = (formData.get("url") as string).trim();
    const description = (formData.get("description") as string).trim();
    const category = formData.get("category") as string;
    const tagsRaw = (formData.get("tags") as string).trim();
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    if (!title || !url) return;

    let normalizedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      normalizedUrl = `https://${url}`;
    }

    onSubmit({
      title,
      url: normalizedUrl,
      description: description || undefined,
      category,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-muted">
          Title
        </label>
        <input
          ref={titleRef}
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initial?.title ?? ""}
          placeholder="e.g. GitHub"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-muted">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          defaultValue={initial?.url ?? ""}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-muted">
          Description (optional)
        </label>
        <input
          id="description"
          name="description"
          type="text"
          defaultValue={initial?.description ?? ""}
          placeholder="Short description"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-muted">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={initial?.category ?? "Other"}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-muted">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initial?.tags.join(", ") ?? ""}
          placeholder="react, docs, tutorial"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          {initial ? "Save Changes" : "Add Bookmark"}
        </button>
      </div>
    </form>
  );
}
