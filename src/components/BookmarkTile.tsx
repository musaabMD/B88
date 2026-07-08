"use client";

import type { Bookmark } from "@/types/bookmark";

interface BookmarkTileProps {
  bookmark: Bookmark;
  onOpen: (bookmark: Bookmark) => void;
  onRemove: (bookmark: Bookmark) => void;
  isRemoving: boolean;
}

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}

export function BookmarkTile({
  bookmark,
  onOpen,
  onRemove,
  isRemoving,
}: BookmarkTileProps) {
  const favicon = getFaviconUrl(bookmark.url);

  return (
    <div className="group relative w-[7.5rem] px-2 py-3">
      <button
        type="button"
        onClick={() => onOpen(bookmark)}
        disabled={isRemoving}
        className="flex w-full flex-col items-center gap-2.5 rounded-2xl p-2 transition-colors hover:bg-tile-hover active:scale-[0.98] disabled:opacity-50"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-tile-bg shadow-sm ring-1 ring-white/5 transition-transform group-hover:scale-105">
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={36}
              height={36}
              className="rounded-sm"
            />
          ) : (
            <span className="text-xl">🔗</span>
          )}
        </span>

        <span
          className="line-clamp-2 w-full text-center text-xs leading-snug text-foreground"
          title={bookmark.title}
        >
          {bookmark.title}
        </span>
      </button>

      <button
        type="button"
        aria-label={`Remove ${bookmark.title}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(bookmark);
        }}
        disabled={isRemoving}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600/90 text-sm leading-none text-white opacity-0 shadow-md transition-opacity hover:bg-zinc-500 group-hover:opacity-100 group-focus-within:opacity-100 disabled:opacity-50"
      >
        ×
      </button>
    </div>
  );
}
