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

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export class GitHubTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubTokenError";
  }
}

function parseGitHubError(status: number, body: string): string {
  if (status === 403) {
    return (
      "GitHub token lacks write access. Create a fine-grained token with " +
      "Repository access: B88, Permissions → Contents: Read and write. " +
      "Or use a classic token with the repo scope. Update GITHUB_TOKEN in Vercel."
    );
  }
  if (status === 404) {
    return "Repository or file not found. Check GITHUB_OWNER, GITHUB_REPO, and GITHUB_BRANCH.";
  }
  return `GitHub API error (${status}): ${body}`;
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
      headers: githubHeaders(token),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new GitHubTokenError(parseGitHubError(response.status, body));
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
        ...githubHeaders(token),
        "Content-Type": "application/json",
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
    const body = await response.text();
    throw new GitHubTokenError(parseGitHubError(response.status, body));
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
    } catch (error) {
      if (error instanceof GitHubTokenError && error.message.includes("write")) {
        throw error;
      }
      return readLocalBookmarks();
    }
  }

  return readLocalBookmarks();
}

export async function saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
  const { token } = getGitHubConfig();

  if (token) {
    try {
      const { sha } = await readGitHubBookmarks();
      cachedSha = sha;
    } catch {
      if (!cachedSha) {
        throw new GitHubTokenError(
          "Cannot save: GitHub token cannot read the repo. Check token permissions."
        );
      }
    }

    await writeGitHubBookmarks(bookmarks, cachedSha!);
    const { sha } = await readGitHubBookmarks();
    cachedSha = sha;
    return;
  }

  await writeLocalBookmarks(bookmarks);
}
