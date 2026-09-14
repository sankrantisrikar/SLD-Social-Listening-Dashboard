// No require needed - native fetch is available in Node.js 18+

exports.handler = async (event, context) => {
    const { q, apiKey } = event.queryStringParameters || {};
    const resolvedApiKey = apiKey || process.env.NEWSAPI_KEY;

    if (!q || !resolvedApiKey) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing query (q) or NEWSAPI key' }),
        };
    }

    try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${resolvedApiKey}`;
        const response = await fetch(url);
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
            body: JSON.stringify({ error: 'Failed to fetch from NewsAPI', details: error.message }),
        };
    }
};
