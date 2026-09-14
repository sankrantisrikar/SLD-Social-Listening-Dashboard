# API Setup Guide

Complete guide for configuring real data sources for the Pain Management Social Intelligence Platform.

## Quick Start

1. Open `index.html` in your browser
2. Click "🔑 Configure APIs" button in the header
3. Add API keys for the platforms you want to monitor
4. Select platforms and start monitoring

---

## Platform Setup Instructions

### 1. LinkedIn (via Apify) ⭐ RECOMMENDED

**What you get:** Posts, comments, author profiles, engagement metrics

**Setup Steps:**

1. **Create Apify Account**
   - Go to: https://console.apify.com/sign-up
   - Free tier: 5,000 credits/month (enough for ~100 LinkedIn posts)

2. **Get API Token**
   - Navigate to: https://console.apify.com/account/integrations
   - Click "Create new token"
   - Copy the token (starts with `apify_api_...`)

3. **Add to Platform**
   - Click "Configure APIs" in the dashboard
   - Paste token in "LinkedIn (Apify)" field
   - Click "Save Configuration"

**Cost:** Free tier available, paid plans start at $49/month

**Data Quality:** ⭐⭐⭐⭐⭐ (Highest quality, professional discussions)

---

### 2. YouTube

**What you get:** Educational videos, comments, channel info

**Setup Steps:**

1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com/
   - Create new project or select existing

2. **Enable YouTube Data API v3**
   - Navigate to: APIs & Services > Library
   - Search "YouTube Data API v3"
   - Click "Enable"

3. **Create API Key**
   - Go to: APIs & Services > Credentials
   - Click "Create Credentials" > "API Key"
   - Copy the key

4. **Add to Platform**
   - Click "Configure APIs" in the dashboard
   - Paste key in "YouTube" field
   - Click "Save Configuration"

**Cost:** Free (10,000 quota units/day = ~100 searches)

**Data Quality:** ⭐⭐⭐⭐ (Educational content, expert opinions)

---

### 3. Twitter/X

**What you get:** Real-time tweets, engagement metrics, author info

**Setup Steps:**

1. **Apply for Developer Account**
   - Go to: https://developer.twitter.com/en/portal/petition/essential/basic-info
   - Fill out application (usually approved in 1-2 days)

2. **Create Project & App**
   - Navigate to: https://developer.twitter.com/en/portal/dashboard
   - Create new project
   - Create new app within project

3. **Get Bearer Token**
   - In your app settings, go to "Keys and tokens"
   - Generate "Bearer Token"
   - Copy the token

4. **Add to Platform**
   - Click "Configure APIs" in the dashboard
   - Paste token in "Twitter/X" field
   - Click "Save Configuration"

**Cost:** 
- Free tier: 500,000 tweets/month (read-only)
- Basic: $100/month for 10M tweets

**Data Quality:** ⭐⭐⭐⭐ (Real-time, high velocity)

**Note:** Twitter API approval can take 1-2 business days

---

### 4. Reddit

**What you get:** Community discussions, upvotes, comments

**Setup Steps:**

**Option A: No Authentication (Recommended for Testing)**
- Reddit public data works without API keys
- Just select Reddit platform and it will work
- Rate limited to ~60 requests/hour

**Option B: With Authentication (Higher Limits)**

1. **Create Reddit App**
   - Go to: https://www.reddit.com/prefs/apps
   - Scroll to bottom, click "create another app"
   - Select "script" type
   - Fill in name and redirect URI (use http://localhost)

2. **Get Credentials**
   - Copy "Client ID" (under app name)
   - Copy "Client Secret"

3. **Add to Platform**
   - Click "Configure APIs" in the dashboard
   - Paste credentials in "Reddit" fields
   - Click "Save Configuration"

**Cost:** Free

**Data Quality:** ⭐⭐⭐ (Community insights, patient perspectives)

---

### 5. News/Policy

**What you get:** News articles, policy announcements, regulatory changes

**Setup Steps:**

1. **Create NewsAPI Account**
   - Go to: https://newsapi.org/register
   - Free tier: 100 requests/day

2. **Get API Key**
   - After registration, copy your API key from dashboard

3. **Add to Platform**
   - Click "Configure APIs" in the dashboard
   - Paste key in "News API" field
   - Click "Save Configuration"

**Cost:** 
- Free: 100 requests/day
- Paid: $449/month for commercial use

**Data Quality:** ⭐⭐⭐⭐ (Official sources, policy changes)

---

## Recommended Setup for Different Use Cases

### For Testing (Free)
```
✓ Reddit (no auth needed)
✓ YouTube (free tier)
✓ News API (100 requests/day)
```

### For Small Practice ($0-50/month)
```
✓ LinkedIn via Apify (free tier or $49/month)
✓ YouTube (free)
✓ Reddit (free)
```

### For RCM Company ($100-150/month)
```
✓ LinkedIn via Apify ($49/month)
✓ Twitter/X ($100/month)
✓ YouTube (free)
✓ Reddit (free)
✓ News API (free tier)
```

### For Enterprise ($500+/month)
```
✓ LinkedIn via Apify (higher tier)
✓ Twitter/X ($100/month)
✓ YouTube (free)
✓ Reddit (free)
✓ News API ($449/month commercial)
✓ Custom data sources
```

---

## Troubleshooting

### "Failed to fetch data" Error

**LinkedIn (Apify):**
- Verify token is correct (starts with `apify_api_`)
- Check Apify account has available credits
- Wait 30-60 seconds for actor to complete

**YouTube:**
- Verify API is enabled in Google Cloud Console
- Check daily quota hasn't been exceeded
- Ensure API key restrictions allow YouTube Data API

**Twitter:**
- Verify bearer token is correct
- Check app has "Read" permissions
- Ensure you're on approved developer account

**Reddit:**
- No auth needed for basic usage
- If using auth, verify client ID and secret
- Check rate limits (60 requests/hour without auth)

**News API:**
- Verify API key is correct
- Check daily request limit (100 for free tier)
- Ensure queries are properly formatted

### "Rate Limit Exceeded"

- **YouTube:** Wait until next day (quota resets daily)
- **Twitter:** Upgrade to higher tier or wait for reset
- **Reddit:** Add authentication for higher limits
- **News API:** Upgrade to paid plan

### "No Data Returned"

- Check date range (last 8 weeks)
- Verify search keywords are relevant
- Try different platform combinations
- Check platform status pages

---

## Data Privacy & Compliance

### What Data is Collected?

**Public Data Only:**
- ✓ Public posts and comments
- ✓ Public profile information
- ✓ Engagement metrics (likes, shares)
- ✗ Private messages
- ✗ Protected accounts
- ✗ Personal health information (PHI)

### Storage

- API keys stored in browser localStorage (your computer only)
- No data sent to external servers
- All processing happens in your browser

### Compliance

- **HIPAA:** No PHI collected ✓
- **GDPR:** Public data only ✓
- **Platform ToS:** Compliant with all platform terms ✓

---

## Performance Tips

### Optimize Data Fetching

1. **Start with one platform** to test configuration
2. **Use Reddit first** (no auth needed, fast)
3. **Add LinkedIn last** (slowest, 30-60 seconds)

### Reduce API Costs

1. **Cache data locally** (browser storage)
2. **Fetch weekly** instead of daily
3. **Use free tiers** for testing
4. **Combine platforms** strategically

### Improve Data Quality

1. **Refine search keywords** for your specialty
2. **Monitor multiple platforms** for comprehensive view
3. **Check data weekly** for trends
4. **Validate insights** with multiple sources

---

## Next Steps

1. ✓ Configure at least one API key
2. ✓ Select platform(s) to monitor
3. ✓ Review dashboard and CEO summary
4. ✓ Ask questions in AI chat
5. ✓ Set up weekly monitoring routine

---

## Support

### Documentation
- `README.md` - Product overview
- `ARCHITECTURE.md` - Technical details
- `DEPLOYMENT.md` - Hosting guide

### Platform Documentation
- Apify: https://docs.apify.com/
- YouTube: https://developers.google.com/youtube/v3
- Twitter: https://developer.twitter.com/en/docs
- Reddit: https://www.reddit.com/dev/api
- NewsAPI: https://newsapi.org/docs

### Common Issues
- Check browser console for errors (F12)
- Verify API keys are saved (check localStorage)
- Test with Reddit first (no auth needed)
- Clear browser cache if issues persist

---

**Ready to start?** Click "Configure APIs" in the dashboard and add your first API key!
