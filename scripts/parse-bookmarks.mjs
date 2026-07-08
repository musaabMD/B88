#!/usr/bin/env node
import { readFileSync } from "fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/parse-bookmarks.mjs <file1.html> [file2.html]");
  process.exit(1);
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2019;/g, "'")
    .replace(/&#x201C;/g, '"')
    .replace(/&#x201D;/g, '"')
    .trim();
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }
  return `https://${trimmed.replace(/\/$/, "")}`;
}

function getNormalizedHost(url) {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function fallbackTitle(url) {
  try {
    const hostname = new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
    const name = hostname.split(".")[0] ?? hostname;
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url;
  }
}

function parseBookmarksFromHtml(html) {
  const results = [];
  const linkRegex = /<DT><A\s+[^>]*HREF="([^"]+)"[^>]*>([\s\S]*?)<\/A>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const rawUrl = decodeHtml(match[1] ?? "");
    const rawTitle = decodeHtml(match[2] ?? "").replace(/\s+/g, " ").trim();

    if (!rawUrl || rawUrl.startsWith("javascript:") || rawUrl.startsWith("chrome:")) {
      continue;
    }

    const url = normalizeUrl(rawUrl);
    const title = rawTitle || fallbackTitle(url);

    results.push({ title, url });
  }

  return results;
}

const byHost = new Map();

for (const file of files) {
  const html = readFileSync(file, "utf-8");
  const parsed = parseBookmarksFromHtml(html);
  for (const item of parsed) {
    const host = getNormalizedHost(item.url);
    if (!byHost.has(host)) {
      byHost.set(host, item);
    }
  }
}

const unique = Array.from(byHost.values());
console.log(JSON.stringify({ count: unique.length, items: unique }, null, 0));
