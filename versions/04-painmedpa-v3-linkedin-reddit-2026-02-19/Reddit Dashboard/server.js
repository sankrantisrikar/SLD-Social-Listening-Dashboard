const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 5173);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const KEYWORD_SUBREDDIT_MAP = {
  saas: ['SaaS', 'startups', 'Entrepreneur', 'smallbusiness'],
  startup: ['startups', 'Entrepreneur', 'smallbusiness', 'cofounder'],
  marketing: ['marketing', 'digital_marketing', 'SEO', 'PPC'],
  seo: ['SEO', 'bigseo', 'TechSEO', 'marketing'],
  sales: ['sales', 'Entrepreneur', 'smallbusiness', 'startups'],
  ai: ['artificial', 'MachineLearning', 'ChatGPT', 'OpenAI'],
  automation: ['nocode', 'Automate', 'Zapier', 'SaaS'],
  ecommerce: ['ecommerce', 'shopify', 'AmazonSeller', 'Entrepreneur'],
  developer: ['webdev', 'programming', 'javascript', 'reactjs'],
  design: ['Design', 'UXDesign', 'UI_Design', 'web_design'],
  crypto: ['CryptoCurrency', 'bitcoin', 'ethtrader', 'defi'],
  finance: ['personalfinance', 'FinancialPlanning', 'investing', 'stocks']
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}

function mapSuggestionsFromKeywords(keywords) {
  const picks = [];
  for (const keyword of keywords) {
    const key = keyword.toLowerCase();
    const options = KEYWORD_SUBREDDIT_MAP[key];
    if (!options) continue;
    for (const name of options) {
      picks.push({ name, reason: `keyword: ${keyword}` });
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const item of picks) {
    const key = item.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  return deduped.slice(0, 20);
}

async function fetchRedditSubredditSuggestions(keyword) {
  const url = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(
    keyword
  )}&limit=6&include_over_18=off`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'reddit-dashboard-local-proxy/1.0 (+http://localhost)',
      Accept: 'application/json'
    }
  });
  if (!response.ok) return [];
  const payload = await response.json();
  const children = payload?.data?.children ?? [];
  return children
    .map((child) => child?.data)
    .filter(Boolean)
    .filter((data) => !data.over18 && !!data.display_name)
    .map((data) => ({
      name: data.display_name,
      reason: `related to "${keyword}"`
    }));
}

async function handleSuggestApi(res, reqUrl) {
  const rawKeywords = (reqUrl.searchParams.get('keywords') || '')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  if (!rawKeywords.length) {
    return sendJson(res, 400, { error: 'Missing keywords' });
  }

  const fallbackSuggestions = mapSuggestionsFromKeywords(rawKeywords);

  try {
    const fetches = rawKeywords.map((keyword) => fetchRedditSubredditSuggestions(keyword));
    const results = await Promise.all(fetches);
    const merged = results.flat();
    const mergedWithFallback = [...merged, ...fallbackSuggestions];

    const deduped = [];
    const seen = new Set();
    for (const item of mergedWithFallback) {
      const key = String(item.name || '').toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
    }
    return sendJson(res, 200, { suggestions: deduped.slice(0, 20) });
  } catch (_err) {
    return sendJson(res, 200, { suggestions: fallbackSuggestions });
  }
}

async function handleApi(req, res, reqUrl) {
  const subreddit = (reqUrl.searchParams.get('subreddit') || '').replace(/^r\//i, '').trim();
  const sort = reqUrl.searchParams.get('sort') || 'new';
  const limit = Math.min(Math.max(Number(reqUrl.searchParams.get('limit') || 50), 1), 100);

  if (!subreddit) {
    return sendJson(res, 400, { error: 'Missing subreddit' });
  }

  const redditUrl = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/${encodeURIComponent(sort)}.json?limit=${limit}&raw_json=1`;

  try {
    const redditRes = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'reddit-dashboard-local-proxy/1.0 (+http://localhost)'
      }
    });

    if (!redditRes.ok) {
      const text = await redditRes.text();
      const sortTypeBySort = {
        new: "created_utc",
        hot: "score",
        top: "score",
        rising: "num_comments"
      };
      const sortType = sortTypeBySort[sort] || "created_utc";
      const fallbackUrl = `https://api.pullpush.io/reddit/search/submission/?subreddit=${encodeURIComponent(
        subreddit
      )}&size=${limit}&sort=desc&sort_type=${encodeURIComponent(sortType)}`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackText = await fallbackRes.text();
      if (fallbackRes.ok) {
        const parsed = JSON.parse(fallbackText);
        const items = Array.isArray(parsed?.data) ? parsed.data : [];
        const normalized = {
          data: {
            children: items.map((d) => ({
              data: {
                title: d.title || "",
                author: d.author || "unknown",
                subreddit: d.subreddit || subreddit,
                score: Number(d.score || 0),
                num_comments: Number(d.num_comments || 0),
                selftext: d.selftext || "",
                permalink: d.permalink || null
              }
            }))
          }
        };
        return sendJson(res, 200, normalized);
      }
      return sendJson(res, redditRes.status, {
        error: `Reddit request failed with ${redditRes.status}`,
        detail: `${text.slice(0, 160)}; fallback failed: ${fallbackText.slice(0, 160)}`
      });
    }

    const data = await redditRes.json();
    return sendJson(res, 200, data);
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Unknown server error' });
  }
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream'
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  if (reqUrl.pathname === '/api/reddit') {
    return handleApi(req, res, reqUrl);
  }
  if (reqUrl.pathname === '/api/suggest-subreddits') {
    return handleSuggestApi(res, reqUrl);
  }

  let pathname = reqUrl.pathname;
  if (pathname === '/') pathname = '/index.html';

  const normalizedPath = path.normalize(pathname).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(ROOT, normalizedPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  serveFile(res, filePath);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
