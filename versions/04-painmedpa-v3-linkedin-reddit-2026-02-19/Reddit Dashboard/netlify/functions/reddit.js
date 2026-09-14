exports.handler = async function handler(event) {
  const params = event.queryStringParameters || {};
  const subreddit = (params.subreddit || "").replace(/^r\//i, "").trim();
  const allowedSorts = new Set(["new", "hot", "top", "rising"]);
  const sort = allowedSorts.has(params.sort) ? params.sort : "new";
  const limit = Math.min(Math.max(Number(params.limit || 50), 1), 100);

  if (!subreddit) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Missing subreddit" })
    };
  }

  const endpoints = [
    `https://www.reddit.com/r/${encodeURIComponent(
      subreddit
    )}/${encodeURIComponent(sort)}.json?limit=${limit}&raw_json=1`,
    `https://old.reddit.com/r/${encodeURIComponent(
      subreddit
    )}/${encodeURIComponent(sort)}.json?limit=${limit}&raw_json=1`,
    `https://api.reddit.com/r/${encodeURIComponent(subreddit)}/${encodeURIComponent(
      sort
    )}?limit=${limit}&raw_json=1`
  ];

  try {
    let lastFailure = { status: 502, detail: "No endpoint attempted" };
    for (const url of endpoints) {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "web:reddit-dashboard:v1.0 (by /u/reddit_dashboard_clone)",
          Accept: "application/json"
        }
      });

      const text = await response.text();
      if (response.ok) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          },
          body: text
        };
      }

      lastFailure = {
        status: response.status,
        detail: `${url} -> ${String(text).slice(0, 220)}`
      };
    }

    // Fallback provider for environments where Reddit blocks serverless egress.
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
    const fallbackRes = await fetch(fallbackUrl, {
      headers: { Accept: "application/json" }
    });
    const fallbackText = await fallbackRes.text();
    if (fallbackRes.ok) {
      let parsed = null;
      try {
        parsed = JSON.parse(fallbackText);
      } catch (_ignored) {}
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
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(normalized)
      };
    }

    return {
      statusCode: lastFailure.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Reddit denied the request from this Netlify function",
        detail: `${lastFailure.detail}; fallback failed: ${String(fallbackText).slice(0, 220)}`
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message || "Unknown server error" })
    };
  }
};
