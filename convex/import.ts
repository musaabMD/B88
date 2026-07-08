import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { getNormalizedHost, guessCategory } from "./lib/bookmarkUtils";

export const bulkImport = internalMutation({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
      })
    ),
  },
  returns: v.object({
    added: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx, args) => {
    let added = 0;
    let skipped = 0;

    for (const item of args.items) {
      const normalizedHost = getNormalizedHost(item.url);

      const existing = await ctx.db
        .query("bookmarks")
        .withIndex("by_normalized_host", (q) =>
          q.eq("normalizedHost", normalizedHost)
        )
        .first();

      if (existing) {
        skipped += 1;
        continue;
      }

      await ctx.db.insert("bookmarks", {
        title: item.title.slice(0, 120),
        url: item.url,
        normalizedHost,
        category: guessCategory(item.url),
        clicks: 0,
        createdAt: Date.now(),
      });
      added += 1;
    }

    return { added, skipped };
  },
});
