# NewsAPI Stabilization Progress Log

Date: February 23, 2026
Scope: End-to-end hardening of News fetching for reliable local and deployed behavior.

## 1. Problem Statement

News fetching was unreliable due to:

- Silent frontend failure paths (`status !== ok` was only logged, not surfaced).
- Proxy returning HTTP `200` even when NewsAPI upstream failed.
- Client-side key flow and request patterns that increased quota/rate-limit risk.
- Local/deployed behavior mismatch and unclear runtime guidance.

## 2. Implemented Changes

## `netlify/functions/news-proxy.js`

1. Added defensive request parsing and CORS handling.
   - Handles missing query object safely.
   - Added `OPTIONS` preflight response.
   - Added lightweight health probe (`?health=1`).

2. Moved key ownership to server runtime.
   - Uses only `process.env.NEWSAPI_KEY`.
   - Returns structured `proxyMissingApiKey` error when unset.

3. Added retry/backoff for transient failures.
   - Retries on `429` and `5xx` responses.
   - Exponential backoff across attempts.

4. Added short in-memory cache.
   - 5-minute TTL.
   - Caps cache size to avoid unbounded growth.
   - Emits `X-Cache: HIT|MISS`.

5. Propagated upstream status correctly.
   - Upstream non-OK responses now return matching HTTP status.
   - Frontend can now differentiate invalid key, quota, rate limit, etc.

6. Switched URL construction to `URLSearchParams`.
   - Removes fragile string concatenation for query parameters.

Reference: [news-proxy.js](/Users/revanthdamisetty/Desktop/Projects/SLD-%20Hybrid/netlify/functions/news-proxy.js)

## `pilot.html`

1. News source is now proxy-oriented.
   - `fetchNews` always calls `/.netlify/functions/news-proxy`.
   - Direct browser calls to `newsapi.org` were removed.

2. Reduced NewsAPI request volume.
   - Combined keyword list into one OR query (single request path).
   - Prevents one-request-per-keyword quota burn.

3. Added explicit News error classification.
   - Human-readable mapping for:
     - proxy not found (`404`)
     - rate limit (`429`, `rateLimited`)
     - invalid key (`apiKeyInvalid`)
     - exhausted quota (`apiKeyExhausted`)
     - plan/environment restriction (`developmentMode`)
     - missing server key (`proxyMissingApiKey`)

4. Improved runtime guidance messaging.
   - File mode warning now points to `netlify dev`.
   - Localhost warning clarifies proxy dependency.
   - Source label updated to `News (proxy)`.

5. Removed News key from blocking credential validation.
   - News no longer requires client key input to proceed.

6. Stability fix applied (dependency issue discovered during implementation).
   - Added `selectedSubs` initialization to prevent Reddit path runtime failure that could abort full fetch runs.

Reference: [pilot.html](/Users/revanthdamisetty/Desktop/Projects/SLD-%20Hybrid/pilot.html)

## 3. Configuration Required

Set this environment variable in Netlify:

- `NEWSAPI_KEY=<your_newsapi_key>`

Where:

- Netlify UI: Site settings -> Environment variables
- Local dev with Netlify CLI: configure env for `netlify dev` workflow

Important: browser credential field for News is now deprecated and non-authoritative.

## 4. Verification Performed

1. Syntax checks passed:
   - `node --check netlify/functions/news-proxy.js`
   - `node --check netlify/functions/reddit-proxy.js`
   - Inline script syntax compile check for `pilot.html` passed via Node `vm.Script`.

2. Proxy behavior sanity:
   - Invalid upstream key now returns structured error payloads.
   - Missing `NEWSAPI_KEY` now returns explicit proxy configuration error.

## 5. Expected Runtime Behavior After Patch

1. If `NEWSAPI_KEY` is set and plan permits environment:
   - News fetch should succeed via proxy with clearer reliability.

2. If key is invalid or quota exhausted:
   - UI now shows actionable error instead of silently returning empty posts.

3. If running plain `http.server` locally:
   - News may fail because Netlify function path is unavailable.
   - Run with `netlify dev` for local proxy support.

## 6. Follow-up Recommendations

1. Remove deprecated News credential input from UI entirely (optional cleanup).
2. Add a small startup self-check call to `/.netlify/functions/news-proxy?health=1` and show readiness status in UI.
3. Add event logging for News errors to monitor real-world failure distribution (key invalid vs quota vs plan restrictions).

## 7. Hotfix: Localhost 404 on Python Server (February 23, 2026)

Observed issue:

- Requests to `/.netlify/functions/news-proxy` returned `404` when running with `python3 -m http.server`.
- Root cause: Python static server does not host Netlify Functions routes.

Implemented fix in frontend:

1. Added automatic fallback logic in `fetchNews`.
   - Try proxy first.
   - If proxy is unavailable (`404` or network fail) and host is localhost, fallback to direct NewsAPI request.
   - Fallback requires News key from Credentials drawer.

2. Updated credentials label/help text.
   - News key is now explicitly marked as optional localhost fallback.

3. Updated localhost runtime guidance copy.
   - Clarifies preferred proxy mode and fallback behavior on plain local static servers.

Result:

- `netlify dev` path continues to use secure server-side env key (`NEWSAPI_KEY`).
- `python3 -m http.server` path now works for News if local News key is provided.

## 8. Hotfix: Netlify Root URL 404 (February 23, 2026)

Observed issue:

- Deployed Netlify root (`/`) returned "Page not found".
- Root cause: project entry is `pilot.html`, but root route expected `index.html` or explicit redirect.

Implemented fixes:

1. Added root entry file:
   - `index.html` created to redirect to `/pilot.html`.

2. Added Netlify redirect rule:
   - In `netlify.toml`, added:
     - `from = "/"`, `to = "/pilot.html"`, `status = 301`

Result:

- Opening site root now resolves to dashboard entry consistently across static and Netlify hosting paths.
