"use client";

import { useRef, useState } from "react";
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
  const [showDelete, setShowDelete] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (showDelete) return;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      onOpen(bookmark);
      clickTimer.current = null;
    }, 250);
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setShowDelete(true);
  };

  const handleDelete = () => {
    onRemove(bookmark);
    setShowDelete(false);
  };

  return (
    <div className="relative h-[88px] w-[72px]">
      <button
        type="button"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
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

      {showDelete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/85 p-1">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isRemoving}
            className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-medium text-white disabled:opacity-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setShowDelete(false)}
            className="text-[10px] text-muted"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
