"use client";

import type { Bookmark } from "@/types/bookmark";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return "";
  }
}

export function BookmarkCard({ bookmark, onDelete, onEdit }: BookmarkCardProps) {
  const favicon = getFaviconUrl(bookmark.url);

  const handleOpen = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/40 hover:bg-card-hover hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-start gap-3">
        {favicon && (
          <img
            src={favicon}
            alt=""
            className="mt-0.5 h-6 w-6 shrink-0 rounded"
            width={24}
            height={24}
          />
        )}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={handleOpen}
            className="text-left text-base font-semibold text-foreground transition-colors hover:text-accent"
          >
            {bookmark.title}
            <span className="ml-1.5 inline-block opacity-0 transition-opacity group-hover:opacity-100">
              ↗
            </span>
          </button>
          {bookmark.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {bookmark.description}
            </p>
          )}
          <p className="mt-1.5 truncate text-xs text-muted/70">{bookmark.url}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {bookmark.category}
            </span>
            {bookmark.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-border/50 px-2 py-0.5 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(bookmark)}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-border hover:text-foreground"
            title="Edit bookmark"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(bookmark.id)}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete bookmark"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
