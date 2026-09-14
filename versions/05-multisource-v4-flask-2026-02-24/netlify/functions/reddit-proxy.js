// No require needed - native fetch is available in Node.js 18+

exports.handler = async (event, context) => {
    const { sub, q } = event.queryStringParameters;

    if (!sub || !q) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing subreddit (sub) or query (q)' }),
        };
    }

    try {
        const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(q)}&sort=new&limit=20&t=month&restrict_sr=true`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'PainMedDashboard/1.0.0 (Netlify Proxy)'
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Reddit API error: ${response.statusText}` }),
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
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch from Reddit', details: error.message }),
        };
    }
};
