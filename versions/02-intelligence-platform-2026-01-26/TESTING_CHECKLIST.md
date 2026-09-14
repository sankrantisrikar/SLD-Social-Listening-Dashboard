# Testing Checklist

Complete testing guide for the Pain Management Social Intelligence Platform.

## Pre-Testing Setup

### Browser Requirements
- [ ] Modern browser (Chrome, Firefox, Safari, Edge)
- [ ] JavaScript enabled
- [ ] localStorage enabled
- [ ] Internet connection active

### File Access
- [ ] `index.html` file accessible
- [ ] Can open HTML files in browser
- [ ] No CORS restrictions (if testing locally)

---

## Test 1: Basic Functionality (No API Keys)

### Objective
Verify the platform loads and basic UI works without any configuration.

### Steps
1. [ ] Open `index.html` in browser
2. [ ] Verify header displays correctly
3. [ ] Verify "Configure APIs" button visible
4. [ ] Verify platform selector shows 5 platforms
5. [ ] Verify all platforms are unchecked by default
6. [ ] Verify dashboard shows "Select a platform to begin"
7. [ ] Verify AI chat is disabled

### Expected Results
- ✅ Clean UI loads without errors
- ✅ No console errors (check F12)
- ✅ All UI elements visible and styled
- ✅ Empty state messages clear

---

## Test 2: Reddit Integration (No API Key Needed)

### Objective
Test immediate data fetching with Reddit (no authentication required).

### Steps
1. [ ] Open `index.html`
2. [ ] Click Reddit checkbox
3. [ ] Observe loading indicator (⏳)
4. [ ] Wait 5-10 seconds
5. [ ] Verify dashboard updates with data
6. [ ] Check CEO Summary populated
7. [ ] Check Key Metrics show numbers
8. [ ] Check charts render
9. [ ] Verify AI chat enabled
10. [ ] Send test message in AI chat

### Expected Results
- ✅ Reddit badge shows ⏳ then ✓
- ✅ Dashboard shows real data
- ✅ CEO summary has Reddit-specific insights
- ✅ Charts display actual data
- ✅ AI chat responds with Reddit context

### Troubleshooting
- **No data**: Check internet connection
- **Error message**: Check browser console
- **Slow loading**: Reddit API may be slow, wait 30 seconds

---

## Test 3: API Configuration UI

### Objective
Verify API configuration interface works correctly.

### Steps
1. [ ] Click "Configure APIs" button
2. [ ] Verify modal opens
3. [ ] Check all 5 platform sections visible
4. [ ] Verify input fields present
5. [ ] Verify links to API providers work
6. [ ] Enter test value in one field
7. [ ] Click "Save Configuration"
8. [ ] Verify modal closes
9. [ ] Reopen modal
10. [ ] Verify saved value persists

### Expected Results
- ✅ Modal displays correctly
- ✅ All input fields functional
- ✅ Links open in new tabs
- ✅ Save button works
- ✅ Values persist in localStorage

---

## Test 4: YouTube Integration

### Objective
Test YouTube API integration with real API key.

### Prerequisites
- [ ] YouTube Data API v3 key obtained
- [ ] API enabled in Google Cloud Console

### Steps
1. [ ] Click "Configure APIs"
2. [ ] Enter YouTube API key
3. [ ] Click "Save Configuration"
4. [ ] Select YouTube platform
5. [ ] Observe loading indicator
6. [ ] Wait 10-15 seconds
7. [ ] Verify data loads
8. [ ] Check for video-related content
9. [ ] Verify charts update
10. [ ] Test AI chat with YouTube context

### Expected Results
- ✅ YouTube badge shows ⏳ then ✓
- ✅ Dashboard shows YouTube data
- ✅ Video titles/channels visible in data
- ✅ Charts include YouTube metrics
- ✅ AI chat references YouTube

### Troubleshooting
- **"API key invalid"**: Verify key copied correctly
- **"Quota exceeded"**: Wait until next day (quota resets)
- **No results**: Check search keywords match content

---

## Test 5: LinkedIn Integration (Apify)

### Objective
Test LinkedIn integration via Apify actor.

### Prerequisites
- [ ] Apify account created
- [ ] API token obtained
- [ ] Account has available credits

### Steps
1. [ ] Click "Configure APIs"
2. [ ] Enter Apify token
3. [ ] Click "Save Configuration"
4. [ ] Select LinkedIn platform
5. [ ] Observe loading message (30-60 seconds)
6. [ ] Wait for actor completion
7. [ ] Verify data loads
8. [ ] Check for LinkedIn posts/comments
9. [ ] Verify professional content
10. [ ] Test multi-platform with Reddit + LinkedIn

### Expected Results
- ✅ LinkedIn badge shows ⏳ for 30-60 seconds
- ✅ Then shows ✓ when complete
- ✅ Dashboard shows LinkedIn posts
- ✅ Professional discussions visible
- ✅ Multi-platform aggregation works

### Troubleshooting
- **Timeout**: Apify actor may take longer, wait 2 minutes
- **"No credits"**: Check Apify account balance
- **"Actor failed"**: Check Apify console for errors

---

## Test 6: Multi-Platform Integration

### Objective
Test multiple platforms simultaneously.

### Prerequisites
- [ ] At least 2 API keys configured
- [ ] Or use Reddit + one other platform

### Steps
1. [ ] Select Reddit checkbox
2. [ ] Select YouTube checkbox
3. [ ] Observe both loading
4. [ ] Wait for both to complete
5. [ ] Verify dashboard shows combined data
6. [ ] Check CEO summary mentions both platforms
7. [ ] Verify metrics are aggregated
8. [ ] Check charts show combined data
9. [ ] Test AI chat with multi-platform context
10. [ ] Deselect one platform, verify update

### Expected Results
- ✅ Both platforms load independently
- ✅ Data aggregates correctly
- ✅ Platform badges show on all widgets
- ✅ CEO summary references both
- ✅ Charts combine data appropriately
- ✅ AI chat uses only selected platforms

---

## Test 7: Error Handling

### Objective
Verify error handling works correctly.

### Test 7a: Invalid API Key
1. [ ] Enter invalid API key
2. [ ] Select that platform
3. [ ] Verify error message displays
4. [ ] Check error is clear and actionable
5. [ ] Verify "Configure APIs" button in error

### Test 7b: No API Key
1. [ ] Don't configure API key
2. [ ] Select platform requiring key (YouTube)
3. [ ] Verify error message
4. [ ] Check message explains requirement
5. [ ] Verify configuration prompt

### Test 7c: Network Error
1. [ ] Disconnect internet
2. [ ] Select platform
3. [ ] Verify network error message
4. [ ] Reconnect internet
5. [ ] Retry, verify works

### Expected Results
- ✅ Clear error messages
- ✅ No console errors
- ✅ Helpful guidance provided
- ✅ Easy path to fix issue

---

## Test 8: Data Quality

### Objective
Verify data processing and quality.

### Steps
1. [ ] Load data from any platform
2. [ ] Check CEO Summary for relevance
3. [ ] Verify topics detected correctly
4. [ ] Check payer mentions accurate
5. [ ] Verify sentiment analysis reasonable
6. [ ] Check engagement metrics present
7. [ ] Verify confidence indicators shown
8. [ ] Check platform attribution badges
9. [ ] Verify data freshness (dates)
10. [ ] Check for duplicate content

### Expected Results
- ✅ Topics relevant to pain management
- ✅ Payers correctly identified
- ✅ Sentiment makes sense
- ✅ Metrics calculated correctly
- ✅ All data properly attributed

---

## Test 9: AI Chat Functionality

### Objective
Test AI chat assistant with real data.

### Steps
1. [ ] Load data from at least one platform
2. [ ] Verify chat is enabled
3. [ ] Check chat scope shows active platforms
4. [ ] Send test question
5. [ ] Verify response references correct platforms
6. [ ] Check response includes data attribution
7. [ ] Verify confidence level shown
8. [ ] Test with multiple platforms
9. [ ] Verify responses use only selected data
10. [ ] Test Enter key to send

### Expected Results
- ✅ Chat enabled when platforms selected
- ✅ Responses reference correct platforms
- ✅ Data attribution clear
- ✅ Confidence levels shown
- ✅ Platform-scoped responses

---

## Test 10: Charts and Visualizations

### Objective
Verify charts render correctly with real data.

### Steps
1. [ ] Load data from any platform
2. [ ] Verify Topic Distribution chart renders
3. [ ] Check Sentiment Analysis chart displays
4. [ ] Verify Payer Mentions chart (if data available)
5. [ ] Check chart legends
6. [ ] Verify chart colors
7. [ ] Check chart responsiveness
8. [ ] Verify chart data matches metrics
9. [ ] Test with different platforms
10. [ ] Check charts update when platforms change

### Expected Results
- ✅ All charts render without errors
- ✅ Data accurately represented
- ✅ Colors consistent with design
- ✅ Legends clear and helpful
- ✅ Charts responsive to window size

---

## Test 11: Performance

### Objective
Verify acceptable performance.

### Metrics to Check
- [ ] Initial page load: < 2 seconds
- [ ] Reddit data fetch: < 10 seconds
- [ ] YouTube data fetch: < 15 seconds
- [ ] Dashboard render: < 1 second
- [ ] Chart render: < 1 second
- [ ] Platform toggle: < 500ms
- [ ] AI chat response: < 2 seconds

### Steps
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Load page, check load time
4. [ ] Select platform, time data fetch
5. [ ] Monitor console for errors
6. [ ] Check memory usage
7. [ ] Test with multiple platforms
8. [ ] Verify no memory leaks

### Expected Results
- ✅ Fast initial load
- ✅ Reasonable API fetch times
- ✅ Smooth UI updates
- ✅ No performance warnings

---

## Test 12: Browser Compatibility

### Objective
Verify works across browsers.

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### For Each Browser
1. [ ] Open `index.html`
2. [ ] Verify UI renders correctly
3. [ ] Test platform selection
4. [ ] Test API configuration
5. [ ] Test data fetching
6. [ ] Check charts render
7. [ ] Test AI chat
8. [ ] Check console for errors

### Expected Results
- ✅ Consistent UI across browsers
- ✅ All features functional
- ✅ No browser-specific errors

---

## Test 13: Mobile Responsiveness

### Objective
Verify mobile/tablet compatibility.

### Devices to Test
- [ ] Mobile phone (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

### Steps
1. [ ] Open in browser
2. [ ] Use DevTools responsive mode
3. [ ] Test at different widths
4. [ ] Verify layout adapts
5. [ ] Check platform selector wraps
6. [ ] Verify charts resize
7. [ ] Test AI chat on mobile
8. [ ] Check touch interactions

### Expected Results
- ✅ Responsive layout
- ✅ Readable on small screens
- ✅ Touch-friendly controls
- ✅ No horizontal scroll

---

## Test 14: Data Persistence

### Objective
Verify data persists correctly.

### Steps
1. [ ] Configure API keys
2. [ ] Close browser
3. [ ] Reopen `index.html`
4. [ ] Verify API keys still saved
5. [ ] Select platforms
6. [ ] Refresh page
7. [ ] Verify platforms still selected
8. [ ] Check data still loaded
9. [ ] Clear localStorage
10. [ ] Verify reset to default state

### Expected Results
- ✅ API keys persist across sessions
- ✅ Platform selection persists
- ✅ Data cached appropriately
- ✅ Clear localStorage resets state

---

## Test 15: Security

### Objective
Verify security best practices.

### Checks
- [ ] API keys stored in localStorage only
- [ ] No API keys in URL
- [ ] No API keys in console logs
- [ ] HTTPS used for API calls
- [ ] No XSS vulnerabilities
- [ ] No sensitive data in HTML
- [ ] CSP headers appropriate
- [ ] No mixed content warnings

### Expected Results
- ✅ API keys secure
- ✅ No security warnings
- ✅ Best practices followed

---

## Bug Report Template

If you find issues, report using this template:

```markdown
### Bug Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [etc.]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [Browser version]
- OS: [Windows/Mac/Linux]
- Platform: [Which platform(s) selected]

### Console Errors
[Any errors from browser console]

### Screenshots
[If applicable]
```

---

## Success Criteria

### All Tests Pass
- [ ] Basic functionality works
- [ ] Reddit integration works
- [ ] API configuration works
- [ ] At least one paid API works (YouTube/LinkedIn)
- [ ] Multi-platform aggregation works
- [ ] Error handling appropriate
- [ ] Data quality acceptable
- [ ] AI chat functional
- [ ] Charts render correctly
- [ ] Performance acceptable
- [ ] Browser compatibility confirmed
- [ ] Mobile responsive
- [ ] Data persists correctly
- [ ] Security verified

### Ready for Production
- [ ] All critical tests pass
- [ ] No blocking bugs
- [ ] Documentation complete
- [ ] Performance acceptable
- [ ] Security validated

---

## Next Steps After Testing

### If All Tests Pass
1. ✅ Mark as production-ready
2. ✅ Deploy to hosting
3. ✅ Share with stakeholders
4. ✅ Begin user training
5. ✅ Monitor usage

### If Issues Found
1. ⚠️ Document bugs
2. ⚠️ Prioritize fixes
3. ⚠️ Implement corrections
4. ⚠️ Retest
5. ⚠️ Repeat until pass

---

**Testing Status**: Ready to begin
**Last Updated**: January 25, 2026
**Version**: 1.0
