const KEYWORD_SUBREDDIT_MAP = {
  saas: ["SaaS", "startups", "Entrepreneur", "smallbusiness"],
  startup: ["startups", "Entrepreneur", "smallbusiness", "cofounder"],
  marketing: ["marketing", "digital_marketing", "SEO", "PPC"],
  seo: ["SEO", "bigseo", "TechSEO", "marketing"],
  sales: ["sales", "Entrepreneur", "smallbusiness", "startups"],
  ai: ["artificial", "MachineLearning", "ChatGPT", "OpenAI"],
  automation: ["nocode", "Automate", "Zapier", "SaaS"],
  ecommerce: ["ecommerce", "shopify", "AmazonSeller", "Entrepreneur"],
  developer: ["webdev", "programming", "javascript", "reactjs"],
  design: ["Design", "UXDesign", "UI_Design", "web_design"],
  crypto: ["CryptoCurrency", "bitcoin", "ethtrader", "defi"],
  finance: ["personalfinance", "FinancialPlanning", "investing", "stocks"]
};

function mapSuggestionsFromKeywords(keywords) {
  const suggestions = [];
  for (const keyword of keywords) {
    const key = keyword.toLowerCase();
    const mapped = KEYWORD_SUBREDDIT_MAP[key];
    if (!mapped) continue;
    for (const name of mapped) {
      suggestions.push({ name, reason: `keyword: ${keyword}` });
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const item of suggestions) {
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
      "User-Agent": "reddit-dashboard-netlify-function/1.0",
      Accept: "application/json"
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

exports.handler = async function handler(event) {
  const rawKeywords = (event.queryStringParameters?.keywords || "")
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  if (!rawKeywords.length) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Missing keywords" })
    };
  }

  const fallbackSuggestions = mapSuggestionsFromKeywords(rawKeywords);

  try {
    const responses = await Promise.all(
      rawKeywords.map((keyword) => fetchRedditSubredditSuggestions(keyword))
    );
    const combined = [...responses.flat(), ...fallbackSuggestions];
    const deduped = [];
    const seen = new Set();
    for (const item of combined) {
      const key = String(item.name || "").toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ suggestions: deduped.slice(0, 20) })
    };
  } catch (_error) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ suggestions: fallbackSuggestions })
    };
  }
};
