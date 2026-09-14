# LinkedIn Social Listening Dashboard

A real-time analytics dashboard for tracking LinkedIn conversations about pain management, healthcare billing, and medical procedures.

## Features

- 📊 **Real-time LinkedIn Data**: Fetch posts directly from LinkedIn using Apify
- 📈 **Weekly Trend Analysis**: Track mention volume over time by topic
- 😊 **Sentiment Analysis**: Monitor positive, neutral, and negative conversation trends
- 💼 **Payer Insights**: Track mentions of Medicare, UnitedHealth, Cigna, Aetna, etc.
- 🏥 **Procedure Tracking**: Monitor discussions about SCS, SI Joint Fusion, Kyphoplasty, etc.
- 🔍 **Advanced Filtering**: Filter by platform, topics, and date ranges
- 💾 **Smart Caching**: 24-hour cache to avoid repeated API calls

## Quick Start

### Deploy to Netlify

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Click "Deploy site" (settings are auto-detected from netlify.toml)

3. **Configure Credentials**:
   - Open your deployed site
   - Enter your Apify API token
   - Enter your LinkedIn session cookie (li_at)
   - Add search keywords
   - Click "Fetch LinkedIn Data"

### Local Development

Simply open `pilot.html` in your browser. No build process required!

## Getting Credentials

### Apify API Token
1. Sign up at [apify.com](https://apify.com)
2. Go to Settings → Integrations
3. Copy your API token

### LinkedIn Cookie (li_at)
1. Log in to [linkedin.com](https://linkedin.com)
2. Press F12 to open Developer Tools
3. Go to Application → Cookies → https://www.linkedin.com
4. Find and copy the `li_at` cookie value

## Performance Tips

- Use 3-5 keywords for best speed
- Start with 30-50 posts (30-60 seconds)
- 100+ posts take 1-2 minutes
- Data is cached for 24 hours

## Files

- `pilot.html` - Main dashboard (self-contained)
- `netlify.toml` - Netlify deployment configuration
- `package.json` - Project metadata
- `.gitignore` - Git ignore rules

## Tech Stack

- Pure HTML/CSS/JavaScript (no build process)
- Chart.js for visualizations
- Apify for LinkedIn data scraping
- Netlify for hosting

## License

MIT
