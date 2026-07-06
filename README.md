# B88 — My Bookmarks

A Google-style homepage for your personal bookmarks. Search sites, add new ones from the search bar, and your most-visited links rise to the top.

## Features

- **Google-like homepage** — clean, centered search bar
- **Search to add** — type a URL and press Enter if the site isn't saved yet
- **Auto title** — fetches page title & description from site metadata
- **Category tabs** — filter by Dev, Work, Social, News, Other
- **Click tracking** — every visit is counted; more clicks = higher & larger on the page
- **Synced to GitHub** — bookmarks saved in `data/bookmarks.json`

## Quick Start

```bash
npm install
npm run dev
```

## GitHub Sync (Vercel)

Add these environment variables:

```
GITHUB_TOKEN=your_token_with_Contents_read_write
GITHUB_OWNER=musaabMD
GITHUB_REPO=B88
GITHUB_BRANCH=main
```

## How to use

1. **Search** — type to filter your saved sites
2. **Visit** — click a tile to open in a new tab (click count goes up)
3. **Add** — type a URL like `reddit.com` and press Enter if it's not found
4. **Filter** — use tabs to show only Dev, Work, Social, etc.

## License

MIT
