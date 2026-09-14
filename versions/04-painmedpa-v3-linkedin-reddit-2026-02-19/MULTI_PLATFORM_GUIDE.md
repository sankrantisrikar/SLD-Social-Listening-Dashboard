# Multi-Platform Social Listening Dashboard Guide

## Overview

Your PainMed-PA dashboard now supports **two powerful data sources**:

1. **💼 LinkedIn** - Professional network discussions and insights
2. **🤖 Reddit** - Community discussions from relevant subreddits

---

## 🎭 Demo Mode - Try It First!

**New Feature**: Test the dashboard without any API calls or credentials!

Click the **"🎭 Try Demo Mode"** button to:
- Load 50 sample posts across both platforms
- See how the dashboard works with real-looking data
- Test all features (filters, charts, bookmarks, AI insights)
- No Apify token or LinkedIn cookie needed!

**Perfect for**:
- First-time users exploring the dashboard
- Testing before committing to API costs
- Demos and presentations
- Understanding the data structure

---

## Quick Start

### 1. Get Your Apify API Token

1. Sign up at [Apify.com](https://apify.com) (free $5 credit)
2. Go to Settings → Integrations
3. Copy your API token (starts with `apify_api_`)

### 2. Get LinkedIn Cookie (Optional)

Only needed if you want LinkedIn data. See `CREDENTIALS_GUIDE.md` for detailed instructions.

### 3. Select Your Platforms

Check the platforms you want to search:
- **LinkedIn**: Professional network (requires li_at cookie)
- **Reddit**: Community discussions (no auth needed)

### 4. Enter Keywords

Add your search terms (one per line):
```
prior authorization pain management
interventional pain billing
spinal cord stimulator denials
Medicare pain procedures
```

### 5. Configure Platform-Specific Options (Optional)

Each platform has optional filters to refine your search.

### 6. Click "Fetch Multi-Platform Data"

The dashboard will collect data from all selected platforms and display unified insights.

---

## Platform Details

### 🔗 LinkedIn (Professional Network)

**What it does**: Searches LinkedIn posts, articles, and professional discussions

**Use cases**:
- Monitor industry thought leaders
- Track professional discussions
- Identify potential B2B leads
- Find decision-makers discussing pain points

**Requirements**:
- **LinkedIn Cookie (li_at)**: Required for authentication
- See `CREDENTIALS_GUIDE.md` for how to get it

**Optional filters**:
- **Search Type**: Posts & Articles, People, or Companies

**Search tips**:
- Use professional terminology
- Target decision-maker pain points
- Look for "switching providers" signals
- Monitor competitor mentions

**Data returned**:
- Post content and author
- Engagement (likes, comments, shares)
- Post URL and timestamp
- Author profile link

**Cost**: ~$1-2 per 100 posts

---

### 🤖 Reddit (Community Discussions)

**What it does**: Searches Reddit posts and discussions using Reddit's free public JSON API

**Use cases**:
- Monitor community sentiment
- Find pain points and frustrations
- Identify trending topics
- Discover leads discussing switching providers

**Optional filters**:
- **Sort by**: Hot, New, Top, or Relevance
- **Time range**: Past 24 hours, week, month, year, or all time
- **Subreddits**: Comma-separated list (e.g., `medicine, healthcare`)

**Recommended subreddits**:
```
medicine
healthcare
medicalbilling
healthIT
physicians
nursing
ChronicPain
AskDocs
```

**Search tips**:
- Use specific terms: `prior authorization denied`
- Look for frustration: `insurance denied`, `appeal rejected`
- Find switchers: `looking for new`, `switching providers`

**Data returned**:
- Post title and content
- Author and subreddit
- Upvotes and comment count
- Post URL and timestamp

**Cost**: FREE (uses Reddit's public JSON API)

---

## Cost Estimates

### Per Search (50 items per platform):
- **LinkedIn only**: ~$1.00
- **Reddit only**: FREE
- **Both platforms**: ~$1.00

### Monthly Estimates (4 searches/week, 50 items each):
- **LinkedIn only**: ~$16/month
- **Reddit only**: FREE
- **Both platforms**: ~$16/month

### Large Scale (500 items per platform):
- **Both platforms**: ~$10.00 per search (LinkedIn only)
- **Weekly searches**: ~$40/month
- **Daily searches**: ~$300/month

**💡 Tip**: Start with 30-50 items per platform to test, then scale up as needed. Use Demo Mode to test the dashboard for free! Reddit is completely free with no API costs.

---

## Platform Combinations

### Best for Lead Generation:
- ✅ LinkedIn + Reddit (find professionals discussing problems)
- ✅ LinkedIn only (B2B decision-makers)

### Best for Market Research:
- ✅ Both platforms (comprehensive view)
- ✅ Reddit only (public sentiment, completely free)

### Most Cost-Effective:
- ✅ Reddit only (FREE!)
- ✅ Demo Mode (free!)

---

## Dashboard Features

### Multi-Platform Filtering

Filter your data by:
- **Platform**: View all platforms or filter to specific ones
- **Topics**: Select which keywords to analyze
- **Date range**: Focus on specific time periods

### Unified Analytics

All platforms feed into the same analytics:
- **Weekly trends**: See mention volume over time
- **Sentiment analysis**: Track positive/negative discussions
- **Engagement metrics**: Identify high-impact content
- **AI insights**: Automated trend detection
- **Lead scoring**: Identify sales opportunities

### Platform Badges

Each post shows its source platform with a colored badge:
- 💼 **LinkedIn** (Blue) - Professional network
- 🤖 **Reddit** (Orange) - Community discussions

### Bookmarks & Collections

Save important posts across all platforms:
- Star posts for later review
- Organize into collections (Sales Leads, Case Studies, etc.)
- Add notes to saved posts
- Export to CSV

---

## Best Practices

### Keyword Strategy

**Good keywords** (specific, actionable):
```
prior authorization pain management
interventional pain billing denials
spinal cord stimulator insurance
Medicare pain procedure appeals
```

**Poor keywords** (too broad):
```
pain
healthcare
insurance
billing
```

### Platform Combinations

**For lead generation**:
- ✅ LinkedIn + Reddit (find people discussing problems)
- ✅ LinkedIn only (B2B decision-makers)

**For market research**:
- ✅ Both platforms (comprehensive view)
- ✅ Reddit only (public sentiment, free)

### Performance Tips

1. **Start small**: Use 30-50 items per platform for testing
2. **Fewer keywords**: 3-5 keywords = faster results
3. **Cache data**: Results are cached for 24 hours
4. **Batch searches**: Run multiple keywords in one search

---

## Troubleshooting

### "No data found"

**Possible causes**:
- Keywords too specific
- No recent activity matching keywords
- Platform temporarily unavailable

**Solutions**:
- Try broader keywords
- Expand date range
- Try different platforms

### "API Error"

**Possible causes**:
- Invalid API token
- Insufficient Apify credits
- Rate limiting

**Solutions**:
- Check your API token
- Add credits to Apify account
- Wait a few minutes and try again

### Slow performance

**Possible causes**:
- Too many items requested
- Multiple platforms selected
- Many keywords

**Solutions**:
- Reduce max items to 30-50
- Search one platform at a time
- Use 3-5 keywords instead of 10+

---

## Advanced Features

### Reddit Subreddit Targeting

Focus on specific communities:
```
Keywords: prior authorization denied
Subreddits: medicine, healthcare
Sort: Top
Time: Past Week
```

Result: Top posts about PA denials in medical subreddits this week

---

## Data Export

### CSV Export

Export all data with platform information:
- Platform column shows source (LinkedIn/Reddit)
- All engagement metrics included
- Timestamps and URLs preserved

### Bookmark Export

Export saved posts across platforms:
- Includes platform, collection, and notes
- Perfect for sharing with team
- Import into CRM or spreadsheet

---

## Privacy & Compliance

### Data Sources

- **LinkedIn**: Professional network (requires authentication)
- **Reddit**: Public posts only (no authentication required, uses free public API)

### Authentication

- **LinkedIn**: Requires li_at cookie (see CREDENTIALS_GUIDE.md)
- **Reddit**: No authentication required (uses free public JSON API)

Just your Apify API token for LinkedIn!

### Data Retention

- Data cached locally for 24 hours
- Clear cache anytime
- No data sent to external servers (except Apify)

---

## Support

### Need Help?

1. Check this guide first
2. Review the [Apify documentation](https://docs.apify.com)
3. Contact support with specific error messages

### Feature Requests

Have ideas for improvements? Let us know!

---

## Changelog

### v3.3 - Focused on 2 Platforms
- ✅ Removed Twitter/X integration (focusing on LinkedIn + Reddit)
- ✅ LinkedIn (working properly with Apify)
- ✅ Reddit (FREE - uses public JSON API, no authentication)
- ✅ Demo Mode with 50 sample posts across 2 platforms
- ✅ Streamlined platform selection
- ✅ Reduced costs (Reddit is now free!)

### v3.2 - Focused on 3 Platforms
- ✅ Removed NPI/NPPES integration (focusing on social platforms)
- ✅ LinkedIn (working properly)
- ✅ Twitter/X integration
- ✅ Reddit integration
- ✅ Demo Mode with 50 sample posts across 3 platforms
- ✅ Streamlined platform selection

### v3.1 - LinkedIn Integration + Demo Mode
- ✅ Added LinkedIn professional network search
- ✅ **NEW: Demo Mode** - Test dashboard without API calls
- ✅ LinkedIn-specific authentication (li_at cookie)
- ✅ Updated platform badges and filters

### v3.0 - Multi-Platform Release
- ✅ Added Twitter/X social media search
- ✅ Added Reddit community search
- ✅ Platform-specific filters and options
- ✅ Unified analytics across all platforms
- ✅ Platform badges in posts table
- ✅ Multi-platform filtering

---

**Ready to get started?** Try **Demo Mode** first, then configure your platforms and start exploring multi-platform intelligence!
