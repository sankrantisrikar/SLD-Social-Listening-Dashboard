# Social Listening Dashboard

Multi-source analytics dashboard for pain management intelligence.

## Features

- **YouTube** - Video content analysis
- **LinkedIn** - Professional network insights
- **Reddit** - Community discussions
- **X/Twitter** - Social media trends
- **News** - Latest articles via NewsAPI

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure `.env`:
```
APIFY_TOKEN=your_apify_token
NEWSAPI_KEY=your_newsapi_key
```

3. Run Flask server:
```bash
python app.py
```

4. Open browser:
```
http://localhost:5000
```

## Netlify Deployment

1. Install/login Netlify CLI:
```bash
npm i -g netlify-cli
netlify login
```

2. Deploy from project root:
```bash
netlify deploy --prod
```

3. Optional (recommended): set `NEWSAPI_KEY` in Netlify environment variables to avoid sending key in query params.
4. For best Reddit reliability in production, set `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` (without them, app uses public fallback mode which may be blocked by Reddit).

## Files

- `pilot.html` - Main integrated dashboard (all sources)
- `payer_policy_watch.html` - Separate payer policy change monitoring dashboard
- `linkedin_dashboard.html` - LinkedIn-only dashboard
- `app.py` - Flask server with API proxies
- `netlify/functions/` - Netlify serverless functions (for deployment)
- `netlify.toml` - Build + `/api/*` redirect rules for Netlify functions

## API Keys

- **Apify**: [console.apify.com](https://console.apify.com) (LinkedIn, Twitter)
- **YouTube**: [console.cloud.google.com](https://console.cloud.google.com)
- **NewsAPI**: [newsapi.org](https://newsapi.org)
- **Reddit**: No key needed (public API)
# PediFormPro
