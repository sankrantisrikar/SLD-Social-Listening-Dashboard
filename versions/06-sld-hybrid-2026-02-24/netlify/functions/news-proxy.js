// Native fetch is available in Node.js 18+ on Netlify Functions

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_ENTRIES = 100;
const cache = new Map();

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parsePageSize(raw) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return 20;
    return Math.max(1, Math.min(100, Math.floor(n)));
}

function shouldRetryStatus(status) {
    return status === 429 || status >= 500;
}

async function fetchWithRetry(url, maxAttempts = 3) {
    let attempt = 0;
    let lastError = null;

    while (attempt < maxAttempts) {
        attempt++;
        try {
            const response = await fetch(url);
            if (shouldRetryStatus(response.status) && attempt < maxAttempts) {
                const backoffMs = 400 * (2 ** (attempt - 1));
                await sleep(backoffMs);
                continue;
            }
            return response;
        } catch (error) {
            lastError = error;
            if (attempt >= maxAttempts) break;
            const backoffMs = 400 * (2 ** (attempt - 1));
            await sleep(backoffMs);
        }
    }

    throw lastError || new Error('Unknown network error');
}

function getCached(cacheKey) {
    const entry = cache.get(cacheKey);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(cacheKey);
        return null;
    }
    return entry.payload;
}

function setCached(cacheKey, payload) {
    if (cache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) cache.delete(oldestKey);
    }
    cache.set(cacheKey, {
        payload,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });
}

function jsonResponse(statusCode, body, extraHeaders = {}) {
    return {
        statusCode,
        headers: { ...CORS_HEADERS, ...extraHeaders },
        body: JSON.stringify(body),
    };
}

function decodeHtml(text) {
    return String(text || '')
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function stripTags(text) {
    return decodeHtml(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getTagValue(block, tag) {
    const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = String(block || '').match(re);
    return match ? match[1].trim() : '';
}

function parseGoogleNewsRss(xml, limit) {
    const out = [];
    const re = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = re.exec(xml)) !== null) {
        const block = match[1];
        const title = stripTags(getTagValue(block, 'title'));
        const description = stripTags(getTagValue(block, 'description'));
        const link = decodeHtml(getTagValue(block, 'link'));
        const pubDate = getTagValue(block, 'pubDate');
        const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
        const sourceName = stripTags(sourceMatch ? sourceMatch[1] : '') || 'Google News';
        if (!title || !link) continue;

        out.push({
            source: { name: sourceName },
            author: sourceName,
            title,
            description,
            url: link,
            publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
            content: description,
        });
        if (out.length >= limit) break;
    }
    return out;
}

async function fetchGoogleNewsFallback(q, pageSize) {
    const rssParams = new URLSearchParams({
        q,
        hl: 'en-US',
        gl: 'US',
        ceid: 'US:en',
    });
    const rssUrl = `https://news.google.com/rss/search?${rssParams.toString()}`;
    const response = await fetchWithRetry(rssUrl, 2);
    if (!response.ok) {
        return {
            ok: false,
            statusCode: response.status,
            payload: {
                status: 'error',
                code: 'googleNewsFallbackFailed',
                message: `Google News RSS fallback failed (${response.status}).`,
            },
        };
    }

    const xml = await response.text();
    const articles = parseGoogleNewsRss(xml, pageSize);
    return {
        ok: true,
        statusCode: 200,
        payload: {
            status: 'ok',
            source: 'google_news_rss',
            totalResults: articles.length,
            articles,
        },
    };
}

exports.handler = async (event) => {
    if (event?.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    const query = event?.queryStringParameters || {};

    // Lightweight probe endpoint for local diagnostics.
    if (query.health === '1') {
        return jsonResponse(200, { ok: true, service: 'news-proxy' }, { 'Cache-Control': 'no-store' });
    }

    const q = String(query.q || '').trim();
    const apiKey = String(process.env.NEWSAPI_KEY || '').trim();
    const language = String(query.language || 'en').trim() || 'en';
    const sortBy = String(query.sortBy || 'publishedAt').trim() || 'publishedAt';
    const pageSize = parsePageSize(query.pageSize);

    if (!q) {
        return jsonResponse(400, {
            status: 'error',
            code: 'missingQuery',
            message: 'Missing required query parameter: q',
        });
    }

    if (!apiKey) {
        try {
            const fallback = await fetchGoogleNewsFallback(q, pageSize);
            return jsonResponse(fallback.statusCode, fallback.payload, {
                'Cache-Control': fallback.ok ? 'public, max-age=120' : 'no-store',
                'X-News-Source': 'google-news-rss-fallback',
            });
        } catch (error) {
            return jsonResponse(502, {
                status: 'error',
                code: 'proxyMissingApiKey',
                message: 'NEWSAPI_KEY is not configured on the server and fallback feed failed.',
                details: error.message,
            }, { 'Cache-Control': 'no-store' });
        }
    }

    const cacheKey = `${q}|${language}|${sortBy}|${pageSize}`;
    const cached = getCached(cacheKey);
    if (cached) {
        return jsonResponse(200, cached, {
            'Cache-Control': 'public, max-age=60',
            'X-Cache': 'HIT',
        });
    }

    try {
        const params = new URLSearchParams({
            q,
            language,
            sortBy,
            pageSize: String(pageSize),
            apiKey,
        });
        const upstreamUrl = `https://newsapi.org/v2/everything?${params.toString()}`;
        const upstreamResponse = await fetchWithRetry(upstreamUrl, 3);

        const rawText = await upstreamResponse.text();
        let data;
        try {
            data = JSON.parse(rawText);
        } catch {
            data = {
                status: 'error',
                code: 'upstreamNonJson',
                message: rawText || 'Unexpected non-JSON response from NewsAPI',
            };
        }

        if (!upstreamResponse.ok) {
            return jsonResponse(upstreamResponse.status, data, { 'Cache-Control': 'no-store' });
        }

        if (data?.status === 'ok') {
            setCached(cacheKey, data);
            return jsonResponse(200, data, {
                'Cache-Control': 'public, max-age=60',
                'X-Cache': 'MISS',
            });
        }

        return jsonResponse(502, {
            status: 'error',
            code: data?.code || 'unexpectedUpstreamShape',
            message: data?.message || 'Unexpected NewsAPI response payload.',
        });
    } catch (error) {
        return jsonResponse(500, {
            status: 'error',
            code: 'proxyFetchFailed',
            message: 'Failed to fetch from NewsAPI',
            details: error.message,
        });
    }
};
