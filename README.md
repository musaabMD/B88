# B88 — My Sites

A simple, mobile-friendly bookmark list. Search your saved sites, tap to open in a new tab, and every site you add is saved to `data/bookmarks.json` in this GitHub repo.

## Features

- Simple list of sites you visit
- Fast search by name or URL
- Tap any site to open in a new tab
- Add sites from your phone or desktop
- **Synced to GitHub** — new bookmarks are committed to `data/bookmarks.json`
- Mobile-first layout with large touch targets

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## GitHub Sync Setup

To save bookmarks to GitHub when you add them:

1. Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope
2. Copy `.env.example` to `.env.local`
3. Add your token:

```bash
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=musaabMD
GITHUB_REPO=B88
GITHUB_BRANCH=main
```

Without a token, bookmarks still save locally to `data/bookmarks.json` during development.

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH` as environment variables
4. Deploy

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Run production server
```

## How it works

- Bookmarks live in [`data/bookmarks.json`](data/bookmarks.json)
- The site reads that file on load
- When you add or remove a site, the API updates the file and commits it to GitHub

## License

MIT
