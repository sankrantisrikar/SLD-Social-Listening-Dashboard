# Reddit Dashboard (SocialLD-style, no Apify token)

This project fetches Reddit server-side to avoid browser CORS issues.

## Local run

```bash
cd "/Users/srikarsankranti/Desktop/Reddit Dashboard"
node server.js
```

Open: `http://127.0.0.1:5173`

## Netlify deploy

This repo now includes:

- `netlify/functions/reddit.js` (serverless Reddit proxy)
- `netlify/functions/suggest-subreddits.js` (serverless subreddit suggestions)
- `netlify.toml` redirect from `/api/reddit` to the function

So on Netlify, frontend calls to `/api/reddit` work without `server.js`.

## Features

- Subreddit + sort + limit controls
- Keyword-based subreddit suggestions (click to apply)
- Social listening insights (intent signals, top terms, pain points, opportunities)
- Keyword match highlighting
- Lead table with Reddit links
- CSV export
