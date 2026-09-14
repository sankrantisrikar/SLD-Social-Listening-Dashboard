# LinkedIn Analytics Dashboard - Features

## 🎯 Current Features

### 1. **Configuration Panel**
- Apify API Token input
- LinkedIn Cookie (li_at) input
- Search Type selector (Posts/People/Companies)
- Max Posts limit (5-500)
- Multi-line keyword input (each keyword = one topic)

### 2. **Data Fetching**
- Real-time LinkedIn data fetching via Apify API
- Automatic topic mapping based on keywords
- Progress tracking during data fetch
- Error handling with detailed messages

### 3. **Filters**
- **Platform Filter**: LinkedIn (expandable for future platforms)
- **Topic Filter**: Dropdown with all topics from your keywords
- **Date Range**: Start and End date pickers
- Apply/Reset filter buttons
- Back to Config option to refetch data

### 4. **Key Metrics Dashboard**
- Total Mentions (filtered count)
- Unique Authors
- Total Engagement (likes + comments + shares)
- This Week's Mentions

### 5. **Combined Weekly Chart**
- Line chart showing all topics together
- Color-coded by topic
- Interactive tooltips
- Show/Hide toggle button
- Week-by-week breakdown

### 6. **Individual Topic Charts** ⭐ NEW
Each topic gets its own dedicated chart showing:
- **Bar chart** with weekly mentions
- **Topic-specific metrics**:
  - Total mentions for that topic
  - Total engagement for that topic
  - Average engagement per post
- **Color-coded** for easy identification
- **Separate analysis** for each keyword/topic

### 7. **Posts Table**
- Date, Author, Topic, Content preview
- Engagement metrics (likes, comments, shares)
- Clickable author links to LinkedIn profiles
- Sorted by date (newest first)
- Limited to top 50 posts for performance

## 📊 Chart Types

### Combined Chart (Line Chart)
- Shows trends across all topics
- Good for comparing topics side-by-side
- Can be hidden to focus on individual topics

### Individual Topic Charts (Bar Charts)
- One chart per topic/keyword
- Shows weekly distribution
- Includes topic-specific stats
- Better for deep-dive analysis

## 🔄 Workflow

```
1. Enter Credentials → 2. Add Keywords → 3. Fetch Data
                                              ↓
4. View Combined Chart ← 5. Apply Filters ← Data Loaded
                                              ↓
6. Analyze Individual Topic Charts → 7. Review Posts Table
```

## 💡 Use Cases

### Marketing Analysis
- Track mention trends for different products/services
- Compare engagement across topics
- Identify peak activity weeks

### Competitive Intelligence
- Monitor competitor mentions
- Track industry keywords
- Analyze sentiment and engagement

### Content Strategy
- Identify trending topics
- Find best posting times
- Discover influential authors

### Healthcare/Pain Management (Current Setup)
- Prior authorization discussions
- Billing and RCM trends
- Medical device mentions (SCS, etc.)
- Medicare/insurance policy changes

## 🎨 Visual Design

- Clean, modern interface
- LinkedIn blue color scheme
- Responsive layout
- Interactive charts with Chart.js
- Hover effects and tooltips
- Professional metrics cards

## 🚀 Access

**Server URL**: http://localhost:8000/
**Start Server**: `python3 server.py`
**Stop Server**: `Ctrl+C`
