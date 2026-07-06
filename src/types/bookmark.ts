export const CATEGORIES = [
  "All",
  "Dev",
  "Work",
  "Social",
  "News",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: Exclude<Category, "All">;
  clicks: number;
  createdAt: number;
}

export type BookmarkInput = {
  url: string;
  category?: Exclude<Category, "All">;
};
