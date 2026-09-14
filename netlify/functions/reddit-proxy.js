// No require needed - native fetch is available in Node.js 18+

async function getRedditAccessToken(clientId, clientSecret) {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SocialListeningDashboard/1.0 (Netlify OAuth Proxy)'
        },
        body: 'grant_type=client_credentials'
    });

    if (!tokenRes.ok) {
        const text = await tokenRes.text();
        throw new Error(`OAuth token request failed (${tokenRes.status}): ${text.slice(0, 180)}`);
    }

    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) {
        throw new Error('OAuth response did not include an access token');
    }
    return tokenJson.access_token;
}

exports.handler = async (event, context) => {
    const { sub, q, limit = '20', clientId, clientSecret } = event.queryStringParameters || {};

    if (!sub || !q) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing subreddit (sub) or query (q)' }),
        };
    }

    const resolvedClientId = (clientId || process.env.REDDIT_CLIENT_ID || '').trim();
    const resolvedClientSecret = (clientSecret || process.env.REDDIT_CLIENT_SECRET || '').trim();
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

    try {
        let response;
        let mode = 'public';

        if (resolvedClientId && resolvedClientSecret) {
            const token = await getRedditAccessToken(resolvedClientId, resolvedClientSecret);
            const apiUrl = `https://oauth.reddit.com/r/${encodeURIComponent(sub)}/search?q=${encodeURIComponent(q)}&sort=new&limit=${safeLimit}&t=month&restrict_sr=true`;
            response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'User-Agent': 'SocialListeningDashboard/1.0 (Netlify OAuth Proxy)',
                    'Accept': 'application/json'
                }
            });
            mode = 'oauth';
        } else {
            const apiUrl = `https://www.reddit.com/r/${encodeURIComponent(sub)}/search.json?q=${encodeURIComponent(q)}&sort=new&limit=${safeLimit}&t=month&restrict_sr=true`;
            response = await fetch(apiUrl, {
                headers: {
                    'User-Agent': 'SocialListeningDashboard/1.0 (Netlify Public Proxy)',
                    'Accept': 'application/json'
                }
            });
        }

        if (!response.ok) {
            const text = await response.text();
            if (mode === 'public') {
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: { children: [] },
                        _mode: 'public',
                        _warning: `Public Reddit fetch blocked (${response.status})`
                    }),
                };
            }
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: `Reddit API error (${response.status})`,
                    mode,
                    details: text.slice(0, 180)
                }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, _mode: mode }),
        };
    } catch (error) {
        if (!resolvedClientId || !resolvedClientSecret) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { children: [] }, _mode: 'public', _warning: 'Reddit public mode failed or was blocked' }),
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch from Reddit OAuth API', details: error.message }),
        };
    }
};
