export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    return `https://${trimmed.replace(/\/$/, "")}`;
  }

  const slug = trimmed.toLowerCase().replace(/\s+/g, "");
  return `https://${slug}.com`;
}

export function getNormalizedHost(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function guessCategory(url: string): "Dev" | "Work" | "Social" | "News" | "Other" {
  try {
    const host = new URL(url).hostname.toLowerCase();

    if (
      /github|gitlab|stackoverflow|npm|vercel|nextjs|developer\.mozilla/.test(host)
    ) {
      return "Dev";
    }
    if (/twitter|x\.com|facebook|instagram|linkedin|reddit|tiktok/.test(host)) {
      return "Social";
    }
    if (/news|bbc|cnn|reuters|techcrunch|theverge/.test(host)) {
      return "News";
    }
    if (/notion|slack|google\.com\/docs|office|asana|trello/.test(host)) {
      return "Work";
    }
  } catch {
    // ignore
  }
  return "Other";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function fallbackTitle(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const name = hostname.split(".")[0] ?? hostname;
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url;
  }
}

export async function fetchPageMetadata(
  url: string
): Promise<{ title: string; description?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; B88Bookmarks/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { title: fallbackTitle(url) };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return { title: fallbackTitle(url) };
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch?.[1]
      ? decodeHtmlEntities(titleMatch[1].replace(/\s+/g, " "))
      : fallbackTitle(url);

    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

    return {
      title: title.slice(0, 120),
      description: descMatch?.[1]
        ? decodeHtmlEntities(descMatch[1]).slice(0, 240)
        : undefined,
    };
  } catch {
    return { title: fallbackTitle(url) };
  }
}
