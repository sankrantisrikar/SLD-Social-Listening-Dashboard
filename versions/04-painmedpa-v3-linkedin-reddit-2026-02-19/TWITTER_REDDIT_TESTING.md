# Reddit Testing Guide

## Authentication Requirements ✅

**Good news!** Reddit now uses a completely free public JSON API:

- ✅ **Reddit**: FREE - No authentication, no Apify token needed!
- ✅ **LinkedIn**: Working (requires li_at cookie + Apify token)

---

## Current Configuration

### Reddit Data Source
- **API**: Reddit's public JSON API (`https://www.reddit.com/search.json`)
- **Authentication**: None required
- **Cost**: FREE
- **Features**:
  - Search all of Reddit
  - Community-specific search (subreddit filtering)
  - Sort by: Hot, New, Top, Relevance
  - Time filters: 24h, Week, Month, Year, All Time
  - No rate limits for reasonable use

---

## Testing Steps

### 1. Test Reddit (FREE!)

**Configuration:**
```
Platforms: ✓ Reddit
Keywords:
  prior authorization pain management
  interventional pain billing
Max Items: 50
```

**Reddit Options:**
- Sort by: Hot
- Time range: Past Week
- Subreddits: medicine, healthcare (optional)

**Expected Results:**
- 50 Reddit posts about pain management
- From relevant subreddits
- Post titles, content, upvotes, comments
- Subreddit names included

**Cost**: FREE!

---

### 2. Test Both Platforms

**Configuration:**
```
Apify Token: [Your token]
Platforms: ✓ LinkedIn ✓ Reddit
Keywords:
  prior authorization pain management
Max Items: 25 per platform
```

**Expected Results:**
- 50 total posts (25 from each platform)
- Mixed content from both sources
- Platform badges showing source
- All filters work correctly

**Cost Estimate:**
- LinkedIn: ~$0.50
- Reddit: FREE
- **Total: ~$0.50**

---

## What to Check

### ✅ Data Quality
- [ ] Posts are relevant to keywords
- [ ] Author names are present
- [ ] Engagement metrics (likes, comments) are populated
- [ ] URLs are valid and clickable
- [ ] Dates are recent (within selected time range)
- [ ] Platform badges show correct platform

### ✅ Functionality
- [ ] Platform filter works (show only LinkedIn, only Reddit, etc.)
- [ ] Topic filter works
- [ ] Date range filter works
- [ ] Sorting by engagement works
- [ ] Bookmark feature works for both platforms
- [ ] Save influencer works for both platforms
- [ ] Trending keywords includes both platforms

### ✅ Performance
- [ ] Loading completes within reasonable time
- [ ] No errors in browser console
- [ ] Cache works (24-hour expiry)
- [ ] Demo mode still works with 2 platforms

---

## Troubleshooting

### Reddit Issues

**Problem**: No posts returned
- **Check**: Keywords might be too specific
- **Solution**: Try broader terms like "pain management" or "prior authorization"

**Problem**: Subreddit filter not working
- **Check**: Subreddit names must be exact (no r/ prefix)
- **Solution**: Use comma-separated list: `medicine, healthcare, medicalbilling`

**Problem**: Getting old posts
- **Check**: Time range filter
- **Solution**: Set to "Past Week" or "Past Month" for recent content

### General Issues

**Problem**: "API Error" message
- **Possible causes**:
  - Invalid Apify token
  - Insufficient credits
  - Actor temporarily unavailable
- **Solution**: 
  - Verify token in Apify console
  - Check credit balance
  - Try again in a few minutes

**Problem**: Slow loading
- **Solution**: Reduce max items to 10-20 for testing

---

## Expected Data Structure

### Reddit Post
```javascript
{
  date: "2025-02-08T15:20:00.000Z",
  author: "reddit_user_123",
  authorUrl: "https://reddit.com/user/reddit_user_123",
  content: "Question about prior authorization: Has anyone...",
  platform: "reddit",
  likes: 156,
  comments: 34,
  shares: 0,
  url: "https://reddit.com/r/medicine/comments/abc123",
  topic: "prior authorization pain management",
  subreddit: "medicine"
}
```

---

## Cost Breakdown

### Reddit Pricing
- **Cost**: FREE (uses Reddit's public JSON API)
- **No authentication required**
- **No API token needed**
- **No rate limits for reasonable use**

### LinkedIn Pricing (existing)
- **~$1-2 per 100 posts**
- **Example**: 30 posts = ~$0.30-0.60

---

## Next Steps After Testing

1. ✅ **Verify Reddit works** - Check data quality and relevance
2. ✅ **Test both platforms together** - Ensure no conflicts
3. ✅ **Test filters** - Platform, topic, date range
4. ✅ **Test saved features** - Bookmarks, keywords, influencers
5. ✅ **Test trending keywords** - Should include both platforms
6. ✅ **Test demo mode** - Should show 50 posts (25+25)

---

## Success Criteria

Your dashboard is working correctly when:

- ✅ Both platforms fetch data successfully
- ✅ Data is relevant to keywords
- ✅ Platform badges show correctly
- ✅ Filters work for both platforms
- ✅ Saved features work across platforms
- ✅ No authentication errors for Reddit
- ✅ Costs are reasonable (Reddit is free!)
- ✅ Performance is acceptable

---

## Support Resources

### Reddit Public API
- **Documentation**: https://www.reddit.com/dev/api
- **Search endpoint**: `/search.json`
- **No authentication required**
- **Free to use**

### Apify Platform (for LinkedIn)
- **API Docs**: https://docs.apify.com/api/v2
- **Pricing**: Check your usage in Apify Console
- **Support**: Contact Apify support for actor-specific issues

---

## Quick Test Command

**Minimal test (fastest, free):**
```
Platforms: ✓ Reddit
Keywords: pain management
Max Items: 20
```

**Expected cost**: FREE
**Expected time**: 30 seconds
**Expected results**: 20 Reddit posts

**Full test (both platforms):**
```
Platforms: ✓ LinkedIn ✓ Reddit
Keywords: prior authorization pain management
Max Items: 25
```

**Expected cost**: ~$0.50 (LinkedIn only)
**Expected time**: 1-2 minutes
**Expected results**: 50 posts total (25 LinkedIn + 25 Reddit)

---

**Ready to test?** Start with the minimal test above, then scale up once you confirm everything works!
