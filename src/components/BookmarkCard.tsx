"use client";

import type { Bookmark } from "@/types/bookmark";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function BookmarkCard({
  bookmark,
  onDelete,
  isDeleting,
}: BookmarkCardProps) {
  const favicon = getFaviconUrl(bookmark.url);
  const hostname = getHostname(bookmark.url);

  const handleOpen = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4">
      <button
        type="button"
        onClick={handleOpen}
        className="flex min-h-12 min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background">
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              className="h-6 w-6 rounded"
              width={24}
              height={24}
            />
          ) : (
            <span className="text-lg">🔗</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold text-foreground">
            {bookmark.title}
          </span>
          <span className="block truncate text-sm text-muted">{hostname}</span>
        </span>
        <span className="shrink-0 text-muted" aria-hidden="true">
          ↗
        </span>
      </button>

      <button
        type="button"
        onClick={() => onDelete(bookmark.id)}
        disabled={isDeleting}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        title="Remove bookmark"
        aria-label={`Remove ${bookmark.title}`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </article>
  );
}
