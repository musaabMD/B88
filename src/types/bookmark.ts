export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  tags: string[];
  createdAt: number;
}

export type BookmarkInput = Omit<Bookmark, "id" | "createdAt">;
