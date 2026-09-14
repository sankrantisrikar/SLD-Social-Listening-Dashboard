# Credentials Guide - API Token & LinkedIn Cookie

## Why Are These Credentials Needed?

The PainMed-PA Social Listening Dashboard fetches real-time data from LinkedIn to analyze conversations about pain management, healthcare billing, and medical procedures. To access this data, two credentials are required:

### 1. Apify API Token
**What it is:** A unique authentication key that allows the dashboard to use Apify's LinkedIn scraping service.

**Why it's needed:** 
- LinkedIn doesn't provide a public API for searching posts
- Apify provides a professional scraping service that can search LinkedIn legally and ethically
- The API token authenticates your requests and tracks usage/billing

**How long it works:**
- ✅ **Permanent** - The token doesn't expire unless you manually revoke it
- Works indefinitely as long as your Apify account is active
- No need to refresh or update

**Cost:**
- Apify charges based on usage (compute time and data scraped)
- Approximately $0.01-0.05 per post fetched
- Free tier available: $5 free credits per month
- Monitor usage at: https://console.apify.com

---

### 2. LinkedIn Session Cookie (li_at)
**What it is:** A browser cookie that proves you're logged into LinkedIn. It acts as your "session pass" to access LinkedIn as if you were browsing normally.

**Why it's needed:**
- LinkedIn requires authentication to view posts and search results
- The cookie allows Apify to access LinkedIn on your behalf
- It's the same cookie your browser uses when you're logged in

**How long it works:**
- ⏰ **Expires after 30-90 days** (LinkedIn's standard session duration)
- May expire sooner if:
  - You log out of LinkedIn
  - You change your LinkedIn password
  - LinkedIn detects unusual activity
  - You clear your browser cookies

**Security:**
- The cookie is stored locally in your browser only
- Never shared with any server except Apify's secure API
- Gives read-only access to LinkedIn (cannot post or modify your account)

---

## How to Get Your Credentials

### Getting Your Apify API Token

1. **Sign up for Apify:**
   - Go to https://apify.com
   - Create a free account
   - You'll get $5 in free credits

2. **Get your API token:**
   - Log in to Apify
   - Go to Settings → Integrations
   - Copy your API token (starts with `apify_api_`)
   - Keep it secure - treat it like a password

3. **Monitor usage:**
   - Check usage at https://console.apify.com
   - View costs and credits remaining
   - Set up billing alerts if needed

---

### Getting Your LinkedIn Cookie (li_at)

#### For Chrome/Edge:

1. **Log in to LinkedIn:**
   - Go to https://linkedin.com
   - Log in with your credentials

2. **Open Developer Tools:**
   - Press `F12` or right-click → "Inspect"

3. **Find the cookie:**
   - Click the "Application" tab (or "Storage" in Firefox)
   - In the left sidebar: Storage → Cookies → https://www.linkedin.com
   - Find the cookie named `li_at`
   - Copy the entire "Value" (long string of letters/numbers)

#### For Safari (Mac):

1. **Enable Developer Menu:**
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"

2. **Get the cookie:**
   - Log in to LinkedIn
   - Develop → Show Web Inspector
   - Storage tab → Cookies → linkedin.com
   - Find `li_at` and copy the value

#### For Firefox:

1. **Open Developer Tools:**
   - Press `F12`
   - Click "Storage" tab

2. **Find the cookie:**
   - Cookies → https://www.linkedin.com
   - Find `li_at` and copy the value

---

## When to Update Your Credentials

### Update Apify API Token When:
- ❌ You revoke the old token
- ❌ Your Apify account is compromised
- ❌ You create a new Apify account

**Otherwise:** No need to update - it works permanently

---

### Update LinkedIn Cookie When:

You'll know the cookie expired when you see this error:
```
"Actor run failed" or "Authentication failed"
```

**Update immediately if:**
- ⚠️ You log out of LinkedIn
- ⚠️ You change your LinkedIn password
- ⚠️ Error message says "cookie expired" or "authentication failed"
- ⚠️ Dashboard returns no results after working previously

**Recommended schedule:**
- 🔄 Refresh every 30 days proactively
- 🔄 Or wait until you see an error, then update

---

## Security & Privacy

### Is This Safe?

✅ **Yes, when used properly:**

**Apify API Token:**
- Only gives access to Apify services
- Cannot access your LinkedIn account directly
- Can be revoked anytime at https://console.apify.com

**LinkedIn Cookie:**
- Read-only access to LinkedIn
- Cannot post, message, or modify your account
- Cannot access your password
- Stored locally in your browser only
- Never sent to any server except Apify's secure API

### Best Practices:

1. **Don't share credentials:**
   - Keep your API token and cookie private
   - Don't commit them to public repositories
   - Don't share screenshots containing them

2. **Use a dedicated LinkedIn account (optional):**
   - Consider creating a separate LinkedIn account for scraping
   - Reduces risk to your personal account
   - Easier to manage if issues arise

3. **Monitor usage:**
   - Check Apify console regularly for unusual activity
   - Set up billing alerts to avoid unexpected charges

4. **Revoke if compromised:**
   - If you suspect your token is compromised, revoke it immediately
   - Generate a new token at Apify console

---

## Troubleshooting

### "Actor run failed" Error

**Cause:** LinkedIn cookie expired or invalid

**Solution:**
1. Get a fresh `li_at` cookie from LinkedIn
2. Make sure you're logged in to LinkedIn when copying
3. Copy the entire cookie value (no spaces or extra characters)
4. Paste into the dashboard and try again

---

### "Invalid API token" Error

**Cause:** Apify token is incorrect or revoked

**Solution:**
1. Log in to Apify console
2. Go to Settings → Integrations
3. Copy the correct API token
4. Make sure it starts with `apify_api_`
5. Paste into the dashboard

---

### "No results found" Error

**Possible causes:**
1. Cookie expired → Get fresh cookie
2. Keywords too specific → Try broader terms
3. No posts match your search → Try different keywords
4. LinkedIn rate limiting → Wait 10-15 minutes and try again

---

## Cost Management

### Apify Pricing

**Free Tier:**
- $5 free credits per month
- Enough for ~100-250 posts per month
- No credit card required

**Paid Plans:**
- Pay-as-you-go: $0.25 per compute unit
- Approximately $0.01-0.05 per post
- 50 posts ≈ $0.50-$2.50
- 100 posts ≈ $1-$5

**Tips to reduce costs:**
1. Use 3-5 keywords instead of 10+
2. Start with 30-50 posts, not 200+
3. Use the 24-hour cache (don't re-fetch same data)
4. Monitor usage at https://console.apify.com

---

## Data Caching

The dashboard caches fetched data for **24 hours** to:
- ✅ Reduce API costs
- ✅ Speed up subsequent loads
- ✅ Avoid hitting LinkedIn rate limits

**What this means:**
- First search: Takes 30-60 seconds, uses Apify credits
- Subsequent views (within 24 hours): Instant, free
- After 24 hours: Cache expires, need to fetch fresh data

**To clear cache manually:**
- Click "Clear Cache" button in the dashboard
- Or clear your browser's localStorage

---

## Support

### Need Help?

**Apify Issues:**
- Documentation: https://docs.apify.com
- Support: https://apify.com/support
- Console: https://console.apify.com

**LinkedIn Issues:**
- Make sure you're logged in when getting the cookie
- Try logging out and back in to LinkedIn
- Use a desktop browser (mobile browsers may not work)

**Dashboard Issues:**
- Check browser console (F12) for error messages
- Try clearing cache and refreshing
- Make sure both credentials are entered correctly

---

## Quick Reference

| Credential | Expires? | Where to Get | Update Frequency |
|------------|----------|--------------|------------------|
| **Apify API Token** | ❌ Never | https://console.apify.com/account/integrations | Once (permanent) |
| **LinkedIn Cookie** | ✅ Yes (30-90 days) | LinkedIn → F12 → Application → Cookies | Every 30 days or when error occurs |

---

## Summary

- **Apify API Token**: Permanent authentication for Apify service (~$0.01-0.05 per post)
- **LinkedIn Cookie**: Temporary session pass (expires every 30-90 days)
- **Both are safe** when used properly and kept private
- **Update cookie** when you see authentication errors
- **Monitor costs** at Apify console to avoid surprises
- **Data is cached** for 24 hours to save money and time

For questions or issues, check the browser console (F12) for detailed error messages.
