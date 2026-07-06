"use client";

import type { Bookmark } from "@/types/bookmark";
import { getVisibilityScale } from "@/lib/bookmarks";

interface BookmarkTileProps {
  bookmark: Bookmark;
  maxClicks: number;
  onOpen: (bookmark: Bookmark) => void;
}

function getFaviconUrl(url: string, size: number): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return "";
  }
}

export function BookmarkTile({
  bookmark,
  maxClicks,
  onOpen,
}: BookmarkTileProps) {
  const scale = getVisibilityScale(bookmark.clicks, maxClicks);
  const iconSize = Math.round(28 * scale);
  const favicon = getFaviconUrl(bookmark.url, 64);

  return (
    <button
      type="button"
      onClick={() => onOpen(bookmark)}
      className="group flex w-[72px] flex-col items-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-tile-hover active:scale-95"
    >
      <span
        className="flex items-center justify-center rounded-xl bg-tile-bg transition-transform group-hover:scale-105"
        style={{ width: iconSize + 16, height: iconSize + 16 }}
      >
        {favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={favicon}
            alt=""
            width={iconSize}
            height={iconSize}
            className="rounded-md"
          />
        ) : (
          <span className="text-sm">🔗</span>
        )}
      </span>

      <span
        className="max-w-[68px] truncate text-center text-[10px] leading-tight text-foreground"
        title={bookmark.title}
      >
        {bookmark.title}
      </span>
    </button>
  );
}
