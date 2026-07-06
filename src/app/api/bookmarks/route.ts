import { NextResponse } from "next/server";
import {
  generateId,
  guessCategory,
  normalizeUrl,
  sortBookmarks,
  urlsMatch,
} from "@/lib/bookmarks";
import { getBookmarks, saveBookmarks } from "@/lib/bookmark-store";
import { fetchPageMetadata } from "@/lib/metadata";
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
    const body = (await request.json()) as { url?: string };
    const rawUrl = body.url?.trim();

    if (!rawUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(rawUrl);
    const bookmarks = await getBookmarks();

    const existing = bookmarks.find((bookmark) =>
      urlsMatch(bookmark.url, normalizedUrl)
    );

    if (existing) {
      return NextResponse.json(
        { error: "Site already saved", bookmark: existing },
        { status: 409 }
      );
    }

    const metadata = await fetchPageMetadata(normalizedUrl);

    const newBookmark: Bookmark = {
      id: generateId(),
      title: metadata.title,
      url: normalizedUrl,
      description: metadata.description,
      category: guessCategory(normalizedUrl),
      clicks: 0,
      createdAt: Date.now(),
    };

    const updated = sortBookmarks([newBookmark, ...bookmarks]);
    await saveBookmarks(updated);

    return NextResponse.json({ bookmark: newBookmark, bookmarks: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add bookmark";
    const status = error instanceof Error && error.message.includes("GitHub token")
      ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
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
