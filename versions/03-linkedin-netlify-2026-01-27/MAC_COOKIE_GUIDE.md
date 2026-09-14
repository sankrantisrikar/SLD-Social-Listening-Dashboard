# How to Get LinkedIn Cookie on Mac

## Why is this needed?

LinkedIn doesn't provide a public API for searching posts. The Apify scraper needs your session cookie to access LinkedIn as if it's you browsing. **This is the only way to search LinkedIn programmatically.**

## For Mac Users - Step by Step

### Option 1: Chrome on Mac

1. **Open Chrome** and go to https://www.linkedin.com
2. **Make sure you're logged in**
3. **Press:** `Cmd + Option + I` (or right-click → Inspect)
4. Click the **"Application"** tab at the top
5. In the left sidebar, expand **"Cookies"**
6. Click on **"https://www.linkedin.com"**
7. In the table on the right, find the row with Name: **"li_at"**
8. Double-click the **Value** column for li_at
9. **Copy it** (Cmd + C)

### Option 2: Safari on Mac

1. **Enable Developer Menu first:**
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"

2. **Get the cookie:**
   - Go to https://www.linkedin.com (logged in)
   - Press `Cmd + Option + I`
   - Click **"Storage"** tab
   - Expand **"Cookies"**
   - Click **"https://www.linkedin.com"**
   - Find **"li_at"** in the list
   - Copy the Value

### Option 3: Firefox on Mac

1. Go to https://www.linkedin.com (logged in)
2. Press `Cmd + Option + I`
3. Click **"Storage"** tab
4. Expand **"Cookies"**
5. Click **"https://www.linkedin.com"**
6. Find **"li_at"**
7. Copy the Value

## What the cookie looks like

```
AQEDATXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

It's a long string (about 100+ characters) starting with "AQEDAT" or similar.

## Is this safe?

**Security notes:**
- ✅ The cookie only works while you're logged into LinkedIn
- ✅ It expires when you log out
- ✅ You can revoke it anytime by logging out
- ⚠️ Don't share it with anyone (it's like your password)
- ⚠️ Only use it in this dashboard (don't paste it anywhere else)

## Alternative: Can I avoid using the cookie?

**Unfortunately, NO.** Here's why:

1. **LinkedIn has no public search API** - They don't provide an official way to search posts
2. **Apify scraper mimics a browser** - It needs to authenticate like you would
3. **This is the industry standard** - All LinkedIn scrapers work this way
4. **It's temporary** - Cookie expires when you log out

## What if I'm uncomfortable with this?

You have 2 options:

### Option A: Use Demo Mode
- Open `linkedin-pain-management-dashboard.html`
- View the dashboard with sample data
- No credentials needed
- Perfect for presentations

### Option B: Manual LinkedIn Search
- Search LinkedIn manually
- Copy/paste interesting posts into a spreadsheet
- No automation, but no cookie needed

## Still can't find the cookie?

**Try this:**

1. Open Chrome on your Mac
2. Go to https://www.linkedin.com
3. Make sure you see your profile (you're logged in)
4. Press `Cmd + Option + J` (opens Console)
5. Type this and press Enter:

```javascript
document.cookie.split(';').find(c => c.includes('li_at'))
```

6. You'll see something like: `"li_at=AQEDATXxxx..."`
7. Copy everything after `li_at=` (the long string)

## Summary

**Why needed:** LinkedIn has no public API, scraper needs authentication
**How to get:** Chrome → Cmd+Option+I → Application → Cookies → li_at
**Is it safe:** Yes, but keep it private
**Alternative:** Use demo mode (no real data)

---

**Still having trouble?** Take a screenshot of what you see when you press Cmd+Option+I and I can help you find it!
