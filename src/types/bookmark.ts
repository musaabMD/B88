export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

export type BookmarkInput = Pick<Bookmark, "title" | "url">;
