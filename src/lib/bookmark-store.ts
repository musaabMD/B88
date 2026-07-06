import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Bookmark } from "@/types/bookmark";
import { migrateBookmark, sortBookmarks } from "@/lib/bookmarks";

function parseBookmarks(raw: unknown): Bookmark[] {
  if (!Array.isArray(raw)) return [];
  return sortBookmarks(
    raw
      .filter(
        (item): item is Partial<Bookmark> & { id: string; url: string; title: string } =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "url" in item &&
          "title" in item
      )
      .map(migrateBookmark)
  );
}

const BOOKMARKS_PATH = "data/bookmarks.json";

function getLocalPath(): string {
  return path.join(process.cwd(), BOOKMARKS_PATH);
}

function getGitHubConfig() {
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER ?? "musaabMD",
    repo: process.env.GITHUB_REPO ?? "B88",
    branch: process.env.GITHUB_BRANCH ?? "main",
  };
}

async function readLocalBookmarks(): Promise<Bookmark[]> {
  const content = await readFile(getLocalPath(), "utf-8");
  const parsed = JSON.parse(content) as unknown;
  return parseBookmarks(parsed);
}

async function writeLocalBookmarks(bookmarks: Bookmark[]): Promise<void> {
  const sorted = sortBookmarks(bookmarks);
  await writeFile(getLocalPath(), `${JSON.stringify(sorted, null, 2)}\n`, "utf-8");
}

interface GitHubFileResponse {
  content: string;
  sha: string;
}

async function readGitHubBookmarks(): Promise<{
  bookmarks: Bookmark[];
  sha: string;
}> {
  const { token, owner, repo, branch } = getGitHubConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${BOOKMARKS_PATH}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 0 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to read bookmarks from GitHub: ${response.status}`);
  }

  const data = (await response.json()) as GitHubFileResponse;
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const parsed = JSON.parse(decoded) as unknown;

  return {
    bookmarks: parseBookmarks(parsed),
    sha: data.sha,
  };
}

async function writeGitHubBookmarks(
  bookmarks: Bookmark[],
  sha: string
): Promise<void> {
  const { token, owner, repo, branch } = getGitHubConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const sorted = sortBookmarks(bookmarks);
  const content = Buffer.from(`${JSON.stringify(sorted, null, 2)}\n`).toString(
    "base64"
  );

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${BOOKMARKS_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: `Update bookmarks (${sorted.length} sites)`,
        content,
        sha,
        branch,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to save bookmarks to GitHub: ${error}`);
  }
}

let cachedSha: string | undefined;

export async function getBookmarks(): Promise<Bookmark[]> {
  const { token } = getGitHubConfig();

  if (token) {
    try {
      const { bookmarks, sha } = await readGitHubBookmarks();
      cachedSha = sha;
      return bookmarks;
    } catch {
      return readLocalBookmarks();
    }
  }

  return readLocalBookmarks();
}

export async function saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
  const { token } = getGitHubConfig();

  if (token) {
    if (!cachedSha) {
      const { sha } = await readGitHubBookmarks();
      cachedSha = sha;
    }
    await writeGitHubBookmarks(bookmarks, cachedSha);
    const { sha } = await readGitHubBookmarks();
    cachedSha = sha;
    return;
  }

  await writeLocalBookmarks(bookmarks);
}
