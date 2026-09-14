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

## Files

- `pilot.html` - Main integrated dashboard (all sources)
- `linkedin_dashboard.html` - LinkedIn-only dashboard
- `app.py` - Flask server with API proxies
- `netlify/functions/` - Netlify serverless functions (for deployment)

## API Keys

- **Apify**: [console.apify.com](https://console.apify.com) (LinkedIn, Twitter)
- **YouTube**: [console.cloud.google.com](https://console.cloud.google.com)
- **NewsAPI**: [newsapi.org](https://newsapi.org)
- **Reddit**: No key needed (public API)
