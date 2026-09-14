const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

const NITTER_INSTANCES = [
    'https://nitter.net',
    'https://nitter.poast.org',
    'https://nitter.privacydev.net',
];

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

function parseRssItems(xml) {
    const items = [];
    const pattern = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = pattern.exec(xml)) !== null) {
        const block = match[1];
        const rawTitle = getTagValue(block, 'title');
        const rawDescription = getTagValue(block, 'description');
        const rawLink = getTagValue(block, 'link');
        const rawPubDate = getTagValue(block, 'pubDate');
        const rawCreator = getTagValue(block, 'dc:creator') || getTagValue(block, 'creator');

        const title = stripTags(rawTitle || rawDescription);
        const url = decodeHtml(rawLink);
        const dateIso = rawPubDate ? new Date(rawPubDate).toISOString() : new Date().toISOString();
        const author = stripTags(rawCreator) || 'Unknown';
        if (!url || !title) continue;

        items.push({
            id: `tw_${Buffer.from(`${url}|${dateIso}`).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`,
            title,
            url,
            date: dateIso,
            author,
            likes: 0,
            comments: 0,
            shares: 0,
        });
    }
    return items;
}

async function fetchWithTimeout(url, ms = 12000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
        return await fetch(url, {
            headers: {
                'Accept': 'application/rss+xml, application/xml, text/xml',
                'User-Agent': 'PainMedDashboard/1.0',
            },
            signal: ctrl.signal,
        });
    } finally {
        clearTimeout(timer);
    }
}

exports.handler = async (event) => {
    if (event?.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    const query = event?.queryStringParameters || {};
    if (query.health === '1') {
        return jsonResponse(200, { ok: true, service: 'twitter-proxy' }, { 'Cache-Control': 'no-store' });
    }

    const q = String(query.q || '').trim();
    const limit = Math.max(1, Math.min(50, Number(query.limit || '20') || 20));
    if (!q) {
        return jsonResponse(400, { code: 'missingQuery', message: 'Missing query parameter: q' }, { 'Cache-Control': 'no-store' });
    }

    let lastErr = '';
    for (const base of NITTER_INSTANCES) {
        const rssUrl = `${base}/search/rss?f=tweets&q=${encodeURIComponent(q)}`;
        try {
            const res = await fetchWithTimeout(rssUrl);
            if (!res.ok) {
                lastErr = `Upstream ${res.status} at ${base}`;
                continue;
            }

            const xml = await res.text();
            const items = parseRssItems(xml).slice(0, limit);
            if (items.length > 0) {
                return jsonResponse(200, {
                    status: 'ok',
                    source: 'nitter-rss',
                    instance: base,
                    items,
                }, { 'Cache-Control': 'public, max-age=120' });
            }

            lastErr = `No items from ${base}`;
        } catch (error) {
            lastErr = error?.message || `Failed to fetch from ${base}`;
        }
    }

    return jsonResponse(502, {
        status: 'error',
        code: 'twitterProxyUnavailable',
        message: 'Twitter fallback feed is currently unavailable.',
        details: lastErr,
    }, { 'Cache-Control': 'no-store' });
};
