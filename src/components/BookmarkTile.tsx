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
    <div className="relative h-[88px] w-[72px]">
      <button
        type="button"
        onClick={() => onOpen(bookmark)}
        disabled={isRemoving}
        className="group flex h-full w-full flex-col items-center justify-start gap-1.5 rounded-xl p-2 transition-colors hover:bg-tile-hover active:scale-95 disabled:opacity-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tile-bg transition-transform group-hover:scale-105">
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={28}
              height={28}
              className="rounded-md"
            />
          ) : (
            <span className="text-sm">🔗</span>
          )}
        </span>

        <span
          className="line-clamp-2 w-full text-center text-[10px] leading-tight text-foreground"
          title={bookmark.title}
        >
          {bookmark.title}
        </span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(bookmark);
        }}
        disabled={isRemoving}
        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90 text-[10px] font-bold text-white opacity-80 transition-opacity hover:opacity-100 disabled:opacity-40"
        aria-label={`Remove ${bookmark.title}`}
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}
