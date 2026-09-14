# Deployment Guide

## Files in This Project

- `pilot.html` - Main dashboard (self-contained, no dependencies)
- `netlify.toml` - Netlify configuration
- `package.json` - Project metadata
- `README.md` - Documentation
- `.gitignore` - Git ignore rules

## Deploy to Netlify

### Option 1: Git-based Deploy (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Click "Deploy site" (settings auto-detected)

3. **Your site is live!** 🎉

### Option 2: Drag & Drop Deploy

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder
3. Done! Your site is live

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## After Deployment

1. Open your deployed site URL
2. Enter your Apify API token
3. Enter your LinkedIn cookie (li_at)
4. Add search keywords
5. Click "Fetch LinkedIn Data"

## Performance

- First load: 30-60 seconds for 50 posts
- Subsequent loads: Instant (24-hour cache)
- 100+ posts: 1-2 minutes

## Support

For issues, check the browser console (F12) for error messages.
