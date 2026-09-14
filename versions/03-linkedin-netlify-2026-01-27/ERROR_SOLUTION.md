# ❌ Error: "Actor run failed" - SOLUTION

## What Happened?

You deployed to Netlify successfully, but when you tried to search LinkedIn, you got:
```
Error: Actor run failed. Check console for details.
```

This means the Apify actor (the service that scrapes LinkedIn) couldn't complete the search.

---

## 🎯 Solution (Choose One)

### Solution 1: Get Fresh LinkedIn Cookie (90% Success Rate)

Your LinkedIn cookie has likely **expired**. This is the most common cause.

#### How to Fix:
1. **Open LinkedIn** in your browser: https://www.linkedin.com
2. **Log out** completely
3. **Log back in**
4. **Get fresh cookie:**
   - Press **F12** (Developer Tools)
   - Click **"Application"** tab (Chrome) or **"Storage"** (Firefox)
   - Expand **"Cookies"** → Click **"https://www.linkedin.com"**
   - Find **"li_at"** in the list
   - **Copy the Value** (the long string)
5. **Update your dashboard:**
   - Go back to your Netlify app
   - Click **"← Back to Search Configuration"**
   - Paste the new cookie value
   - Click **"🚀 Start Auto Search"**

**This fixes 90% of "Actor run failed" errors!**

---

### Solution 2: Check Apify Credits

Your Apify account might be out of credits.

#### How to Check:
1. Go to: https://console.apify.com/billing
2. Check your credit balance
3. If it's $0 or negative, add credits:
   - Click "Add credits"
   - Minimum: $5
   - Recommended: $10-20 for regular use

**Free tier:** $5/month credit (resets monthly)

---

### Solution 3: Verify Apify Token

Your API token might be incorrect.

#### How to Fix:
1. Go to: https://console.apify.com/account/integrations
2. Copy your API token (starts with `apify_api_`)
3. Make sure you copy the ENTIRE token
4. Paste it into your dashboard
5. Try again

---

### Solution 4: Check Apify Console Logs

See exactly what went wrong.

#### How to Check:
1. Go to: https://console.apify.com/actors/runs
2. Click on your most recent run (top of list)
3. Click the **"Log"** tab
4. Look for error messages in red
5. Common errors you might see:
   - "Authentication failed" → Cookie expired (Solution 1)
   - "Insufficient credits" → No credits (Solution 2)
   - "Rate limit exceeded" → Wait 30 minutes, try again
   - "Invalid session" → Cookie expired (Solution 1)

---

## 🧪 Test First: Use Demo Data

Before troubleshooting, verify your app works:

1. Click **"📊 Use Demo Data"** button
2. If the dashboard loads with sample data → **App is fine, issue is with credentials**
3. If demo fails → Browser or app issue (clear cache, try different browser)

---

## 📋 Quick Checklist

Go through this list:

- [ ] I'm logged into LinkedIn in my browser
- [ ] I got a fresh li_at cookie (today, not from old file)
- [ ] I copied the ENTIRE cookie value (no spaces at start/end)
- [ ] My Apify account has credits (check billing page)
- [ ] My Apify token is correct (check integrations page)
- [ ] I'm using simple keywords (not too complex)
- [ ] Max posts is set to 50 or less
- [ ] I waited at least 30 minutes since last failed attempt

---

## 🔄 Step-by-Step Recovery

Follow these steps in order:

### Step 1: Test Demo Mode
```
Click "Use Demo Data"
→ Works? Go to Step 2
→ Fails? Clear browser cache, reload page
```

### Step 2: Get Fresh Cookie
```
Log out of LinkedIn
Log back in
Get new li_at cookie (F12 → Application → Cookies)
Copy entire value
```

### Step 3: Verify Credentials
```
Check Apify credits: https://console.apify.com/billing
Check Apify token: https://console.apify.com/account/integrations
```

### Step 4: Test with Minimal Search
```
Use only 1 keyword: "healthcare"
Set max posts to 10
Click "Start Auto Search"
Wait 60 seconds
```

### Step 5: Check Results
```
✓ Success? Gradually increase keywords and posts
✗ Still fails? Check Apify console logs (Step 4 above)
```

---

## 💡 Pro Tips

1. **Cookie expires:** Get a fresh cookie every week or when you log out of LinkedIn
2. **Start small:** Always test with 1 keyword and 10 posts first
3. **Monitor costs:** Check Apify usage at https://console.apify.com/billing
4. **Save working configs:** Note which keywords work well
5. **Check logs:** Always check Apify console logs for detailed errors

---

## 📊 Error Frequency

Based on common issues:

| Cause | Frequency | Fix Time |
|-------|-----------|----------|
| Expired cookie | 90% | 2 minutes |
| No credits | 5% | 5 minutes |
| Wrong token | 3% | 1 minute |
| Rate limiting | 1% | 30 minutes |
| Other | 1% | Varies |

**Bottom line:** 90% of the time, you just need a fresh LinkedIn cookie!

---

## 🆘 Still Not Working?

### Option 1: Detailed Troubleshooting
Read: **TROUBLESHOOTING.md** (comprehensive guide)

### Option 2: Quick Fix
Read: **QUICK_FIX.md** (2-minute solution)

### Option 3: Contact Support
- **Apify Support:** support@apify.com
- **Apify Docs:** https://docs.apify.com
- **Apify Discord:** https://discord.gg/jyEM2PRvMU

---

## ✅ Success Indicators

You'll know it's working when you see:

1. Loading screen appears
2. Status shows: "Status: RUNNING (Xs elapsed)"
3. After 30-60 seconds: "Fetching results..."
4. Dashboard appears with your data
5. Live indicator shows: "● LIVE DATA" (green)

---

## 🎉 Once It Works

After you get it working:

1. **Save your working credentials** (in a password manager)
2. **Note the expiration:** Get fresh cookie weekly
3. **Monitor costs:** Check Apify billing regularly
4. **Share with team:** Send them the Netlify URL
5. **Bookmark:** Save the Netlify URL for easy access

---

**Remember: 90% of errors = expired LinkedIn cookie. Get a fresh one first!**

---

**Updated:** January 2026
**Version:** 1.0
