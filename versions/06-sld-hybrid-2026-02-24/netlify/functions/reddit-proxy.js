const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

let tokenCache = {
    accessToken: '',
    expiresAt: 0,
};

function hasRedditOAuthConfig() {
    const clientId = String(process.env.REDDIT_CLIENT_ID || '').trim();
    const clientSecret = String(process.env.REDDIT_CLIENT_SECRET || '').trim();
    return Boolean(clientId && clientSecret);
}

function jsonResponse(statusCode, body, extraHeaders = {}) {
    return {
        statusCode,
        headers: { ...CORS_HEADERS, ...extraHeaders },
        body: JSON.stringify(body),
    };
}

function sanitizeQuery(raw) {
    const value = String(raw || '').trim();
    return value.replace(/^"(.*)"$/, '$1');
}

async function readUpstreamBody(response) {
    const raw = await response.text();
    try {
        return JSON.parse(raw);
    } catch {
        return { message: raw || response.statusText || 'Unknown upstream response' };
    }
}

async function getRedditAccessToken() {
    const now = Date.now();
    if (tokenCache.accessToken && now < tokenCache.expiresAt) {
        return tokenCache.accessToken;
    }

    const clientId = String(process.env.REDDIT_CLIENT_ID || '').trim();
    const clientSecret = String(process.env.REDDIT_CLIENT_SECRET || '').trim();

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': String(process.env.REDDIT_USER_AGENT || 'PainMedDashboard/1.0'),
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    });

    if (!response.ok) {
        const payload = await readUpstreamBody(response);
        throw new Error(payload?.message || `OAuth token request failed (${response.status})`);
    }

    const payload = await response.json();
    const expiresInSec = Number(payload?.expires_in || 3600);
    tokenCache = {
        accessToken: String(payload?.access_token || ''),
        // Refresh slightly early.
        expiresAt: now + Math.max(60, expiresInSec - 60) * 1000,
    };

    return tokenCache.accessToken;
}

async function fetchRedditSearch({ sub, q, token }) {
    const userAgent = String(process.env.REDDIT_USER_AGENT || 'PainMedDashboard/1.0');
    const params = new URLSearchParams({
        q,
        sort: 'new',
        limit: '20',
        t: 'month',
        restrict_sr: 'true',
        raw_json: '1',
    });

    const useOAuth = Boolean(token);
    const base = useOAuth ? 'https://oauth.reddit.com' : 'https://old.reddit.com';
    const url = `${base}/r/${sub}/search.json?${params.toString()}`;
    const headers = {
        'Accept': 'application/json',
        'User-Agent': userAgent,
    };
    if (useOAuth) headers.Authorization = `Bearer ${token}`;

    return fetch(url, { headers });
}

exports.handler = async (event) => {
    if (event?.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    const query = event?.queryStringParameters || {};
    if (query.health === '1') {
        return jsonResponse(200, { ok: true, service: 'reddit-proxy' }, { 'Cache-Control': 'no-store' });
    }

    const sub = String(query.sub || '').trim();
    const q = sanitizeQuery(query.q);
    if (!sub || !q) {
        return jsonResponse(400, {
            code: 'missingParameters',
            message: 'Missing subreddit (sub) or query (q)',
        });
    }

    try {
        let token = '';
        if (hasRedditOAuthConfig()) {
            try {
                token = await getRedditAccessToken();
            } catch (oauthError) {
                // Fall back to anonymous mode if OAuth setup exists but token fetch fails.
                token = '';
            }
        }

        const upstream = await fetchRedditSearch({ sub, q, token });
        const payload = await readUpstreamBody(upstream);
        if (!upstream.ok) {
            const isAnonymousBlocked = !token && upstream.status === 403;
            return jsonResponse(upstream.status, {
                code: isAnonymousBlocked ? 'redditAnonymousBlocked' : 'redditUpstreamError',
                message: payload?.message || `Reddit API error (${upstream.status})`,
                upstreamStatus: upstream.status,
                hint: isAnonymousBlocked
                    ? 'Reddit blocked anonymous requests for this host. Configure REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET for reliable access.'
                    : undefined,
            }, { 'Cache-Control': 'no-store' });
        }

        return jsonResponse(200, payload, { 'Cache-Control': 'public, max-age=60' });
    } catch (error) {
        return jsonResponse(500, {
            code: 'proxyFetchFailed',
            message: 'Failed to fetch from Reddit',
            details: error.message,
        }, { 'Cache-Control': 'no-store' });
    }
};
