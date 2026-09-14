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
  healthcare: ['healthcare', 'medicine', 'HealthIT', 'Hospital'],
  medical: ['medicine', 'medical', 'medschool', 'nursing'],
  billing: ['medicalbilling', 'healthcare', 'smallbusiness', 'practiceadmin'],
  insurance: ['Insurance', 'HealthInsurance', 'medicine', 'personalfinance'],
  medicare: ['medicine', 'healthcare', 'medicalbilling', 'Insurance'],
  pain: ['ChronicPain', 'backpain', 'Fibromyalgia', 'medicine'],
  'pain management': ['ChronicPain', 'medicine', 'healthcare', 'backpain'],
  startup: ['startups', 'Entrepreneur', 'smallbusiness', 'SaaS'],
  saas: ['SaaS', 'startups', 'Entrepreneur', 'smallbusiness']
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function getMinCreatedUtc(nowSec, timeWindow) {
  switch (timeWindow) {
    case 'hour':
      return nowSec - 60 * 60;
    case 'day':
      return nowSec - 24 * 60 * 60;
    case 'week':
      return nowSec - 7 * 24 * 60 * 60;
    case 'month':
      return nowSec - 30 * 24 * 60 * 60;
    case 'year':
      return nowSec - 365 * 24 * 60 * 60;
    default:
      return 0;
  }
}

function buildQueryVariants(input) {
  const cleaned = String(input || '').trim();
  if (!cleaned) return [''];

  const variants = [cleaned];
  const terms = cleaned
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 4);

  const stop = new Set(['with', 'from', 'that', 'this', 'your', 'into', 'about', 'management', 'procedures']);
  for (const t of terms) {
    if (stop.has(t)) continue;
    variants.push(t);
  }

  return [...new Set(variants)].slice(0, 6);
}

function normalizePullpushItem(d, fallbackSubreddit) {
  return {
    title: d.title || '',
    author: d.author || 'unknown',
    subreddit: d.subreddit || fallbackSubreddit || '',
    ups: Number(d.score || 0),
    score: Number(d.score || 0),
    num_comments: Number(d.num_comments || 0),
    selftext: d.selftext || '',
    permalink: d.permalink || '',
    url: d.url || '',
    created_utc: Number(d.created_utc || 0)
  };
}

async function fetchSuggestions(keywords) {
  const fallback = [];
  for (const keyword of keywords) {
    const mapped = KEYWORD_SUBREDDIT_MAP[keyword];
    if (!mapped) continue;
    for (const name of mapped) {
      fallback.push({ name, reason: `keyword: ${keyword}` });
    }
  }

  try {
    const responses = await Promise.all(
      keywords.map(async (keyword) => {
        const url = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(keyword)}&limit=6&include_over_18=off`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'social-listening-local-proxy/1.0 (+http://localhost)',
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
          .map((data) => ({ name: data.display_name, reason: `related to "${keyword}"` }));
      })
    );

    return dedupeByName([...responses.flat(), ...fallback]).slice(0, 20);
  } catch (_err) {
    return dedupeByName(fallback).slice(0, 20);
  }
}

function dedupeByName(items) {
  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    const key = String(item?.name || '').toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
}

async function fetchRedditSearch({ keyword, maxItems, sort, time, subreddits }) {
  const allowedSorts = new Set(['relevance', 'hot', 'top', 'new', 'comments']);
  const allowedTimes = new Set(['hour', 'day', 'week', 'month', 'year', 'all']);

  const querySort = allowedSorts.has(String(sort || '').toLowerCase()) ? String(sort).toLowerCase() : 'relevance';
  const queryTime = allowedTimes.has(String(time || '').toLowerCase()) ? String(time).toLowerCase() : 'all';
  const limit = Math.min(Math.max(Number(maxItems || 25), 1), 100);
  const queryKeyword = String(keyword || '').trim();
  const subredditList = String(subreddits || '')
    .split(',')
    .map((s) => s.trim().replace(/^r\//i, ''))
    .filter(Boolean);

  const params = new URLSearchParams({
    q: queryKeyword,
    limit: String(limit),
    sort: querySort,
    t: queryTime,
    raw_json: '1',
    type: 'link'
  });

  if (subredditList.length) {
    const subredditFilter = subredditList.map((s) => `subreddit:${s}`).join(' OR ');
    const currentQ = params.get('q') || '';
    params.set('q', `(${subredditFilter}) ${currentQ}`.trim());
  }

  const primaryUrls = [
    `https://www.reddit.com/search.json?${params.toString()}`,
    `https://old.reddit.com/search.json?${params.toString()}`,
    `https://api.reddit.com/search?${params.toString()}`
  ];

  for (const url of primaryUrls) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'web:social-listening-dashboard-local:v1.0 (by /u/social_listening_dash)',
        Accept: 'application/json'
      }
    });
    if (!response.ok) continue;
    const payload = await response.json();
    const children = payload?.data?.children || [];
    const results = children
      .map((item) => item?.data || null)
      .filter((post) => post && post.title && post.author !== '[deleted]');
    if (results.length) return results.slice(0, limit);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const minCreatedUtc = getMinCreatedUtc(nowSec, queryTime);
  const queryVariants = buildQueryVariants(queryKeyword);
  const fallbackTargets = subredditList.length ? subredditList : [''];
  const sortTypeMap = { relevance: 'score', hot: 'score', top: 'score', new: 'created_utc', comments: 'num_comments' };
  const sortType = sortTypeMap[querySort] || 'score';

  const collected = [];
  for (const sub of fallbackTargets) {
    for (const q of queryVariants) {
      const fallbackUrl =
        `https://api.pullpush.io/reddit/search/submission/?q=${encodeURIComponent(q)}` +
        `&size=${limit}&sort=desc&sort_type=${encodeURIComponent(sortType)}` +
        (sub ? `&subreddit=${encodeURIComponent(sub)}` : '');

      const fallbackRes = await fetch(fallbackUrl, { headers: { Accept: 'application/json' } });
      if (!fallbackRes.ok) continue;
      const payload = await fallbackRes.json();
      const items = Array.isArray(payload?.data) ? payload.data : [];
      for (const d of items) {
        if (!d?.title || d?.author === '[deleted]') continue;
        const createdUtc = Number(d.created_utc || 0);
        if (minCreatedUtc && createdUtc && createdUtc < minCreatedUtc) continue;
        collected.push(normalizePullpushItem(d, sub));
      }
      if (collected.length >= limit) break;
    }
    if (collected.length >= limit) break;
  }

  const deduped = [];
  const seen = new Set();
  for (const post of collected) {
    const key = post.permalink || `${post.subreddit}|${post.title}|${post.author}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(post);
  }

  return deduped.slice(0, limit);
}

async function handleSuggest(reqUrl, res) {
  const rawKeywords = (reqUrl.searchParams.get('keywords') || '')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  if (!rawKeywords.length) {
    return sendJson(res, 400, { error: 'Missing keywords' });
  }

  const suggestions = await fetchSuggestions(rawKeywords);
  return sendJson(res, 200, { suggestions });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function handleRedditSearch(req, res) {
  try {
    const body = await readJsonBody(req);
    const rows = await fetchRedditSearch(body || {});
    return sendJson(res, 200, rows);
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Failed to fetch Reddit data' });
  }
}

function encodeActorPath(actorId) {
  return String(actorId || '')
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

async function handleApifyRun(req, res) {
  try {
    const body = await readJsonBody(req);
    const actorId = String(body?.actorId || '').trim();
    const token = String(body?.token || '').trim();
    const input = body?.input || {};

    if (!actorId || !token) {
      return sendJson(res, 400, { error: 'Missing actorId or token' });
    }

    const apifyUrl = `https://api.apify.com/v2/acts/${encodeActorPath(actorId)}/runs?token=${encodeURIComponent(token)}`;
    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(input)
    });

    const text = await response.text();
    if (!response.ok) {
      return sendJson(res, response.status, { error: text.slice(0, 300) || `Apify returned ${response.status}` });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch (_ignored) {}
    return sendJson(res, 200, parsed);
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Failed to start Apify run' });
  }
}

async function handleApifyRunStatus(reqUrl, res) {
  try {
    const token = String(reqUrl.searchParams.get('token') || '').trim();
    const runId = String(reqUrl.searchParams.get('runId') || '').trim();
    if (!token || !runId) {
      return sendJson(res, 400, { error: 'Missing token or runId' });
    }

    const apifyUrl = `https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?token=${encodeURIComponent(token)}`;
    const response = await fetch(apifyUrl, { headers: { Accept: 'application/json' } });
    const text = await response.text();
    if (!response.ok) {
      return sendJson(res, response.status, { error: text.slice(0, 300) || `Apify returned ${response.status}` });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch (_ignored) {}
    return sendJson(res, 200, parsed);
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Failed to get run status' });
  }
}

async function handleApifyDataset(reqUrl, res) {
  try {
    const token = String(reqUrl.searchParams.get('token') || '').trim();
    const datasetId = String(reqUrl.searchParams.get('datasetId') || '').trim();
    if (!token || !datasetId) {
      return sendJson(res, 400, { error: 'Missing token or datasetId' });
    }

    const apifyUrl = `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?token=${encodeURIComponent(token)}&format=json`;
    const response = await fetch(apifyUrl, { headers: { Accept: 'application/json' } });
    const text = await response.text();
    if (!response.ok) {
      return sendJson(res, response.status, { error: text.slice(0, 300) || `Apify returned ${response.status}` });
    }

    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch (_ignored) {}
    return sendJson(res, 200, parsed);
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Failed to get dataset' });
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
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    });
    res.end();
    return;
  }

  if (reqUrl.pathname === '/api/suggest-subreddits' && req.method === 'GET') {
    return handleSuggest(reqUrl, res);
  }

  if (reqUrl.pathname === '/api/reddit-search' && req.method === 'POST') {
    return handleRedditSearch(req, res);
  }

  if (reqUrl.pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, service: 'social-listening-local-api' });
  }

  if (reqUrl.pathname === '/api/apify/run' && req.method === 'POST') {
    return handleApifyRun(req, res);
  }

  if (reqUrl.pathname === '/api/apify/run-status' && req.method === 'GET') {
    return handleApifyRunStatus(reqUrl, res);
  }

  if (reqUrl.pathname === '/api/apify/dataset' && req.method === 'GET') {
    return handleApifyDataset(reqUrl, res);
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
  console.log(`Local server running at http://${HOST}:${PORT}`);
});
