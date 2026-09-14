# Debugging "No data found" Error

## Step 1: Open Browser Console

1. Open `pilot.html` in your browser
2. Press **F12** (or right-click → Inspect)
3. Click the **Console** tab
4. Keep it open while testing

## Step 2: Try Fetching Data

Configure your test:
```
Apify Token: [your token]
Platforms: ✓ Twitter/X (uncheck LinkedIn and Reddit for now)
Keywords: pain management
Max Items: 10
```

Click "Fetch Multi-Platform Data"

## Step 3: Check Console Output

You should see detailed logs like:

```
=== Starting Multi-Platform Fetch ===
Platforms enabled: {linkedinEnabled: false, twitterEnabled: true, redditEnabled: false}
Max items per platform: 10
Token present: true
Keywords: ["pain management"]

🐦 Fetching Twitter data for: "pain management"
   Search query: "pain management -filter:retweets"
   Input: {
     "searchTerms": ["pain management -filter:retweets"],
     "maxItems": 10,
     "sort": "Latest"
   }
   Run started: abc123xyz
   Run completed
   Retrieved 10 tweets
   ✓ Added 10 tweets to results

=== Fetch Complete ===
Total items fetched: 10
  Twitter: 10 items
```

## Step 4: Look for Errors

### Common Error Patterns:

**1. API Authentication Error**
```
Twitter API Error: 401 - Unauthorized
```
**Solution**: Check your Apify token is correct

**2. Actor Not Found**
```
Twitter API Error: 404 - Not Found
```
**Solution**: Actor ID might be wrong (should be `apidojo/twitter-scraper-lite`)

**3. Insufficient Credits**
```
Twitter API Error: 402 - Payment Required
```
**Solution**: Add credits to your Apify account

**4. Retrieved 0 tweets**
```
Retrieved 0 tweets
```
**Solution**: Keywords too specific, try broader terms

**5. Run Timeout**
```
Error: Run did not complete within timeout
```
**Solution**: Increase timeout or reduce max items

## Step 5: Test with Different Keywords

If you get 0 results, try these proven keywords:

**Broad terms** (more results):
- `healthcare`
- `medical`
- `insurance`

**Medium terms**:
- `pain management`
- `prior authorization`
- `medical billing`

**Specific terms** (fewer results):
- `prior authorization pain management`
- `interventional pain billing denials`

## Step 6: Test Reddit

Same process but check Reddit:
```
Platforms: ✓ Reddit (only)
Keywords: healthcare
Max Items: 10
```

Look for:
```
🤖 Fetching Reddit data for: "healthcare"
   Input: {...}
   Run started: xyz789
   Run completed
   Retrieved 10 posts
   ✓ Added 10 posts to results
```

## Step 7: Check Apify Console

If errors persist:

1. Go to https://console.apify.com/actors/runs
2. Look for recent runs
3. Check their status:
   - ✅ SUCCEEDED - Good!
   - ❌ FAILED - Click to see error
   - ⏸️ RUNNING - Still processing
   - ⏹️ ABORTED - Stopped early

4. Click on a failed run to see detailed error logs

## Common Issues & Solutions

### Issue: "No data found"

**Possible Causes:**
1. All platforms returned 0 results
2. Keywords too specific
3. API errors (check console)
4. Timeout issues

**Solutions:**
1. Try broader keywords
2. Test one platform at a time
3. Check Apify console for run status
4. Verify token and credits

### Issue: Long loading time

**Possible Causes:**
1. Too many items requested
2. Multiple platforms + many keywords
3. Slow actor response

**Solutions:**
1. Reduce max items to 10-20
2. Test one platform at a time
3. Use fewer keywords (1-2)

### Issue: Partial results

**Example:** LinkedIn works but Twitter doesn't

**Solution:**
1. Check console for Twitter-specific errors
2. Test Twitter alone
3. Try different keywords for Twitter
4. Check if Twitter actor is down (Apify status page)

## Quick Test Commands

### Minimal Test (Twitter only)
```
Token: [your token]
Platforms: ✓ Twitter/X
Keywords: healthcare
Max Items: 5
```
**Expected**: 5 tweets in ~30 seconds

### Minimal Test (Reddit only)
```
Token: [your token]
Platforms: ✓ Reddit
Keywords: medicine
Max Items: 5
```
**Expected**: 5 posts in ~30 seconds

### Demo Mode Test
```
Click "🎭 Try Demo Mode" button
```
**Expected**: 50 sample posts instantly (no API calls)

## What to Share for Help

If you need help, share:

1. **Console output** (copy/paste the logs)
2. **Configuration used**:
   - Which platforms checked
   - Keywords entered
   - Max items value
3. **Error message** (exact text)
4. **Apify run URL** (from Apify console)

## Example Console Output to Share

```
=== Starting Multi-Platform Fetch ===
Platforms enabled: {linkedinEnabled: false, twitterEnabled: true, redditEnabled: false}
Max items per platform: 10
Token present: true
Keywords: ["pain management"]

🐦 Fetching Twitter data for: "pain management"
   Search query: "pain management -filter:retweets"
   Input: {
     "searchTerms": ["pain management -filter:retweets"],
     "maxItems": 10,
     "sort": "Latest"
   }
   Twitter API Error Response: {"error": "..."}
   ✗ Error fetching Twitter data for "pain management": Error: Twitter API Error: 401 - ...
```

This tells us exactly what went wrong!

---

**Next Step**: Open the console, try fetching, and share what you see in the console output.
