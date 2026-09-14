# 🚀 Quick Start: Deploy to Netlify in 5 Minutes

## Fastest Method: Drag & Drop

### Step 1: Prepare Files (30 seconds)
Create a new folder and copy these 5 files into it:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `app.js`
- ✅ `netlify.toml`
- ✅ `_redirects`

### Step 2: Deploy (2 minutes)
1. Go to: **https://app.netlify.com/drop**
2. **Drag your folder** onto the page
3. Wait for upload to complete
4. **Done!** Your site is live at a URL like: `https://random-name-123.netlify.app`

### Step 3: Test (2 minutes)
1. Open your new Netlify URL
2. Click **"Use Demo Data"** button
3. Verify the dashboard loads with sample data
4. ✅ Success! Your app is working

### Step 4: Use with Real Data (1 minute)
1. Click **"← Back to Search Configuration"**
2. Enter your **Apify API token**
3. Enter your **LinkedIn cookie (li_at)**
4. Add your **keywords**
5. Click **"🚀 Start Auto Search"**

---

## Alternative: GitHub Method (Recommended for Teams)

### Step 1: Push to GitHub
```bash
git init
git add index.html styles.css app.js netlify.toml _redirects README.md
git commit -m "Deploy LinkedIn dashboard"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to: **https://app.netlify.com**
2. Click: **"Add new site"** → **"Import an existing project"**
3. Choose: **GitHub**
4. Select: **Your repository**
5. Click: **"Deploy site"**

### Step 3: Auto-Deploy Enabled!
- Every push to `main` branch = automatic deployment
- Pull requests = preview deployments
- Rollback to any previous version anytime

---

## Getting Your Credentials

### Apify API Token (Free - $5/month credit)
1. Sign up: **https://apify.com**
2. Go to: **https://console.apify.com/account/integrations**
3. Copy your API token (starts with `apify_api_`)

### LinkedIn Cookie
1. Log in to: **https://linkedin.com**
2. Press: **F12** (Developer Tools)
3. Go to: **Application** → **Cookies** → **https://www.linkedin.com**
4. Find: **`li_at`** cookie
5. Copy the **Value** (long string)

---

## Customization

### Change Site Name
1. Go to: **Site settings** → **General**
2. Click: **"Change site name"**
3. Enter: `your-custom-name`
4. New URL: `https://your-custom-name.netlify.app`

### Add Custom Domain
1. Go to: **Site settings** → **Domain management**
2. Click: **"Add custom domain"**
3. Follow DNS configuration steps

---

## Troubleshooting

### ❌ Site not loading
- **Check:** Is `index.html` in the root folder?
- **Fix:** Move it to the root (not in a subfolder)

### ❌ Styles not working
- **Check:** Are `styles.css` and `app.js` in the same folder as `index.html`?
- **Fix:** Ensure all files are in the root folder

### ❌ "No posts found"
- **Check:** Is your LinkedIn cookie still valid?
- **Fix:** Log in to LinkedIn again and get a fresh cookie

### ❌ Apify errors
- **Check:** Do you have credits in your Apify account?
- **Fix:** Add credits at https://console.apify.com/billing

---

## What's Next?

✅ **Your app is live!** Share the URL with your team

### Optional Enhancements:
- Add more keywords for broader searches
- Adjust max posts for more/less data
- Try different search types (Posts, People, Companies)
- Monitor costs at Apify console
- Set up custom domain
- Enable Netlify Analytics

---

## Cost Summary

| Service | Free Tier | Typical Cost |
|---------|-----------|--------------|
| **Netlify** | 100GB bandwidth/month | $0/month |
| **Apify** | $5 credit/month | $5-20/month |
| **Total** | - | **~$5-20/month** |

**Note:** Start with 50 posts to test (~$0.50-2.50)

---

## Support

- **Netlify Issues:** https://answers.netlify.com
- **Apify Issues:** https://docs.apify.com
- **LinkedIn Cookie Help:** See `MAC_COOKIE_GUIDE.md` in this repo

---

**🎉 Congratulations!** Your LinkedIn dashboard is now live on the internet!
