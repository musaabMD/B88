import { NextResponse } from "next/server";
import { sortBookmarks } from "@/lib/bookmarks";
import { getBookmarks, saveBookmarks } from "@/lib/bookmark-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const bookmarks = await getBookmarks();
    const index = bookmarks.findIndex((bookmark) => bookmark.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    const updated = [...bookmarks];
    const current = updated[index];
    if (!current) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    updated[index] = {
      ...current,
      clicks: current.clicks + 1,
    };

    const sorted = sortBookmarks(updated);
    await saveBookmarks(sorted);

    const bookmark = sorted.find((item) => item.id === id);

    return NextResponse.json({ bookmark, bookmarks: sorted });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to track click";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
