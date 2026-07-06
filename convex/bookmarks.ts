import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { bookmarkListValidator, bookmarkReturnValidator } from "./validators";
import { getNormalizedHost } from "./lib/bookmarkUtils";

export const list = query({
  args: {},
  returns: bookmarkListValidator,
  handler: async (ctx) => {
    const bookmarks = await ctx.db.query("bookmarks").collect();
    return bookmarks.sort((a, b) => {
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      return b.createdAt - a.createdAt;
    });
  },
});

export const trackClick = mutation({
  args: { id: v.id("bookmarks") },
  returns: bookmarkReturnValidator,
  handler: async (ctx, args) => {
    const bookmark = await ctx.db.get("bookmarks", args.id);
    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    await ctx.db.patch("bookmarks", args.id, {
      clicks: bookmark.clicks + 1,
    });

    const updated = await ctx.db.get("bookmarks", args.id);
    if (!updated) {
      throw new Error("Bookmark not found");
    }
    return updated;
  },
});

export const remove = mutation({
  args: { id: v.id("bookmarks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const bookmark = await ctx.db.get("bookmarks", args.id);
    if (!bookmark) {
      throw new Error("Bookmark not found");
    }
    await ctx.db.delete("bookmarks", args.id);
    return null;
  },
});

export const insertBookmark = internalMutation({
  args: {
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("Dev"),
      v.literal("Work"),
      v.literal("Social"),
      v.literal("News"),
      v.literal("Other")
    ),
  },
  returns: bookmarkReturnValidator,
  handler: async (ctx, args) => {
    const normalizedHost = getNormalizedHost(args.url);

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_normalized_host", (q) =>
        q.eq("normalizedHost", normalizedHost)
      )
      .first();

    if (existing) {
      throw new Error("Site already saved");
    }

    const id = await ctx.db.insert("bookmarks", {
      title: args.title,
      url: args.url,
      normalizedHost,
      description: args.description,
      category: args.category,
      clicks: 0,
      createdAt: Date.now(),
    });

    const bookmark = await ctx.db.get("bookmarks", id);
    if (!bookmark) {
      throw new Error("Failed to create bookmark");
    }
    return bookmark;
  },
});
