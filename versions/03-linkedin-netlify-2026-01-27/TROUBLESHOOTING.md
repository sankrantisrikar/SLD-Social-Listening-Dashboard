# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### ❌ "Actor run failed. Check console for details."

This error means the Apify actor couldn't complete the LinkedIn search. Here are the most common causes and fixes:

---

## 🔍 Diagnosis Steps

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Click the **Console** tab
3. Look for red error messages
4. Take a screenshot if needed

### Step 2: Check Apify Console
1. Go to: https://console.apify.com/actors/runs
2. Find your most recent run (top of the list)
3. Click on it to see detailed logs
4. Look for error messages in the log

---

## 🛠️ Common Causes & Fixes

### 1. ❌ LinkedIn Cookie Expired (Most Common)

**Symptoms:**
- Error: "Authentication failed"
- Error: "Invalid session"
- Actor fails within 10-20 seconds

**Fix:**
```
1. Log out of LinkedIn completely
2. Log back in to LinkedIn
3. Get a fresh li_at cookie:
   - Press F12
   - Application → Cookies → linkedin.com
   - Find "li_at" cookie
   - Copy the new value
4. Paste the new cookie into your dashboard
5. Try again
```

**Why it happens:** LinkedIn cookies expire after a few weeks or when you log out.

---

### 2. ❌ Invalid Apify API Token

**Symptoms:**
- Error: "Authentication failed"
- Error: "Invalid token"
- Actor doesn't start at all

**Fix:**
```
1. Go to: https://console.apify.com/account/integrations
2. Check your API token is correct
3. Copy it again (don't include spaces)
4. Paste into dashboard
5. Try again
```

**Why it happens:** Token was copied incorrectly or has been regenerated.

---

### 3. ❌ Insufficient Apify Credits

**Symptoms:**
- Error: "Insufficient credits"
- Error: "Payment required"
- Actor starts but fails immediately

**Fix:**
```
1. Go to: https://console.apify.com/billing
2. Check your credit balance
3. Add credits if needed (minimum $5)
4. Try again
```

**Cost estimate:**
- Free tier: $5/month credit
- Per search: ~$0.01-0.05 per post
- 50 posts: ~$0.50-2.50

---

### 4. ❌ LinkedIn Rate Limiting

**Symptoms:**
- Error: "Rate limit exceeded"
- Error: "Too many requests"
- Works sometimes, fails other times

**Fix:**
```
1. Wait 15-30 minutes
2. Reduce number of keywords (try 2-3 instead of 8)
3. Reduce max posts (try 20 instead of 50)
4. Try again
```

**Why it happens:** LinkedIn limits how many searches can be done in a short time.

---

### 5. ❌ Invalid Search Keywords

**Symptoms:**
- Actor completes but returns 0 results
- Error: "No posts found"

**Fix:**
```
1. Try simpler keywords (1-2 words)
2. Remove special characters
3. Use common terms like:
   - "pain management"
   - "prior authorization"
   - "healthcare billing"
4. Try again
```

---

### 6. ❌ Network/Proxy Issues

**Symptoms:**
- Error: "Connection timeout"
- Error: "Proxy error"
- Takes very long then fails

**Fix:**
```
1. Check your internet connection
2. Try again in a few minutes
3. If persistent, contact Apify support
```

---

## 🧪 Testing Steps

### Test 1: Demo Mode
```
1. Click "Use Demo Data" button
2. If this works → Your app is fine, issue is with credentials
3. If this fails → Browser/app issue
```

### Test 2: Minimal Search
```
1. Use only 1 keyword: "healthcare"
2. Set max posts to 10
3. If this works → Try gradually increasing
4. If this fails → Check credentials
```

### Test 3: Fresh Credentials
```
1. Get brand new li_at cookie (log out/in to LinkedIn)
2. Verify Apify token is correct
3. Try with 1 simple keyword
4. If this works → Old credentials were expired
```

---

## 📊 Error Code Reference

| Error Message | Cause | Fix |
|--------------|-------|-----|
| "Authentication failed" | Expired cookie | Get fresh li_at cookie |
| "Invalid token" | Wrong Apify token | Copy token again |
| "Insufficient credits" | No Apify credits | Add credits |
| "Rate limit exceeded" | Too many requests | Wait 30 min, reduce keywords |
| "No posts found" | Bad keywords or no results | Try different keywords |
| "Timeout" | Network issue | Check connection, try again |
| "Actor run failed" | Generic error | Check Apify console logs |

---

## 🔗 Useful Links

### Get Fresh Credentials
- **LinkedIn:** https://www.linkedin.com (log in, get cookie)
- **Apify Token:** https://console.apify.com/account/integrations
- **Apify Credits:** https://console.apify.com/billing

### Check Status
- **Apify Runs:** https://console.apify.com/actors/runs
- **Apify Status:** https://status.apify.com

### Documentation
- **Cookie Guide:** See `MAC_COOKIE_GUIDE.md` in this repo
- **Apify Docs:** https://docs.apify.com
- **LinkedIn API:** https://www.linkedin.com/developers

---

## 🆘 Still Not Working?

### Quick Checklist
- [ ] Logged into LinkedIn in same browser
- [ ] Got fresh li_at cookie (today)
- [ ] Copied entire cookie value (no spaces)
- [ ] Apify token is correct
- [ ] Have Apify credits ($5+)
- [ ] Using simple keywords (1-2 words)
- [ ] Max posts set to 20 or less
- [ ] Waited 30 minutes since last attempt

### Advanced Debugging

**Check Apify Actor Logs:**
```
1. Go to: https://console.apify.com/actors/runs
2. Click your most recent run
3. Click "Log" tab
4. Look for error messages
5. Copy the error and search online
```

**Check Browser Console:**
```
1. Press F12
2. Console tab
3. Look for red errors
4. Check Network tab for failed requests
```

**Test with Python Script:**
```
If the web app fails, try the Python script:
1. Open api_test.py
2. Update your credentials
3. Run: python api_test.py
4. If this works → Web app issue
5. If this fails → Credentials issue
```

---

## 💡 Pro Tips

1. **Keep cookies fresh:** Get a new li_at cookie every week
2. **Start small:** Test with 1 keyword and 10 posts first
3. **Monitor costs:** Check Apify usage regularly
4. **Save working configs:** Note what keywords work well
5. **Use demo mode:** Test UI changes without using credits

---

## 📞 Support

### Apify Support
- **Email:** support@apify.com
- **Docs:** https://docs.apify.com
- **Community:** https://discord.gg/jyEM2PRvMU

### LinkedIn Issues
- **Help:** https://www.linkedin.com/help
- **Cookie expires:** Normal, get fresh one

### This App
- **Issues:** Check GitHub issues (if repo is public)
- **Questions:** See README.md and other docs

---

**Last Updated:** January 2026
