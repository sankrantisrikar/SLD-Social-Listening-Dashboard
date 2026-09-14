# ⚡ Quick Fix: "Actor run failed" Error

## 🎯 Most Common Cause: Expired LinkedIn Cookie

### Fix in 2 Minutes:

#### Step 1: Get Fresh Cookie (1 minute)
```
1. Open LinkedIn: https://www.linkedin.com
2. Make sure you're logged in
3. Press F12 (Developer Tools)
4. Click "Application" tab
5. Expand "Cookies" → Click "https://www.linkedin.com"
6. Find "li_at" in the list
7. Double-click the Value column
8. Copy the entire value (Ctrl+C / Cmd+C)
```

#### Step 2: Update Dashboard (30 seconds)
```
1. Go back to your dashboard
2. Click "← Back to Search Configuration"
3. Paste the new cookie in "LinkedIn Session Cookie" field
4. Click "🚀 Start Auto Search"
```

#### Step 3: Verify (30 seconds)
```
✓ Should start searching
✓ Status will show "RUNNING"
✓ Wait 30-60 seconds for results
```

---

## 🔍 Still Not Working?

### Check These 3 Things:

#### 1. Apify Credits
```
Go to: https://console.apify.com/billing
Need: At least $1 in credits
Free tier: $5/month
```

#### 2. Apify Token
```
Go to: https://console.apify.com/account/integrations
Copy: Your API token (starts with apify_api_)
Paste: Into "Apify API Token" field
```

#### 3. Keywords
```
Try simple keywords first:
- "healthcare"
- "pain management"
- "billing"

Avoid:
- Very long phrases
- Special characters
- Too many keywords at once
```

---

## 📊 Test with Demo Data First

Before troubleshooting, verify the app works:

```
1. Click "📊 Use Demo Data" button
2. If dashboard loads → App is fine, issue is credentials
3. If dashboard fails → Browser/app issue
```

---

## 🆘 Need More Help?

See detailed troubleshooting: **TROUBLESHOOTING.md**

---

## ✅ Success Checklist

- [ ] Logged into LinkedIn in browser
- [ ] Got fresh li_at cookie (today)
- [ ] Copied ENTIRE cookie value
- [ ] Pasted into dashboard
- [ ] Have Apify credits ($1+)
- [ ] Using simple keywords
- [ ] Max posts ≤ 50

---

**90% of errors are fixed by getting a fresh LinkedIn cookie!**
