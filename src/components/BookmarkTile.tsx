"use client";

import type { Bookmark } from "@/types/bookmark";

interface BookmarkTileProps {
  bookmark: Bookmark;
  onOpen: (bookmark: Bookmark) => void;
}

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}

export function BookmarkTile({ bookmark, onOpen }: BookmarkTileProps) {
  const favicon = getFaviconUrl(bookmark.url);

  return (
    <button
      type="button"
      onClick={() => onOpen(bookmark)}
      className="group flex h-[88px] w-[72px] flex-col items-center justify-start gap-1.5 rounded-xl p-2 transition-colors hover:bg-tile-hover active:scale-95"
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
  );
}
