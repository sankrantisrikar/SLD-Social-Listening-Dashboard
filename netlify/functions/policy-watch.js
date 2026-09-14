const { createHash } = require('crypto');

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json',
    };
}

function cleanText(html) {
    if (!html) return '';
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function extractTitle(html) {
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return match ? cleanText(match[1]).slice(0, 220) : 'Untitled policy page';
}

function extractEffectiveDate(text) {
    const patterns = [
        /(effective(?:\s+date)?|implementation(?:\s+date)?|valid(?:\s+from)?)\s*[:\-]?\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},\s+\d{4})/i,
        /(effective(?:\s+date)?|implementation(?:\s+date)?|valid(?:\s+from)?)\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
        /(effective(?:\s+date)?|implementation(?:\s+date)?|valid(?:\s+from)?)\s*[:\-]?\s*(\d{4}[\/\-]\d{2}[\/\-]\d{2})/i,
    ];
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[2];
    }
    return '';
}

function findMatches(text, terms) {
    const lower = text.toLowerCase();
    const matched = [];
    for (const term of terms) {
        const t = String(term || '').trim().toLowerCase();
        if (!t) continue;
        if (lower.includes(t)) matched.push(term.trim());
    }
    return [...new Set(matched)];
}

function normalizeWatchItem(item) {
    return {
        payer: String(item?.payer || '').trim() || 'Unknown Payer',
        url: String(item?.url || '').trim(),
        procedures: Array.isArray(item?.procedures)
            ? item.procedures.map(v => String(v).trim()).filter(Boolean)
            : String(item?.procedures || '').split(',').map(v => v.trim()).filter(Boolean),
        keywords: Array.isArray(item?.keywords)
            ? item.keywords.map(v => String(v).trim()).filter(Boolean)
            : String(item?.keywords || '').split(',').map(v => v.trim()).filter(Boolean),
    };
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders(),
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const parsed = JSON.parse(event.body || '{}');
        const input = Array.isArray(parsed.watchlist) ? parsed.watchlist : [];
        if (!input.length) {
            return {
                statusCode: 400,
                headers: corsHeaders(),
                body: JSON.stringify({ error: 'watchlist is required' }),
            };
        }

        const watchlist = input.slice(0, 40).map(normalizeWatchItem).filter(i => i.url);
        const scannedAt = new Date().toISOString();
        const results = [];

        for (const item of watchlist) {
            try {
                const response = await fetch(item.url, {
                    headers: { 'User-Agent': 'PolicyWatchBot/1.0 (+Netlify function)' },
                    signal: AbortSignal.timeout(14000),
                });

                if (!response.ok) {
                    results.push({
                        payer: item.payer,
                        url: item.url,
                        status: 'error',
                        error: `HTTP ${response.status}`,
                    });
                    continue;
                }

                const html = await response.text();
                const text = cleanText(html);
                const hash = createHash('sha256').update(text.slice(0, 250000)).digest('hex');
                const title = extractTitle(html);
                const effectiveDate = extractEffectiveDate(text);
                const matchedKeywords = findMatches(text, item.keywords);
                const matchedProcedures = findMatches(text, item.procedures);

                results.push({
                    payer: item.payer,
                    url: item.url,
                    status: 'ok',
                    title,
                    hash,
                    effectiveDate,
                    matchedKeywords,
                    matchedProcedures,
                    excerpt: text.slice(0, 600),
                });
            } catch (error) {
                results.push({
                    payer: item.payer,
                    url: item.url,
                    status: 'error',
                    error: error.message || 'Fetch failed',
                });
            }
        }

        return {
            statusCode: 200,
            headers: corsHeaders(),
            body: JSON.stringify({ scannedAt, results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ error: 'Policy watch failed', details: error.message }),
        };
    }
};
