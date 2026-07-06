import { NextResponse } from "next/server";
import { generateId, normalizeUrl } from "@/lib/bookmarks";
import { getBookmarks, saveBookmarks } from "@/lib/bookmark-store";
import type { Bookmark } from "@/types/bookmark";

export async function GET() {
  try {
    const bookmarks = await getBookmarks();
    return NextResponse.json({ bookmarks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load bookmarks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string; url?: string };
    const title = body.title?.trim();
    const url = body.url?.trim();

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const bookmarks = await getBookmarks();
    const normalizedUrl = normalizeUrl(url);

    if (bookmarks.some((bookmark) => bookmark.url === normalizedUrl)) {
      return NextResponse.json(
        { error: "This site is already saved" },
        { status: 409 }
      );
    }

    const newBookmark: Bookmark = {
      id: generateId(),
      title,
      url: normalizedUrl,
      createdAt: Date.now(),
    };

    const updated = [newBookmark, ...bookmarks];
    await saveBookmarks(updated);

    return NextResponse.json({ bookmark: newBookmark, bookmarks: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add bookmark";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const bookmarks = await getBookmarks();
    const updated = bookmarks.filter((bookmark) => bookmark.id !== id);

    if (updated.length === bookmarks.length) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    await saveBookmarks(updated);
    return NextResponse.json({ bookmarks: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete bookmark";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
