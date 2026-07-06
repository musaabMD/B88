import { v } from "convex/values";

export const categoryValidator = v.union(
  v.literal("Dev"),
  v.literal("Work"),
  v.literal("Social"),
  v.literal("News"),
  v.literal("Other")
);

export const bookmarkReturnValidator = v.object({
  _id: v.id("bookmarks"),
  _creationTime: v.number(),
  title: v.string(),
  url: v.string(),
  normalizedHost: v.string(),
  description: v.optional(v.string()),
  category: categoryValidator,
  clicks: v.number(),
  createdAt: v.number(),
});

export const bookmarkListValidator = v.array(bookmarkReturnValidator);
