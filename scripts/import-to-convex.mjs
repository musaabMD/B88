#!/usr/bin/env node
/**
 * Parse bookmark HTML files and import to Convex (deduped by hostname).
 */
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function parseBookmarksHtml(html) {
  const links = [];
  const re = /<A\s+HREF="([^"]+)"[^>]*>([^<]*)<\/A>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1].trim();
    const title = (m[2] || "").trim();
    if (!url.startsWith("http")) continue;
    links.push({ url, title: title || url });
  }
  return links;
}

function normalizeHost(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

const files = [
  "/home/ubuntu/.cursor/projects/workspace/uploads/bookmarks_22fc.html",
  "/home/ubuntu/.cursor/projects/workspace/uploads/Bookmarks_3fdb.html",
];

const seen = new Map();
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const { url, title } of parseBookmarksHtml(html)) {
    const host = normalizeHost(url);
    if (!seen.has(host)) {
      seen.set(host, { url, title: title || host });
    }
  }
}

const items = [...seen.values()];
console.log(`Importing ${items.length} unique bookmarks...`);

const batchSize = 50;
let totalAdded = 0;
let totalSkipped = 0;

for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize);
  const argsPath = join(root, `.import-batch-${i}.json`);
  writeFileSync(argsPath, JSON.stringify({ items: batch }));

  try {
    const out = execSync(
      `CONVEX_DEPLOYMENT=dev:decisive-goldfinch-992 npx convex run import:bulkImport "$(cat ${argsPath})"`,
      { cwd: root, encoding: "utf8", shell: "/bin/bash" }
    );
    const parsed = JSON.parse(out.trim());
    totalAdded += parsed.added;
    totalSkipped += parsed.skipped;
    console.log(
      `Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}: +${parsed.added} added, ${parsed.skipped} skipped`
    );
  } finally {
    unlinkSync(argsPath);
  }
}

console.log(`Done: ${totalAdded} added, ${totalSkipped} skipped (${items.length} total unique)`);
