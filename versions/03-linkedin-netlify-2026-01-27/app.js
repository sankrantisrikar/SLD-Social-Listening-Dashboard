// Global state
let rawData = [];
let processedData = {
    totalPosts: 0,
    uniqueAuthors: 0,
    totalEngagement: 0,
    avgEngagement: 0,
    posts: [],
    authors: {}
};

// Apify configuration
const APIFY_CONFIG = {
    contentActorId: 'kfiWbq3boy3dWKbiL',
    apiBaseUrl: 'https://api.apify.com/v2'
};

// Cookie template - user's li_at will be inserted
// Using COMPLETE cookie array from working Python script
const getCookieArray = (liAtValue) => [
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154028.478354,
        "hostOnly": false,
        "httpOnly": false,
        "name": "lms_ads",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "AQFqpJug0ZkFJAAAAZwCHbmxN6xfF2RUbZhbkydXmHuX-lh8Ub4bNAFveAxMmm9TG8yW9IpGVUHzAT5N86PM5xIde2Dlh1KI"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1777338028.352159,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_guid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "129ae7f6-79a8-45fd-a31d-0486f2decc26"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1801098379.313855,
        "hostOnly": false,
        "httpOnly": false,
        "name": "bcookie",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "\"v=2&e54d18a5-c177-497e-8ab9-6c60bf330702\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1769563822.390802,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__cf_bm",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "J2wpp1tfi4eJsFV9eNst8SeB1G7xU2uMzkYsF1e9590-1769562022-1.0.1.1-FzKCjEemtemvzdA_nOCI9wWGeIXUtcSWQ22vEPvR08rBsjz76zQBdVBcjFJKtfcJzdRq5XcCcLfS5zYQXBU8SeCaOAVoZedUzn5.INqxAt4"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154028.478401,
        "hostOnly": false,
        "httpOnly": false,
        "name": "lms_analytics",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "AQFqpJug0ZkFJAAAAZwCHbmxN6xfF2RUbZhbkydXmHuX-lh8Ub4bNAFveAxMmm9TG8yW9IpGVUHzAT5N86PM5xIde2Dlh1KI"
    },
    {
        "domain": ".linkedin.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "fptctx2",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": true,
        "storeId": "None",
        "value": "taBcrIH61PuCVH7eNCyH0LNKRXFdWqLJ6b8ywJyet7XNgB9xLQMZyfMfp3XIlWdVSs%252bQmCAIiJ6%252b6dKjBGMoVGZd1s6Lhd9ytyB5MQRDhVhfKnkrwTvRBrtk1svrnMuIzWKSSfgLGzi8O%252ffHMmCP%252f4cm8PMKXgvdYyQ9fyb4EqwozNSC1YDVn%252fa6c7%252bu8tBILxi6EgifB%252flV0J35OHqo6OttIn510e2QxM3PgFdm9od94w9kNW0TTzqBmE%252b06Sp1%252bt9BCWWgWXcdYHJs4N4M%252fDAeaHJr8UGQ65MrT3VvgGqOFKlCztAuVt%252bnmjm4ZZrqKqpF%252bzkxy3%252bxns6QEx399u4IoRnMYbNXkE4Ov8VWCIk%253d"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1801098025.521535,
        "hostOnly": false,
        "httpOnly": true,
        "name": "li_at",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": liAtValue
    },
    {
        "domain": ".linkedin.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "lang",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "None",
        "value": "v=2&lang=en-us"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1769647549.706651,
        "hostOnly": false,
        "httpOnly": false,
        "name": "lidc",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "\"b=OGST02:s=O:r=O:a=O:p=O:g=3724:u=1:x=1:i=1769562379:t=1769647549:v=2:sig=AQG0RRDY5TqhoUjOQT_-IuY4Q37uRTjd\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154028.365223,
        "hostOnly": false,
        "httpOnly": false,
        "name": "AnalyticsSyncHistory",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "AQL0teUTgCnLXwAAAZwCHbkaHoUVILq9AjU9oxG1qCx-Lej3bZDn2VYIwvcjw2gzZgDAiBY4A4z_-6ZfSk8bDA"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1801098378.158563,
        "hostOnly": false,
        "httpOnly": true,
        "name": "bscookie",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "\"v=1&2026012801002105821962-8aa8-4867-8cc3-c2db0d4482dbAQGydB9VRRntWEP6EFWY9JA5yTx8duMh\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1801098029.711202,
        "hostOnly": false,
        "httpOnly": true,
        "name": "dfpfpt",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "93e76e02b4a04298bc18c8a9933bd660"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1777338025.521631,
        "hostOnly": false,
        "httpOnly": false,
        "name": "JSESSIONID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "\"ajax:7160386635290813687\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1777338379.313784,
        "hostOnly": false,
        "httpOnly": false,
        "name": "li_sugr",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "cfbc4abf-f93d-4968-9024-c38b5c2e32d6"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1785110778,
        "hostOnly": false,
        "httpOnly": false,
        "name": "li_theme",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "light"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1785110778,
        "hostOnly": false,
        "httpOnly": false,
        "name": "li_theme_set",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "app"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1777338025.521589,
        "hostOnly": false,
        "httpOnly": false,
        "name": "liap",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "True"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1770771978,
        "hostOnly": false,
        "httpOnly": false,
        "name": "timezone",
        "path": "/",
        "sameSite": "None",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "America/Chicago"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154377.717623,
        "hostOnly": false,
        "httpOnly": true,
        "name": "UserMatchHistory",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "None",
        "value": "AQJOcD-evOyZ-AAAAZwCIw3eZmFkpVw1v6cS5e1U-DoudbFfX0SHZ9mT4iQJfTypPs-UrHK2NqLETRBinhyZmCQW7YOS4itqU-uw7RwCSPo4rrBnl7KloDHOQU7SqprzvFtPbsjk7uYUiSkQnP6wcQwbbXBQSNFHkheeNQKBDJ9znwhMAm8rm5DZQN_AUCD2bmv-82K7jc_y4fd2HcEqrReBwzHAzEAY2eL45u8MBVA13fhmW6kxvam94EQXObAeNdj0H4VnRZlVUwwED_boOweRZ6xAAHtGP39namqm801FhNjiBWgcnVjppQowtc9qazd3pkf-VWrQ5Qduio8VhDoFLbZNIyi8pLVmInaYLHs54QoUdw"
    }
];

// Start auto search
async function startAutoSearch() {
    const token = document.getElementById('apifyToken').value.trim();
    const cookie = document.getElementById('linkedinCookie').value.trim();
    const keywordsText = document.getElementById('searchKeywords').value.trim();
    const maxPosts = parseInt(document.getElementById('maxPosts').value);
    const searchType = document.getElementById('searchType').value;

    // Validation
    if (!token) {
        showError('Please enter your Apify API token');
        return;
    }

    if (!cookie) {
        showError('Please enter your LinkedIn session cookie (li_at)');
        return;
    }

    if (!keywordsText) {
        showError('Please enter at least one search keyword');
        return;
    }

    // Parse keywords
    const keywords = keywordsText.split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);

    if (keywords.length === 0) {
        showError('Please enter valid keywords');
        return;
    }

    // Show loading
    document.getElementById('configPanel').style.display = 'none';
    document.getElementById('loadingState').classList.add('active');
    document.getElementById('errorMessage').classList.remove('active');
    document.getElementById('liveIndicator').textContent = '● SEARCHING...';
    document.getElementById('liveIndicator').style.background = '#f39c12';

    try {
        // Build LinkedIn search URLs
        const searchUrls = keywords.map(keyword => {
            const encodedKeyword = encodeURIComponent(keyword.trim());
            return `https://www.linkedin.com/search/results/${searchType}/?keywords=${encodedKeyword}&origin=GLOBAL_SEARCH_HEADER`;
        });

        console.log('Generated LinkedIn search URLs:', searchUrls);
        updateLoadingStatus(`Searching for ${keywords.length} keywords...`);

        // Start Apify actor
        const run = await startApifyActor(token, cookie, searchUrls, maxPosts);
        
        console.log('Actor run started:', run.id);
        updateLoadingStatus(`Actor started. View at: https://console.apify.com/actors/runs/${run.id}`);
        
        // Wait for completion
        await waitForRunCompletion(token, run.id);
        
        updateLoadingStatus('Fetching results...');
        
        // Get results
        const datasetId = run.defaultDatasetId;
        const data = await fetchDataset(token, datasetId);

        console.log('Fetched', data.length, 'items');
        
        if (!data || data.length === 0) {
            throw new Error('No posts found. Try different keywords or check your LinkedIn cookie.');
        }

        // Process and display
        rawData = data;
        processData(data);
        renderDashboard();

        // Update UI
        document.getElementById('loadingState').classList.remove('active');
        document.getElementById('dashboardContent').classList.add('active');
        document.getElementById('liveIndicator').textContent = '● LIVE DATA';
        document.getElementById('liveIndicator').classList.add('live');

        console.log('✓ Successfully loaded', data.length, 'posts from LinkedIn');

    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to fetch data: ${error.message}`);
        document.getElementById('loadingState').classList.remove('active');
        document.getElementById('configPanel').style.display = 'block';
        document.getElementById('liveIndicator').textContent = '● ERROR';
        document.getElementById('liveIndicator').style.background = '#e74c3c';
    }
}

// Start Apify actor
async function startApifyActor(token, liAtCookie, searchUrls, maxPosts) {
    const url = `${APIFY_CONFIG.apiBaseUrl}/acts/${APIFY_CONFIG.contentActorId}/runs?token=${token}`;
    
    const cookieArray = getCookieArray(liAtCookie);
    
    const input = {
        cookie: cookieArray,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
        urls: searchUrls,
        limitPerSource: Math.max(5, Math.ceil(maxPosts / searchUrls.length)),
        deepScrape: true,
        rawData: false,
        minDelay: 2,
        maxDelay: 8,
        proxy: {
            useApifyProxy: true,
            apifyProxyCountry: "US"
        }
    };

    console.log('Starting actor with', searchUrls.length, 'URLs');

    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(input)
    });

    const responseText = await response.text();

    if (!response.ok) {
        let error;
        try {
            error = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`API Error: ${response.status} - ${responseText}`);
        }
        throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const result = JSON.parse(responseText);
    return result.data;
}

// Wait for actor run to complete
async function waitForRunCompletion(token, runId, maxWaitTime = 300000) {
    const startTime = Date.now();
    const pollInterval = 5000;

    while (Date.now() - startTime < maxWaitTime) {
        const url = `${APIFY_CONFIG.apiBaseUrl}/actor-runs/${runId}?token=${token}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to check run status');
        }

        const result = await response.json();
        const run = result.data;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        
        updateLoadingStatus(`Status: ${run.status} (${elapsed}s elapsed)`);
        console.log('Run details:', run);

        if (run.status === 'SUCCEEDED') {
            return run;
        } else if (run.status === 'FAILED' || run.status === 'ABORTED') {
            // Get detailed error information
            let errorMessage = `Actor run ${run.status.toLowerCase()}.`;
            
            // Try to get error details from the run
            if (run.statusMessage) {
                errorMessage += ` Reason: ${run.statusMessage}`;
            }
            
            // Common error causes
            const commonErrors = [
                '\n\nCommon causes:',
                '1. LinkedIn cookie expired - Get a fresh li_at cookie',
                '2. Invalid Apify token - Check your API token',
                '3. Insufficient Apify credits - Add credits to your account',
                '4. LinkedIn blocked the request - Try again later',
                `5. View detailed logs: https://console.apify.com/actors/runs/${runId}`
            ];
            
            errorMessage += commonErrors.join('\n');
            
            console.error('Actor failed:', run);
            throw new Error(errorMessage);
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Timeout waiting for results. Try with fewer keywords.');
}

// Fetch dataset
async function fetchDataset(token, datasetId) {
    const url = `${APIFY_CONFIG.apiBaseUrl}/datasets/${datasetId}/items?token=${token}&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch results');
    }

    return await response.json();
}

// Process data
function processData(data) {
    console.log('Processing', data.length, 'items');
    
    processedData.posts = data.map(item => {
        const author = item.authorName || 
                      (item.author ? `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim() : '') ||
                      'Unknown';
        
        const authorUrl = item.authorProfileUrl || 
                         (item.author?.publicId ? `https://www.linkedin.com/in/${item.author.publicId}` : '#');
        
        const content = item.text || item.content || '';
        const postUrl = item.url || '#';
        const date = item.postedAtISO || item.postedAt || new Date().toISOString();
        
        const likes = Number(item.numLikes) || Number(item.likes) || 0;
        const comments = Number(item.numComments) || Number(item.comments) || 0;
        const shares = Number(item.numShares) || Number(item.shares) || 0;
        
        return {
            date,
            author,
            authorUrl,
            content,
            postUrl,
            engagement: likes + comments + shares,
            likes,
            comments,
            shares
        };
    });

    // Calculate author stats
    const authorMap = {};
    processedData.posts.forEach(post => {
        if (!authorMap[post.author]) {
            authorMap[post.author] = {
                name: post.author,
                url: post.authorUrl,
                posts: 0,
                totalEngagement: 0
            };
        }
        authorMap[post.author].posts++;
        authorMap[post.author].totalEngagement += post.engagement;
    });

    processedData.authors = authorMap;
    processedData.totalPosts = data.length;
    processedData.uniqueAuthors = Object.keys(authorMap).length;
    
    const totalEng = processedData.posts.reduce((sum, p) => sum + p.engagement, 0);
    processedData.totalEngagement = totalEng;
    processedData.avgEngagement = processedData.posts.length > 0 
        ? Math.round(totalEng / processedData.posts.length) 
        : 0;
}

// Render dashboard
function renderDashboard() {
    document.getElementById('totalPosts').textContent = processedData.totalPosts.toLocaleString();
    document.getElementById('uniqueAuthors').textContent = processedData.uniqueAuthors.toLocaleString();
    document.getElementById('totalEngagement').textContent = processedData.totalEngagement.toLocaleString();
    document.getElementById('avgEngagement').textContent = processedData.avgEngagement.toLocaleString();

    renderCEOSummary();
    renderPostsTable();
    renderAuthorsTable();
}

// Render CEO summary
function renderCEOSummary() {
    const topPosts = [...processedData.posts]
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);

    const topAuthors = Object.values(processedData.authors)
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 3);

    const html = `
        <p style="margin-bottom: 1rem;">
            <strong>Data Loaded:</strong> ${new Date().toLocaleString()} | 
            <span class="badge badge-primary">LIVE FROM LINKEDIN</span>
        </p>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 6px;">
            <h4 style="margin-bottom: 1rem; color: #2c3e50;">Key Insights:</h4>
            <ul style="list-style: none; padding-left: 0;">
                <li style="padding: 0.4rem 0;">→ Found ${processedData.totalPosts} LinkedIn posts matching your keywords</li>
                <li style="padding: 0.4rem 0;">→ ${processedData.uniqueAuthors} unique authors identified</li>
                <li style="padding: 0.4rem 0;">→ ${processedData.totalEngagement.toLocaleString()} total engagement (likes + comments + shares)</li>
                <li style="padding: 0.4rem 0;">→ Top author: ${topAuthors[0]?.name || 'N/A'} (${topAuthors[0]?.totalEngagement || 0} engagement)</li>
                <li style="padding: 0.4rem 0;">→ Most engaging post: ${topPosts[0]?.engagement || 0} interactions</li>
            </ul>
        </div>
    `;

    document.getElementById('ceoSummaryContent').innerHTML = html;
}

// Render posts table
function renderPostsTable() {
    const tbody = document.getElementById('postsTableBody');
    const sortedPosts = [...processedData.posts]
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 50);

    if (sortedPosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No posts found</td></tr>';
        return;
    }

    tbody.innerHTML = sortedPosts.map(post => {
        const date = new Date(post.date);
        const preview = post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '');
        
        return `
            <tr>
                <td>${date.toLocaleDateString()}</td>
                <td>
                    <a href="${escapeHtml(post.authorUrl)}" target="_blank" class="link-button">
                        ${escapeHtml(post.author)}
                    </a>
                </td>
                <td>${escapeHtml(preview)}</td>
                <td>
                    <strong>${post.engagement.toLocaleString()}</strong>
                    <br>
                    <small style="color: #7f8c8d;">
                        👍 ${post.likes} 💬 ${post.comments} 🔄 ${post.shares}
                    </small>
                </td>
                <td>
                    <a href="${escapeHtml(post.postUrl)}" target="_blank" class="link-button">
                        View Post →
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

// Render authors table
function renderAuthorsTable() {
    const tbody = document.getElementById('authorsTableBody');
    const topAuthors = Object.values(processedData.authors)
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 30);

    if (topAuthors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No authors found</td></tr>';
        return;
    }

    tbody.innerHTML = topAuthors.map(author => {
        const avgEngagement = Math.round(author.totalEngagement / author.posts);
        
        return `
            <tr>
                <td><strong>${escapeHtml(author.name)}</strong></td>
                <td>${author.posts}</td>
                <td>${author.totalEngagement.toLocaleString()}</td>
                <td>${avgEngagement.toLocaleString()}</td>
                <td>
                    <a href="${escapeHtml(author.url)}" target="_blank" class="link-button">
                        View Profile →
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

// Use demo data
function useDemoData() {
    document.getElementById('configPanel').style.display = 'none';
    document.getElementById('dashboardContent').classList.add('active');
    document.getElementById('liveIndicator').textContent = '● DEMO MODE';
    document.getElementById('liveIndicator').style.background = '#95a5a6';

    const demoData = generateDemoData();
    rawData = demoData;
    processData(demoData);
    renderDashboard();
}

// Generate demo data
function generateDemoData() {
    const authors = [
        { name: 'Dr. Sarah Chen', url: 'https://linkedin.com/in/demo' },
        { name: 'Michael Rodriguez', url: 'https://linkedin.com/in/demo' },
        { name: 'Dr. James Patterson', url: 'https://linkedin.com/in/demo' },
        { name: 'Lisa Thompson', url: 'https://linkedin.com/in/demo' },
        { name: 'Dr. Amir Patel', url: 'https://linkedin.com/in/demo' }
    ];

    const topics = [
        'UHC just changed prior auth requirements for SCS procedures',
        'Our practice reduced denials by 34% using peer-to-peer strategy',
        'Medicare Advantage LCD changes are creating chaos for SI fusion',
        'Billing staff burnout is real. We lost 2 coders this month',
        'WISeR automation saved our practice 15 hours per week',
        'Aetna denying more interventional procedures lately',
        'Anyone else seeing increased prior auth delays?',
        'Best practices for appealing SCS denials?',
        'New CMS guidelines for pain management procedures',
        'Peer-to-peer calls are taking 2+ hours now'
    ];

    const data = [];
    for (let i = 0; i < 60; i++) {
        const author = authors[Math.floor(Math.random() * authors.length)];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        data.push({
            authorName: author.name,
            authorProfileUrl: author.url,
            text: topic,
            postedAtISO: date.toISOString(),
            numLikes: Math.floor(Math.random() * 500) + 50,
            numComments: Math.floor(Math.random() * 100) + 10,
            numShares: Math.floor(Math.random() * 50),
            url: `https://linkedin.com/posts/demo-${i}`
        });
    }

    return data;
}

// Update loading status
function updateLoadingStatus(message) {
    document.getElementById('loadingStatus').textContent = message;
}

// Show error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    // Use innerHTML to preserve line breaks
    errorDiv.innerHTML = '❌ Error: ' + message.replace(/\n/g, '<br>');
    errorDiv.classList.add('active');
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Reset to configuration panel
function resetToConfig() {
    document.getElementById('dashboardContent').classList.remove('active');
    document.getElementById('configPanel').style.display = 'block';
    document.getElementById('liveIndicator').textContent = '● READY';
    document.getElementById('liveIndicator').classList.remove('live');
    document.getElementById('liveIndicator').style.background = '#95a5a6';
}

// Initialize
console.log('LinkedIn Pain Management Dashboard - Ready');
