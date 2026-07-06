# B88 — My Bookmarks

A Google-style personal bookmark homepage. Search, visit, and save sites — stored in **Convex** (no GitHub token needed).

## Features

- Black background, white text, compact equal-size tiles
- Search bar at the bottom — type a URL and press Enter to bookmark
- Auto-fetches page title from site metadata
- Category tabs: All, Dev, Work, Social, News, Other
- Click tracking — most visited sites appear first
- Real-time sync via Convex

## Setup

### 1. Install

```bash
npm install
```

### 2. Convex (your deployment)

Your Convex project: **decisive-goldfinch-992**

```bash
npx convex login
npx convex deploy
```

This pushes the functions in `convex/` to your cloud deployment.

### 3. Environment variables

**Vercel** (or `.env.local`):

```
NEXT_PUBLIC_CONVEX_URL=https://decisive-goldfinch-992.convex.cloud
```

You do **not** need `GITHUB_TOKEN` anymore — bookmarks are stored in Convex.

### 4. Run locally

```bash
# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Next.js frontend
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import on Vercel
3. Add env var: `NEXT_PUBLIC_CONVEX_URL=https://decisive-goldfinch-992.convex.cloud`
4. Deploy
5. Make sure you've run `npx convex deploy` so functions exist on your Convex project

## How to use

| Action | How |
|--------|-----|
| Search | Type in the bottom search bar |
| Visit | Tap a tile |
| Bookmark | Type URL → press Enter |
| Filter | Tap a category tab |

## License

MIT
