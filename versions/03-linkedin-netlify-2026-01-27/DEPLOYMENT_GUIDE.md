# Netlify Deployment Guide

## Method 1: Deploy via Git (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your repository
5. Build settings:
   - **Build command:** Leave empty (or use: `echo 'Static site'`)
   - **Publish directory:** `.` (current directory)
6. Click "Deploy site"

### Step 3: Your Site is Live!
- Netlify will provide a URL like: `https://random-name-123.netlify.app`
- You can customize this in Site settings → Domain management

## Method 2: Drag & Drop Deploy

### Step 1: Prepare Files
Make sure you have these files in a folder:
- `index.html`
- `styles.css`
- `app.js`
- `netlify.toml`

### Step 2: Deploy
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your folder
3. Wait for deployment to complete
4. Your site is live!

## Method 3: Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Deploy
```bash
# Deploy to a draft URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Custom Domain (Optional)

1. Go to your site in Netlify dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure DNS

## Environment Variables (If Needed)

If you want to pre-configure API tokens:

1. Go to Site settings → Environment variables
2. Add variables:
   - `APIFY_TOKEN` (optional)
3. Update `app.js` to read from environment if available

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy when you push to main branch
- Create preview deployments for pull requests
- Run builds on every commit

## Monitoring

- View deployment logs in Netlify dashboard
- Check analytics under Site analytics
- Monitor function usage (if you add serverless functions)

## Troubleshooting

### Site not loading
- Check that `index.html` is in the root directory
- Verify `netlify.toml` publish directory is set to `.`

### JavaScript not working
- Check browser console for errors
- Verify all file paths are relative (no leading `/`)

### CORS errors
- This shouldn't happen as all API calls go directly to Apify
- If issues persist, check browser console

## Next Steps

After deployment:
1. Test the demo mode
2. Add your Apify credentials
3. Try a search with your keywords
4. Share the URL with your team!

## Support

- Netlify Docs: [https://docs.netlify.com](https://docs.netlify.com)
- Netlify Community: [https://answers.netlify.com](https://answers.netlify.com)
