# LinkedIn Analytics Dashboard - Usage Guide

## 🚀 Quick Start

### 1. Start the Server
```bash
python3 server.py
```

The server will start on **http://localhost:8000**

### 2. Access the Dashboard
Open your browser and navigate to:
- **Main Dashboard:** http://localhost:8000/

## 📊 Dashboard Features

### Configuration Panel
1. **Apify API Token** - Your Apify API token (get from https://console.apify.com/account/integrations)
2. **LinkedIn Cookie (li_at)** - Your LinkedIn session cookie
3. **Search Type** - Choose between Posts & Articles, People, or Companies
4. **Max Posts** - Maximum number of posts to fetch (5-500)
5. **Search Keywords** - Enter keywords (one per line) - these become your topic filters

### How It Works
1. Enter your credentials and keywords
2. Click "🚀 Fetch LinkedIn Data"
3. Wait for the data to be fetched from LinkedIn (may take 1-5 minutes)
4. Once loaded, use the filters to analyze your data:
   - **Platform Filter** - Currently LinkedIn only
   - **Topic/Keyword Filter** - Filter by specific keywords you searched
   - **Date Range** - Filter by start and end date

### Dashboard Views
- **Key Metrics** - Total mentions, unique authors, engagement, weekly trends
- **Weekly Mentions Chart** - Line chart showing mentions over time by topic
- **Posts Table** - Detailed view of all posts with engagement metrics

## 🔄 Workflow

1. **Fetch Data** → Enter credentials and keywords → Click "Fetch LinkedIn Data"
2. **Wait** → The system searches LinkedIn and processes results
3. **Filter** → Use topic and date filters to narrow down results
4. **Analyze** → View weekly trends and engagement metrics
5. **Refetch** → Click "Back to Config" to fetch new data with different keywords

## 📝 Notes

- Keywords you enter become the topic categories in the dashboard
- The system automatically maps posts to topics based on keyword matching
- Date range defaults to last 90 days to capture more historical data
- All data is fetched fresh from LinkedIn each time you click "Fetch LinkedIn Data"

## 🛑 Stop the Server

Press `Ctrl+C` in the terminal where the server is running
