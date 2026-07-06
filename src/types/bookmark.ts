import type { Doc } from "../../convex/_generated/dataModel";

export type Bookmark = Doc<"bookmarks">;

export const CATEGORIES = [
  "All",
  "Dev",
  "Work",
  "Social",
  "News",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
