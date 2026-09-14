# LinkedIn Pain Management Intelligence Dashboard

A web-based dashboard for analyzing LinkedIn posts and discussions related to pain management, prior authorization, and healthcare billing.

## Features

- 🔍 Keyword-based LinkedIn search
- 📊 Real-time data visualization
- 👥 Author and influencer tracking
- 💬 Post engagement analytics
- 📈 Executive summary insights

## Deployment to Netlify

### Quick Deploy

1. **Fork or clone this repository**

2. **Deploy to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Click "Deploy site"

3. **Configure your credentials:**
   - Open the deployed site
   - Enter your Apify API token
   - Enter your LinkedIn session cookie (li_at)
   - Add your search keywords
   - Click "Start Auto Search"

### Manual Deploy

You can also drag and drop the following files to Netlify:
- `index.html`
- `styles.css`
- `app.js`
- `netlify.toml`

## Getting Your Credentials

### Apify API Token
1. Sign up at [Apify](https://apify.com)
2. Go to [Settings → Integrations](https://console.apify.com/account/integrations)
3. Copy your API token

### LinkedIn Cookie (li_at)
1. Log in to [LinkedIn](https://linkedin.com)
2. Press F12 to open Developer Tools
3. Go to Application → Cookies → https://www.linkedin.com
4. Find and copy the value of `li_at` cookie

## Usage

1. Enter your Apify API token and LinkedIn cookie
2. Add keywords (one per line) to search for
3. Select search type (Posts, People, or Companies)
4. Set maximum posts to fetch
5. Click "Start Auto Search"

The dashboard will automatically search LinkedIn and display:
- Total posts and engagement metrics
- Top influencers and authors
- Detailed post listings with links
- Executive summary insights

## Demo Mode

Click "Use Demo Data" to explore the dashboard with sample data without needing credentials.

## Security Notes

- All credentials are stored locally in your browser
- No data is sent to any server except Apify's API
- The app runs entirely in your browser
- Clear your browser data to remove stored credentials

## Cost Considerations

Apify charges based on usage:
- Approximately $0.01-0.05 per post fetched
- Start with 50 posts to test
- Monitor your Apify usage at [console.apify.com](https://console.apify.com)

## Troubleshooting

**No results found:**
- Check that your LinkedIn cookie is valid (log in to LinkedIn again)
- Try different keywords
- Reduce the number of keywords

**Actor failed:**
- **MOST COMMON:** LinkedIn cookie expired → Get fresh cookie (see QUICK_FIX.md)
- Verify your Apify token is correct
- Check your Apify account has sufficient credits
- View detailed logs at Apify console
- **See TROUBLESHOOTING.md for detailed solutions**

**Timeout errors:**
- Reduce the number of keywords
- Lower the maximum posts setting
- Try again later

**Quick Fix Guide:** See `QUICK_FIX.md` for the fastest solution
**Detailed Guide:** See `TROUBLESHOOTING.md` for all error solutions

## License

MIT License - feel free to modify and use for your needs.
