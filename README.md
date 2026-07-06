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

## GitHub Sync (Vercel) — IMPORTANT

Your token must have **write** access to commit bookmarks.

### Fine-grained token (recommended)

1. Go to [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
2. Generate new token
3. **Repository access:** Only select `B88`
4. **Permissions → Repository permissions → Contents:** **Read and write**
5. Add to Vercel environment variables:

```
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=musaabMD
GITHUB_REPO=B88
GITHUB_BRANCH=main
```

### Classic token (alternative)

Create a token with the **`repo`** scope (full control of private repositories).

### Common error

`Resource not accessible by personal access token` means your token can read but **cannot write**. Update the token permissions and redeploy on Vercel.

## How to use

1. **Search** — type to filter your saved sites
2. **Visit** — click a tile to open in a new tab (click count goes up)
3. **Add** — type a URL like `reddit.com` and press Enter if it's not found
4. **Filter** — use tabs to show only Dev, Work, Social, etc.

## License

MIT
