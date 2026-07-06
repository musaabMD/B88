import type { Bookmark } from "@/types/bookmark";

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: "1",
    title: "GitHub",
    url: "https://github.com",
    description: "Code hosting and collaboration",
    category: "Development",
    tags: ["git", "code"],
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Next.js Docs",
    url: "https://nextjs.org/docs",
    description: "Official Next.js documentation",
    category: "Development",
    tags: ["react", "framework"],
    createdAt: Date.now(),
  },
  {
    id: "3",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "Utility-first CSS framework",
    category: "Development",
    tags: ["css", "design"],
    createdAt: Date.now(),
  },
  {
    id: "4",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Web technology reference",
    category: "Learning",
    tags: ["html", "javascript", "css"],
    createdAt: Date.now(),
  },
  {
    id: "5",
    title: "Vercel",
    url: "https://vercel.com",
    description: "Deploy and host web apps",
    category: "Tools",
    tags: ["hosting", "deploy"],
    createdAt: Date.now(),
  },
];

export const CATEGORIES = [
  "All",
  "Development",
  "Learning",
  "Tools",
  "Social",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
