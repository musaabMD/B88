import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { categoryValidator } from "./validators";

export default defineSchema({
  bookmarks: defineTable({
    title: v.string(),
    url: v.string(),
    normalizedHost: v.string(),
    description: v.optional(v.string()),
    category: categoryValidator,
    clicks: v.number(),
    createdAt: v.number(),
  })
    .index("by_normalized_host", ["normalizedHost"])
    .index("by_clicks", ["clicks"]),
});
