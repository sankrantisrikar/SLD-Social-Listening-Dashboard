# Netlify Functions Setup for Twitter & Reddit

## Problem
Apify API blocks direct browser requests due to CORS policy, even from Netlify domains.

## Solution
Use Netlify Functions (serverless backend) to proxy the API calls. The functions run on Netlify's servers, not in the browser, so they bypass CORS completely.

## What Was Created

1. `.netlify/functions/fetch-twitter.js` - Serverless function for Twitter
2. `.netlify/functions/fetch-reddit.js` - Serverless function for Reddit

## What Needs to Be Done

### Step 1: Update netlify.toml

The `netlify.toml` file needs to specify the functions directory:

```toml
[build]
  functions = ".netlify/functions"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/pilot.html"
  status = 200
```

### Step 2: Update pilot.html

Change the Twitter and Reddit fetch functions to call the Netlify functions instead of Apify API directly.

**Current (Direct API call):**
```javascript
const url = `https://api.apify.com/v2/acts/apidojo/twitter-scraper-lite/runs?token=${token}`;
const response = await fetch(url, { method: 'POST', ... });
```

**New (Via Netlify Function):**
```javascript
const url = `/.netlify/functions/fetch-twitter`;
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: token,
    keyword: keyword,
    maxItems: maxItems,
    verifiedOnly: verifiedOnly,
    excludeRetweets: excludeRetweets,
    minLikes: minLikes
  })
});
```

### Step 3: Deploy to Netlify

After making the changes:
```bash
# Commit changes
git add .
git commit -m "Add Netlify functions for Twitter and Reddit"

# Deploy
netlify deploy --prod
```

## Benefits

✅ **No CORS errors** - Functions run on server, not browser
✅ **Secure** - API token never exposed in browser network requests
✅ **Works from any domain** - No origin restrictions
✅ **Same functionality** - Just a different routing method

## Next Steps

1. I'll update the code to use these functions
2. You'll need to redeploy to Netlify
3. Twitter and Reddit will work!

---

**Note:** LinkedIn can continue using direct API calls since it's already working.
