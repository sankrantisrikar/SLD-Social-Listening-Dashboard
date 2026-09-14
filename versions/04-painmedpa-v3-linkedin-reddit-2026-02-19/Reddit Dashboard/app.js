const subredditEl = document.getElementById("subreddit");
const keywordsEl = document.getElementById("keywords");
const sortEl = document.getElementById("sort");
const limitEl = document.getElementById("limit");
const analyzeBtn = document.getElementById("analyzeBtn");
const suggestBtn = document.getElementById("suggestBtn");
const exportBtn = document.getElementById("exportBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const suggestStatusEl = document.getElementById("suggestStatus");
const suggestionsEl = document.getElementById("suggestions");
const listeningStatusEl = document.getElementById("listeningStatus");
const intentBuyingEl = document.getElementById("intentBuying");
const intentProblemEl = document.getElementById("intentProblem");
const intentComparisonEl = document.getElementById("intentComparison");
const intentQuestionEl = document.getElementById("intentQuestion");
const topKeywordsListEl = document.getElementById("topKeywordsList");
const painPointsListEl = document.getElementById("painPointsList");
const opportunityRowsEl = document.getElementById("opportunityRows");

const totalPostsEl = document.getElementById("totalPosts");
const matchesEl = document.getElementById("matches");
const avgScoreEl = document.getElementById("avgScore");
const avgCommentsEl = document.getElementById("avgComments");

let currentRows = [];
const isFileMode = window.location.protocol === "file:";
const apiBase = isFileMode ? "http://127.0.0.1:5173" : "";

if (isFileMode) {
  statusEl.textContent = "Opened via file://. Start `node server.js` and use http://127.0.0.1:5173 for best results.";
}

const parseKeywords = () =>
  keywordsEl.value
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

const parseSuggestionSeeds = () => {
  const rawKeywords = parseKeywords();
  const splitTerms = rawKeywords.flatMap((k) =>
    k
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean)
  );
  return [...new Set([...rawKeywords, ...splitTerms])].slice(0, 12);
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "have",
  "your",
  "about",
  "what",
  "when",
  "where",
  "which",
  "would",
  "there",
  "their",
  "were",
  "just",
  "into",
  "than",
  "then",
  "been",
  "also",
  "need",
  "looking",
  "recommendation"
]);

const PAIN_PATTERNS = [
  "struggling",
  "stuck",
  "problem",
  "issue",
  "hard",
  "difficult",
  "frustrated",
  "confused",
  "doesn't work",
  "not working",
  "too expensive"
];

const INTENT_RULES = {
  buying: ["need", "looking for", "recommend", "buy", "best tool", "solution"],
  problem: ["struggling", "problem", "issue", "stuck", "frustrated", "help"],
  comparison: ["vs", "versus", "alternative", "compare", "better than"],
  question: ["?", "how do i", "anyone", "what is", "can i"]
};

const hasKeywordMatch = (title, selftext, keywords) => {
  if (keywords.length === 0) return false;
  const text = `${title} ${selftext}`.toLowerCase();
  return keywords.some((k) => text.includes(k));
};

const updateStats = (rows) => {
  totalPostsEl.textContent = String(rows.length);
  matchesEl.textContent = String(rows.filter((r) => r.matched).length);
  avgScoreEl.textContent = rows.length
    ? (rows.reduce((sum, row) => sum + row.score, 0) / rows.length).toFixed(1)
    : "0";
  avgCommentsEl.textContent = rows.length
    ? (rows.reduce((sum, row) => sum + row.comments, 0) / rows.length).toFixed(1)
    : "0";
};

const renderListening = (rows) => {
  if (!rows.length) {
    intentBuyingEl.textContent = "0";
    intentProblemEl.textContent = "0";
    intentComparisonEl.textContent = "0";
    intentQuestionEl.textContent = "0";
    topKeywordsListEl.innerHTML = "";
    painPointsListEl.innerHTML = "";
    opportunityRowsEl.innerHTML = "";
    listeningStatusEl.textContent = "Analyze posts to generate social listening insights.";
    return;
  }

  const counters = {
    buying: 0,
    problem: 0,
    comparison: 0,
    question: 0
  };
  const termCounts = new Map();
  const painCounts = new Map();
  const opportunity = new Map();

  for (const row of rows) {
    const content = `${row.title} ${row.selftext || ""}`.toLowerCase();
    for (const key of Object.keys(INTENT_RULES)) {
      const hasIntent = INTENT_RULES[key].some((rule) => content.includes(rule));
      if (hasIntent) counters[key] += 1;
    }

    for (const pattern of PAIN_PATTERNS) {
      if (content.includes(pattern)) {
        painCounts.set(pattern, (painCounts.get(pattern) || 0) + 1);
      }
    }

    const terms = content.match(/\b[a-z][a-z0-9_-]{2,20}\b/g) || [];
    for (const term of terms) {
      if (STOPWORDS.has(term)) continue;
      termCounts.set(term, (termCounts.get(term) || 0) + 1);
    }

    const signal = row.matched ? "High" : row.comments > 10 ? "Medium" : "Low";
    const key = row.matched ? "Keyword-led demand" : row.comments > 10 ? "High discussion threads" : "Emerging chatter";
    if (!opportunity.has(key)) {
      opportunity.set(key, { label: key, posts: 0, signal });
    }
    opportunity.get(key).posts += 1;
  }

  const topTerms = [...termCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const topPains = [...painCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const topOpportunities = [...opportunity.values()].sort((a, b) => b.posts - a.posts);

  intentBuyingEl.textContent = String(counters.buying);
  intentProblemEl.textContent = String(counters.problem);
  intentComparisonEl.textContent = String(counters.comparison);
  intentQuestionEl.textContent = String(counters.question);

  topKeywordsListEl.innerHTML = topTerms
    .map(([term, count]) => `<li>${escapeHtml(term)} (${count})</li>`)
    .join("");
  painPointsListEl.innerHTML = topPains.length
    ? topPains.map(([term, count]) => `<li>${escapeHtml(term)} (${count})</li>`).join("")
    : "<li>No strong pain-point phrases detected.</li>";
  opportunityRowsEl.innerHTML = topOpportunities.length
    ? topOpportunities
        .map(
          (item) =>
            `<tr><td>${escapeHtml(item.label)}</td><td>${item.posts}</td><td>${escapeHtml(item.signal)}</td></tr>`
        )
        .join("")
    : "<tr><td colspan=\"3\">No opportunities detected.</td></tr>";

  listeningStatusEl.textContent = `Generated listening insights from ${rows.length} posts.`;
};

const renderRows = (rows) => {
  if (rows.length === 0) {
    resultsEl.innerHTML = `
      <tr>
        <td colspan="7">No posts found for this query.</td>
      </tr>
    `;
    return;
  }

  resultsEl.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.title)}</td>
        <td><code>u/${escapeHtml(row.author)}</code></td>
        <td>${escapeHtml(row.subreddit)}</td>
        <td>${row.score}</td>
        <td>${row.comments}</td>
        <td>
          <span class="tag ${row.matched ? "hit" : "nohit"}">
            ${row.matched ? "Match" : "No match"}
          </span>
        </td>
        <td><a href="${row.url}" target="_blank" rel="noreferrer">Open</a></td>
      </tr>
    `
    )
    .join("");
};

const buildCsv = (rows) => {
  const head = ["title", "author", "subreddit", "score", "comments", "matched", "url"];
  const csvRows = [head.join(",")];
  for (const row of rows) {
    const cols = [
      row.title,
      row.author,
      row.subreddit,
      row.score,
      row.comments,
      row.matched,
      row.url
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`);
    csvRows.push(cols.join(","));
  }
  return csvRows.join("\n");
};

const exportCsv = () => {
  if (!currentRows.length) {
    statusEl.textContent = "Nothing to export yet.";
    return;
  }
  const csv = buildCsv(currentRows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reddit-leads-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const renderSuggestions = (suggestions) => {
  if (!suggestions.length) {
    suggestionsEl.innerHTML = "";
    suggestStatusEl.textContent = "No subreddit suggestions found for these keywords.";
    return;
  }
  suggestionsEl.innerHTML = suggestions
    .map(
      (item) =>
        `<button class="chip" data-subreddit="${escapeHtml(item.name)}" title="${escapeHtml(
          item.reason || "Suggested"
        )}">r/${escapeHtml(item.name)}</button>`
    )
    .join("");
  suggestStatusEl.textContent = `Found ${suggestions.length} suggestions. Click one to set subreddit.`;
};

const fetchSuggestions = async () => {
  const seeds = parseSuggestionSeeds();
  if (!seeds.length) {
    suggestionsEl.innerHTML = "";
    suggestStatusEl.textContent = "Enter keywords to get subreddit suggestions.";
    return;
  }

  suggestBtn.disabled = true;
  suggestStatusEl.textContent = "Finding subreddit suggestions...";

  try {
    const endpoint = `${apiBase}/api/suggest-subreddits?keywords=${encodeURIComponent(seeds.join(","))}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    const suggestions = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
    renderSuggestions(suggestions.slice(0, 20));
  } catch (error) {
    suggestionsEl.innerHTML = "";
    suggestStatusEl.textContent = `Suggestion fetch failed: ${error.message}`;
  } finally {
    suggestBtn.disabled = false;
  }
};

const fetchPosts = async () => {
  const subreddit = subredditEl.value.trim().replace(/^r\//i, "");
  if (!subreddit) {
    statusEl.textContent = "Enter a subreddit first.";
    return;
  }

  analyzeBtn.disabled = true;
  statusEl.textContent = "Loading posts from Reddit...";

  const sort = sortEl.value;
  const limit = Number(limitEl.value);
  const keywords = parseKeywords();

  try {
    const endpoint = `${apiBase}/api/reddit?subreddit=${encodeURIComponent(subreddit)}&sort=${encodeURIComponent(
      sort
    )}&limit=${limit}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          message = `${message} - ${errData.error}`;
        }
        if (errData?.detail) {
          message = `${message} (${errData.detail})`;
        }
      } catch (_ignored) {}
      throw new Error(message);
    }

    const payload = await response.json();
    const children = payload?.data?.children ?? [];
    const rows = children.map((item) => {
      const data = item.data || {};
      const url = data.permalink
        ? `https://www.reddit.com${data.permalink}`
        : `https://www.reddit.com/r/${subreddit}`;

      return {
        title: data.title || "",
        author: data.author || "unknown",
        subreddit: data.subreddit || subreddit,
        score: data.score || 0,
        comments: data.num_comments || 0,
        selftext: data.selftext || "",
        matched: hasKeywordMatch(data.title || "", data.selftext || "", keywords),
        url
      };
    });

    rows.sort((a, b) => Number(b.matched) - Number(a.matched) || b.score - a.score);

    currentRows = rows;
    updateStats(rows);
    renderListening(rows);
    renderRows(rows);
    statusEl.textContent = `Loaded ${rows.length} posts from r/${subreddit}.`;
  } catch (error) {
    statusEl.textContent = `Request failed: ${error.message}`;
    currentRows = [];
    updateStats([]);
    renderListening([]);
    renderRows([]);
  } finally {
    analyzeBtn.disabled = false;
  }
};

analyzeBtn.addEventListener("click", fetchPosts);
suggestBtn.addEventListener("click", fetchSuggestions);
exportBtn.addEventListener("click", exportCsv);

keywordsEl.addEventListener("change", fetchSuggestions);
suggestionsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const selected = target.dataset.subreddit;
  if (!selected) return;
  subredditEl.value = selected;
  statusEl.textContent = `Selected r/${selected}. Click Analyze to load posts.`;
});
