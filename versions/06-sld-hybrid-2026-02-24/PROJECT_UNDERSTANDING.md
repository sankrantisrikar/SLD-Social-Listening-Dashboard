# Project Understanding: PainMed-PA Social Listening Dashboard

## 1. What this project is

This repository is a lightweight, serverless social listening dashboard focused on pain management discussions across multiple public sources. It is intentionally built as:

- A single static frontend file: `pilot.html`
- Two Netlify serverless proxy functions for APIs that are problematic in direct browser calls:
  - `netlify/functions/reddit-proxy.js`
  - `netlify/functions/news-proxy.js`

The project does not use a frontend framework (React/Vue/etc.) or a Node package build pipeline. It runs directly in the browser and depends on CDN-hosted libraries.

## 2. Repository structure

```text
/
|- README.md
|- pilot.html
|- netlify.toml
|- netlify/
|  |- functions/
|     |- news-proxy.js
|     |- reddit-proxy.js
|- .vscode/settings.json
```

### File roles

- `pilot.html`
  - Entire UI, styling, state, data fetching, enrichment, and rendering logic.
  - Includes Chart.js via CDN.
- `netlify/functions/news-proxy.js`
  - Serverless pass-through to NewsAPI.
- `netlify/functions/reddit-proxy.js`
  - Serverless pass-through to Reddit subreddit search endpoint.
- `netlify.toml`
  - Configures function directory and publish root for Netlify.
- `README.md`
  - Setup/deployment notes and architecture intent.

## 3. Frameworks, platforms, and external services

## Frontend/runtime frameworks

- Vanilla HTML/CSS/JavaScript (no bundler)
- Chart.js 4.4.0 (CDN) for charts
- Google Fonts (DM Sans)

## Hosting/runtime

- Static hosting model
- Netlify Functions runtime for serverless endpoints

## External APIs/services used

- YouTube Data API v3
- Apify API (LinkedIn scraper actor, Twitter/X scraper actor)
- Reddit public JSON search endpoint
- NewsAPI `everything` endpoint

## 4. Architectural choices

## Choice A: Single-file frontend architecture

Everything is centralized in `pilot.html`:

- UI markup
- CSS design system
- app state
- fetch logic
- analytics logic
- chart generation
- feed rendering

This maximizes portability and ease of deployment, but reduces modularity, testability, and maintainability.

## Choice B: Client-heavy orchestration

The browser performs most orchestration:

- reads credentials from `localStorage`
- calls third-party APIs directly when allowed
- enriches data with topic/sentiment/payer/procedure heuristics
- renders metrics/charts/feed

Only Reddit and News can be routed through serverless proxies when deployed on Netlify.

## Choice C: Environment-sensitive API routing

Source fetchers switch between direct API calls and Netlify proxy calls based on `location`:

- local/file modes: direct calls for many APIs
- production/non-localhost mode: Reddit and News are routed through `/.netlify/functions/...`

## 5. Runtime flow (end-to-end)

1. `DOMContentLoaded` triggers:
   - `loadCreds()`
   - `setupSourceToggles()`
   - `checkLocalhost()`
2. User configures keywords and source toggles.
3. User clicks `Fetch & Analyze`.
4. `fetchAndAnalyze()` validates selected sources and available credentials.
5. Selected source fetchers run sequentially:
   - YouTube -> LinkedIn -> Reddit -> Twitter/X -> News
6. Each normalized post is enriched with:
   - `topic`
   - `sentiment`
   - `payer`
   - `procedure`
7. UI panels become visible and render:
   - metrics
   - 6 charts
   - top authors
   - trending posts
   - feed tabs

## 6. Frontend state model

Global mutable state:

- `allPosts`: unified list of normalized posts from all sources
- `currentFilter`: selected feed tab platform
- `charts`: active Chart.js instances for cleanup and re-rendering

Expected but currently missing state:

- `selectedSubs` is referenced in Reddit fetching but never defined.

## 7. Unified post schema

All sources map to a shared object shape:

```js
{
  id,
  platform,          // youtube | linkedin | reddit | twitter | news
  title,
  author,
  authorUrl,
  url,
  date,              // ISO-ish string
  keyword,           // matched search keyword
  likes,
  comments,
  shares,
  platform_meta,     // source-specific metadata
  topic,             // derived
  sentiment,         // derived
  payer,             // derived
  procedure          // derived
}
```

This normalization is the core design that allows common analytics and rendering.

## 8. API integration details

## YouTube

- Endpoint 1: `youtube/v3/search`
- Endpoint 2: `youtube/v3/videos` (statistics enrichment per video)
- Strategy:
  - For each keyword, run 2 passes: `videoDuration=short` then `videoDuration=any`
  - Deduplicate by `videoId`
  - Collect likes/comments/views from video statistics endpoint

## LinkedIn (via Apify actor)

- Starts actor run via Apify API:
  - Actor ID: `kfiWbq3boy3dWKbiL`
- Input includes:
  - LinkedIn search URLs per keyword
  - cookie array derived from `li_at`
  - proxy settings and scraping limits
- Waits for run completion, then pulls dataset items.
- Normalizes variable actor output fields into unified schema.

## Twitter/X (via Apify actor)

- Starts actor run via Apify API:
  - Actor ID: `61RPP7dywgiy0JPD0`
- Uses up to first 3 keywords (`keywords.slice(0, 3)`).
- Waits for completion, fetches dataset, filters out `noResults`, normalizes items.

## Reddit

- Local/file mode direct endpoint:
  - `https://www.reddit.com/r/{sub}/search.json?...`
- Netlify mode:
  - `/.netlify/functions/reddit-proxy?sub=...&q=...`
- Deduplicates by Reddit post id.
- Uses timeout: `AbortSignal.timeout(8000)`.

## News

- Local/file mode direct endpoint:
  - `https://newsapi.org/v2/everything?...`
- Netlify mode:
  - `/.netlify/functions/news-proxy?q=...&apiKey=...`
- Deduplicates by article URL.

## Apify helper APIs

- `POST /v2/acts/{actorId}/runs?token=...`
- `GET /v2/actor-runs/{runId}?token=...` (polling)
- `GET /v2/datasets/{datasetId}/items?...`

## 9. Serverless function design

## `reddit-proxy.js`

- Reads `sub` and `q` query params.
- Calls Reddit search endpoint with a User-Agent.
- Returns JSON with permissive CORS headers.
- Basic error handling with response status mapping.

## `news-proxy.js`

- Reads `q` and `apiKey` query params.
- Calls NewsAPI `everything` endpoint.
- Returns JSON with permissive CORS headers.
- Basic error handling.

## Netlify configuration

`netlify.toml`:

- functions directory: `netlify/functions`
- publish directory: project root (`.`)

## 10. Analytics and visualization layer

Derived analytics:

- Total mentions
- Unique authors
- Total engagement (`likes + comments + shares`)
- Overall sentiment indicator (simple positive vs negative count comparison)

Charts (Chart.js):

- Mention volume by topic (bar)
- Sentiment by platform (stacked bar)
- Volume by platform (doughnut)
- Timeline by week (line)
- Payer mentions (horizontal bar)
- Procedure mentions (horizontal bar)

Additional views:

- Top authors table (top 10 by post count)
- Trending posts list (top 5 by engagement)
- Platform-specific post feed tabs

## 11. Heuristic NLP/classification choices

No ML model is used. All enrichment is rule-based:

- `assignTopic(text)`: regex/keyword buckets
- `analyzeSentiment(text)`: positive/negative word counting
- `detectPayer(text)`: substring match against payer list
- `detectProcedure(text)`: substring match against procedure dictionary

This keeps logic transparent and fast but can be noisy and context-insensitive.

## 12. Credentials and security model

Credentials are stored client-side in `localStorage` (`painmed_creds`):

- Apify token
- LinkedIn `li_at` cookie
- YouTube key
- Reddit client ID/secret (currently not used)
- NewsAPI key

Security implications:

- Secrets live in browser storage and can be inspected by local users/scripts on that origin.
- NewsAPI key is passed as query parameter (including through proxy URL).
- CORS in proxy functions is `*`.

## 13. Current implementation gaps and inconsistencies

1. Missing advanced filter implementations:
   - Buttons call `applyAdvancedFilters()` and `resetAdvancedFilters()`.
   - These functions are not defined, so clicking them will error.

2. Reddit fetch path references undefined variable:
   - `fetchReddit()` iterates `selectedSubs`, but `selectedSubs` is never declared.
   - If Reddit is enabled, this will throw and interrupt fetching.

3. UI/CSS leftovers for subreddit chips:
   - `chips-wrap`/`chip` styles and subreddit mapping constants exist.
   - No active UI wiring currently manages selected subreddit chips/state.

4. Reddit credentials are unused:
   - Inputs for client ID/secret exist but no OAuth flow uses them.

5. README/code drift:
   - README notes mention specific behavior changes; code comments and behavior do not always fully align.

## 14. Performance and reliability profile

Current behavior:

- Source fetchers run sequentially (not in parallel), increasing total wait time.
- Limited retry strategy; per-source failures are often skipped.
- Rate limiting is handled minimally via `sleep(...)` delays.
- Result caps are relatively small (e.g., 10 YouTube results per pass, 20 News/Reddit per query).

Tradeoff:

- Simple and predictable orchestration
- Lower complexity
- Slower large runs and higher sensitivity to external API instability

## 15. Practical mental model

This project is best understood as:

- A static dashboard shell (`pilot.html`)
- A browser-side ETL pipeline (extract from APIs, transform into normalized posts, load into UI)
- A rule-based analytics/reporting layer on top of normalized posts
- Optional Netlify proxy adapters to bypass browser-side restrictions for selected APIs

The design favors portability and rapid iteration over modular architecture and strict security boundaries.
