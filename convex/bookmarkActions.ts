import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { bookmarkReturnValidator } from "./validators";
import {
  fetchPageMetadata,
  guessCategory,
  normalizeUrl,
} from "./lib/bookmarkUtils";

export const addFromUrl = action({
  args: { url: v.string() },
  returns: bookmarkReturnValidator,
  handler: async (ctx, args): Promise<Doc<"bookmarks">> => {
    const rawUrl = args.url.trim();
    if (!rawUrl) {
      throw new Error("URL is required");
    }

    const normalizedUrl = normalizeUrl(rawUrl);
    const metadata = await fetchPageMetadata(normalizedUrl);

    return await ctx.runMutation(internal.bookmarks.insertBookmark, {
      title: metadata.title,
      url: normalizedUrl,
      description: metadata.description,
      category: guessCategory(normalizedUrl),
    });
  },
});
