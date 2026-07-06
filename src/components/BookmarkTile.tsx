"use client";

import type { Bookmark } from "@/types/bookmark";
import { getVisibilityScale } from "@/lib/bookmarks";

interface BookmarkTileProps {
  bookmark: Bookmark;
  maxClicks: number;
  rank: number;
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
  rank,
  onOpen,
}: BookmarkTileProps) {
  const scale = getVisibilityScale(bookmark.clicks, maxClicks);
  const iconSize = Math.round(48 * scale);
  const isTop = rank < 3 && bookmark.clicks > 0;

  const favicon = getFaviconUrl(bookmark.url, 128);

  return (
    <button
      type="button"
      onClick={() => onOpen(bookmark)}
      className={`group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all hover:bg-tile-hover active:scale-95 ${
        isTop ? "ring-2 ring-[#e8f0fe]" : ""
      }`}
      style={{ minHeight: `${72 * scale}px` }}
    >
      <span
        className="flex items-center justify-center rounded-full bg-tile-bg shadow-sm transition-transform group-hover:scale-105"
        style={{ width: iconSize + 24, height: iconSize + 24 }}
      >
        {favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={favicon}
            alt=""
            width={iconSize}
            height={iconSize}
            className="rounded-full"
          />
        ) : (
          <span style={{ fontSize: iconSize * 0.6 }}>🔗</span>
        )}
      </span>

      <span
        className={`max-w-[88px] truncate text-center leading-tight text-foreground ${
          isTop ? "text-sm font-semibold" : "text-xs font-medium"
        }`}
        title={bookmark.title}
      >
        {bookmark.title}
      </span>

      {bookmark.clicks > 0 && (
        <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[10px] font-medium text-tab-active">
          {bookmark.clicks} visit{bookmark.clicks !== 1 ? "s" : ""}
        </span>
      )}
    </button>
  );
}
