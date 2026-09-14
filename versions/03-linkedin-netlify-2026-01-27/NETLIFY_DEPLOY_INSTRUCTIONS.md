# Deploy LinkedIn Dashboard to Netlify

## 🚀 Quick Deploy Options

### Option 1: Netlify CLI (Recommended)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```

#### Step 3: Deploy
```bash
# Deploy to a new site
netlify deploy --dir=. --prod

# Or if you want to test first
netlify deploy --dir=.
```

The CLI will:
- Create a new site on Netlify
- Upload your files
- Give you a live URL

---

### Option 2: Netlify Web UI (Drag & Drop)

#### Step 1: Prepare Files
Create a deployment folder with only the necessary files:

**Required Files:**
- `linkedin-dashboard-filtered.html` (main dashboard)
- `netlify-dashboard.toml` (configuration)

#### Step 2: Deploy
1. Go to https://app.netlify.com/drop
2. Drag and drop your folder
3. Wait for deployment
4. Get your live URL!

---

### Option 3: GitHub + Netlify (Continuous Deployment)

#### Step 1: Push to GitHub
```bash
git init
git add linkedin-dashboard-filtered.html netlify-dashboard.toml
git commit -m "Add LinkedIn dashboard"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Connect to Netlify
1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Choose GitHub
4. Select your repository
5. Build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `.`
   - **Config file:** `netlify-dashboard.toml`
6. Click "Deploy site"

---

## 📋 Files to Deploy

### Minimal Deployment (Recommended)
```
linkedin-dashboard-filtered.html
netlify-dashboard.toml
```

### Full Deployment (Optional)
```
linkedin-dashboard-filtered.html
netlify-dashboard.toml
README.md
DASHBOARD_USAGE.md
```

---

## ⚙️ Configuration Details

The `netlify-dashboard.toml` file includes:

- **Root redirect**: `/` → `/linkedin-dashboard-filtered.html`
- **404 handling**: All unknown routes → dashboard
- **CORS headers**: Allows API calls from the dashboard
- **Security headers**: X-Frame-Options, Content-Type protection

---

## 🔧 Post-Deployment Setup

### 1. Update API Credentials
After deployment, users need to:
- Enter their Apify API token
- Enter their LinkedIn cookie (li_at)
- Add search keywords

### 2. Test the Dashboard
1. Visit your Netlify URL
2. Enter credentials
3. Click "Fetch LinkedIn Data"
4. Verify data loads correctly

### 3. Custom Domain (Optional)
1. Go to Netlify dashboard
2. Click "Domain settings"
3. Add custom domain
4. Update DNS records

---

## 🎯 Quick Deploy Command

```bash
# One-line deploy
netlify deploy --dir=. --prod --site=linkedin-dashboard
```

---

## 📊 What Gets Deployed

### The Dashboard Includes:
- ✅ Multi-topic selection (checkboxes)
- ✅ Weekly mentions chart
- ✅ Date range filters
- ✅ Smart caching (24 hours)
- ✅ Posts table with LinkedIn links
- ✅ Key metrics cards
- ✅ Responsive design

### Features:
- 📊 Real-time LinkedIn data via Apify API
- 💾 Browser-based caching
- 🔍 Advanced filtering
- 📈 Interactive charts
- 🔗 Direct links to LinkedIn posts

---

## 🔒 Security Notes

### What's Safe:
- ✅ All API calls happen from user's browser
- ✅ No credentials stored on server
- ✅ Cache is browser-local only
- ✅ HTTPS by default on Netlify

### User Responsibilities:
- 🔑 Keep Apify API token secure
- 🔑 Keep LinkedIn cookie private
- 🔄 Refresh cookie when expired

---

## 🐛 Troubleshooting

### Issue: Dashboard doesn't load
**Solution:** Check that `linkedin-dashboard-filtered.html` is in the root directory

### Issue: API calls fail
**Solution:** 
- Verify Apify token is correct
- Check LinkedIn cookie hasn't expired
- Ensure CORS headers are set in netlify-dashboard.toml

### Issue: Cache not working
**Solution:** 
- Check browser localStorage is enabled
- Try clearing browser cache
- Verify not in incognito mode

---

## 📱 Mobile Support

The dashboard is responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

---

## 🎉 Success!

Once deployed, share your dashboard URL:
```
https://your-site-name.netlify.app
```

Users can:
1. Visit the URL
2. Enter their credentials
3. Fetch LinkedIn data
4. Analyze trends and mentions
5. Filter by topics and dates

---

## 💡 Tips

1. **Custom Site Name**: Use `netlify deploy --site=my-custom-name`
2. **Environment Variables**: Not needed - all config is client-side
3. **Updates**: Just run `netlify deploy --prod` again
4. **Rollback**: Use Netlify dashboard to rollback to previous deploy

---

## 📞 Support

- Netlify Docs: https://docs.netlify.com/
- Netlify Support: https://www.netlify.com/support/
- Dashboard Issues: Check browser console for errors
