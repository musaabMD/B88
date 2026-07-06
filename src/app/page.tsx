import { BookmarkApp } from "@/components/BookmarkApp";
import { getBookmarks } from "@/lib/bookmark-store";

export default async function Home() {
  const bookmarks = await getBookmarks();

  return <BookmarkApp initialBookmarks={bookmarks} />;
}
