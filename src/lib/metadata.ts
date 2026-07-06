export interface PageMetadata {
  title: string;
  description?: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .trim();
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1].replace(/\s+/g, " ")) : undefined;
}

function extractDescription(html: string): string | undefined {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return undefined;
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

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; B88Bookmarks/1.0; +https://github.com/musaabMD/B88)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });

    if (!response.ok) {
      return { title: fallbackTitle(url) };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return { title: fallbackTitle(url) };
    }

    const html = await response.text();
    const title = extractTitle(html) ?? fallbackTitle(url);
    const description = extractDescription(html);

    return {
      title: title.slice(0, 120),
      description: description?.slice(0, 240),
    };
  } catch {
    return { title: fallbackTitle(url) };
  }
}
