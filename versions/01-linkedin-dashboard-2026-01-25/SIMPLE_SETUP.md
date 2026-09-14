# LinkedIn Dashboard - Simple Setup Guide

## 🎯 What This Does

Enter keywords like "prior authorization pain management" → System automatically searches LinkedIn → Displays all matching posts → Click any link to open on LinkedIn

## 🚀 Quick Start (3 Steps)

### Step 1: Get Your Credentials (5 minutes)

**A) Apify API Token:**
1. Go to https://console.apify.com/sign-up (free trial)
2. After signup, go to https://console.apify.com/account/integrations
3. Copy your API token (starts with `apify_api_`)

**B) LinkedIn Cookie:**
1. Open https://www.linkedin.com (must be logged in)
2. Press **F12** on your keyboard
3. Click **Application** tab (or **Storage** in Firefox)
4. Left sidebar: **Cookies** → **https://www.linkedin.com**
5. Find cookie named **`li_at`**
6. Copy the entire **Value** (long string)

### Step 2: Open the Dashboard

Double-click: **`linkedin-dashboard-auto.html`**

### Step 3: Enter Your Info

1. **Apify API Token**: Paste your token
2. **LinkedIn Cookie**: Paste your li_at cookie value
3. **Keywords**: Already filled with pain management keywords (you can edit)
4. **Max Posts**: Leave at 100 (or adjust)
5. Click **"🚀 Start Auto Search"**

## ⏱️ What Happens Next

1. System searches LinkedIn for your keywords (30-60 seconds)
2. Fetches all matching posts and profiles
3. Displays results in dashboard
4. Click any profile/post link → Opens directly on LinkedIn

## 📊 What You'll See

- **Total posts found** matching your keywords
- **Unique authors** who posted about these topics
- **Engagement metrics** (likes, comments, shares)
- **Clickable links** to view profiles and posts on LinkedIn
- **Top influencers** ranked by engagement

## 💰 Cost

- **Free trial**: $5 credit (enough for 100-500 posts)
- **Typical search**: $0.50-2.50 for 100 posts
- Start small to test!

## ❌ Troubleshooting

**"Field input.cookie is required"**
→ You must enter your LinkedIn li_at cookie

**"Invalid cookie"**
→ Get a fresh cookie (log into LinkedIn again and copy li_at)

**"No posts found"**
→ Try different keywords or check your LinkedIn cookie is valid

**"Insufficient credits"**
→ Add credits to your Apify account

## 🔑 Default Keywords Included

The dashboard comes pre-loaded with these keywords:
- prior authorization pain management
- interventional pain billing
- spinal cord stimulator denials
- Medicare pain procedures
- RCM pain management
- peer to peer appeals pain
- WISeR automation
- pain management prior auth

**You can edit these to search for anything you want!**

## 💡 Tips

- Start with demo mode first (click "Use Demo Data")
- Test with 50 posts first to check costs
- More keywords = more results but higher cost
- LinkedIn cookies expire - refresh if needed
- Click any profile/post link to open on LinkedIn

## 🎯 That's It!

No Python, no JSON files, no complicated setup. Just:
1. Get credentials
2. Open HTML file
3. Enter keywords
4. Click search
5. View results

---

**Need the cookie?** Press F12 → Application → Cookies → linkedin.com → Copy "li_at"

**Ready?** Open `linkedin-dashboard-auto.html` and start searching!
