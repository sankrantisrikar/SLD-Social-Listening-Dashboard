# Dashboard Caching System

## 🎯 Overview

The dashboard now includes a smart caching system that stores fetched LinkedIn data in your browser's local storage. This prevents unnecessary API calls and speeds up dashboard loading.

## ⚡ How It Works

### 1. **First Time Use**
- Enter credentials and keywords
- Click "Fetch LinkedIn Data"
- Data is fetched from LinkedIn via Apify API
- Data is automatically cached in browser (24-hour expiry)

### 2. **Subsequent Visits**
- Dashboard automatically loads cached data
- No API call needed
- Instant dashboard display
- Cache status shown in config panel

### 3. **Cache Expiry**
- Cache expires after 24 hours
- Automatically cleared when expired
- You'll need to fetch fresh data

## 🔄 Cache Management

### Auto-Load
- When you open the dashboard, it checks for cached data
- If valid cache exists, dashboard loads immediately
- Shows: "X posts cached. Expires in Y hours."

### Manual Clear
- Click "Clear Cache" button in config panel
- Or click "Back to Config" and confirm clear
- Forces fresh data fetch on next load

### Cache Storage
- Stored in browser's localStorage
- Persists across browser sessions
- Specific to your browser/device
- Not shared across devices

## 📊 What's Cached

### Data Stored:
- All fetched LinkedIn posts
- Post metadata (author, date, content, engagement)
- Search keywords used (for topic mapping)
- Timestamp of cache creation

### Not Stored:
- API credentials (for security)
- Temporary filter selections
- Chart states

## 🎨 Topic Mapping

### How Topics Work:
1. **Keywords = Topics**: Each keyword you enter becomes a topic
2. **Post Assignment**: Posts are mapped to topics based on:
   - Content matching (if keyword appears in post text)
   - Search URL that found the post
   - Round-robin assignment as fallback

### Example:
```
Keywords entered:
- prior authorization
- pain management billing
- Medicare procedures

Dashboard shows 3 topics:
📊 prior authorization (15 posts)
📊 pain management billing (22 posts)
📊 Medicare procedures (18 posts)
```

## 💡 Benefits

### Performance
- ⚡ Instant dashboard loading
- 🚀 No API wait time
- 💰 Saves API costs

### Development/Testing
- 🧪 Test filters without refetching
- 🔄 Iterate on dashboard design
- 📊 Consistent data for testing

### User Experience
- ✅ Faster page loads
- 🎯 Work offline with cached data
- 🔒 Secure (credentials not cached)

## 🛠️ Technical Details

### Storage Keys:
- `linkedin_dashboard_cache` - Main data storage
- `linkedin_dashboard_cache_expiry` - Expiry timestamp

### Cache Duration:
- Default: 24 hours (86400000 ms)
- Configurable in code: `CACHE_DURATION` variable

### Size Limits:
- localStorage limit: ~5-10MB (browser dependent)
- Typical cache: 50-100 posts = ~100-500KB
- Well within limits for normal use

## 🔍 Debugging

### Check Cache in Browser Console:
```javascript
// View cached data
JSON.parse(localStorage.getItem('linkedin_dashboard_cache'))

// Check expiry
new Date(parseInt(localStorage.getItem('linkedin_dashboard_cache_expiry')))

// Clear cache manually
localStorage.removeItem('linkedin_dashboard_cache')
localStorage.removeItem('linkedin_dashboard_cache_expiry')
```

## ⚠️ Important Notes

1. **Browser-Specific**: Cache is per browser/device
2. **Incognito Mode**: Cache cleared when closing window
3. **Clear Browser Data**: Clears cache
4. **Different Keywords**: Fetching with new keywords overwrites cache
5. **Security**: Never cache API credentials or cookies
