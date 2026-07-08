"use client";

import { useState } from "react";
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
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleRemove = () => {
    onRemove(bookmark);
    setConfirmRemove(false);
  };

  return (
    <div className="group relative w-[9.5rem] px-2 py-3">
      <button
        type="button"
        onClick={() => !confirmRemove && onOpen(bookmark)}
        disabled={isRemoving}
        className="flex w-full flex-col items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-tile-hover active:scale-[0.98] disabled:opacity-50"
      >
        <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-tile-bg shadow-sm ring-1 ring-white/5 transition-transform group-hover:scale-105">
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={40}
              height={40}
              className="rounded-sm"
            />
          ) : (
            <span className="text-2xl">🔗</span>
          )}
        </span>

        <span
          className="line-clamp-2 w-full text-center text-sm leading-snug text-foreground"
          title={bookmark.title}
        >
          {bookmark.title}
        </span>
      </button>

      {!confirmRemove ? (
        <button
          type="button"
          aria-label={`Remove ${bookmark.title}`}
          onClick={(event) => {
            event.stopPropagation();
            setConfirmRemove(true);
          }}
          disabled={isRemoving}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-base leading-none text-white shadow-md transition-colors hover:bg-zinc-500 disabled:opacity-40"
        >
          ×
        </button>
      ) : (
        <div className="absolute inset-1 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/90 p-2">
          <p className="text-center text-xs text-muted">Remove?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => setConfirmRemove(false)}
              className="rounded-lg bg-zinc-700 px-3 py-1 text-sm text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
