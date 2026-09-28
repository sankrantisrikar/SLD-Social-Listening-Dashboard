# Review: ProbePS Social Listening (intern build) and how to make it better

**App:** https://sld-dashboard.onrender.com
**Reviewed:** Sep 28 2026, from the live app and its API (source code not yet available to the reviewer)
**For:** Srikar, Sujith, intern team

## Verdict in one paragraph

The interns built a real pipeline, not a mock-up: six sources with checkpointed sweeps, a five-stage LLM analysis with transparent scoring, a debug view per post, and a clean three-screen UI. That is a strong foundation and should be kept. The problem is aim. It is tuned to find "anyone in U.S. healthcare with a billing complaint", not "pain-management practices Raj garu can call". Of 88 opportunities, 3 are pain-management, none have a practice name, the top-ranked lead is an ambulance service commenting on a 2022 YouTube video, and there is no way to mark a lead as contacted. The next phase should keep the engine and change what it hunts for, then add the workbench Raj garu actually needs, then make it run itself.

## What they built (facts from the live app)

| Area | What exists |
|---|---|
| Sources | AAPC forums (RSS, free), Reddit (Apify), LinkedIn (Apify, 5 query families), Facebook groups (Apify), X accounts (Apify), YouTube comments (Apify). Each source has editable units, sweep depth, cost note, and a checkpoint so "since last sweep" only fetches new posts. |
| Collection | Three modes: since last sweep, custom date range, latest N. Per-source results, warnings, errors, retry button, full job history. |
| Analysis | Five stages: RCM relevance, semantic problem and intent, taxonomy, evidence/confidence, scoring. Outputs per post: speaker type, specialty, opportunity type, seeking level (L0 to L3), stance, problem categories, payer/procedure/denial-reason tags, evidence quote, reasoning, ProbePS fit, and a final score with a weighted breakdown (LLM 65%, RCM 20%, step-3 15%). Versioned (`sld-analysis-opportunity-1`). |
| UI | Overview (KPIs, opportunities over time, category/source/seeking distributions, top 3), All Signals (filterable card grid, 88 results), Data Collection (guided fetch and analyse flow), Pipeline/Debug (raw, normalised and per-stage output for one post). |
| Stack | FastAPI on Render, React/Vite front end, Apify for paid sources. |

## The numbers that matter

| Measure | Value | Why it matters |
|---|---|---|
| Posts collected / analysed | 603 / 514 (89 waiting) | Analysis is not automatic after collection. |
| Opportunities (score ≥ 40) | 88 | The list Raj garu would work from. |
| Opportunities in pain management | 3 of 88 (specialty is empty on 484 of 603 posts) | The product is for interventional pain; the engine does not target it. |
| Opportunities with a practice/organisation name | 0 of 88 | Nothing to look up, call, or email. |
| Opportunities with author role / location | 40 / 28 of 88 | Same problem. |
| Opportunities older than 30 days | 47 of 88 (13 older than 6 months) | Recency barely affects the score. The #1 lead is a March 2026 comment on an October 2022 video. |
| Same person appearing as multiple opportunities | at least 8 authors (one appears 4 times) | Leads should be people or practices, not posts. |
| Opportunities by source | AAPC 35, Facebook 19, X 16, Reddit 8, LinkedIn 5, YouTube 5 | The free forum is the best source; LinkedIn, the one with real names and practices, is the weakest. |
| X collection | Failed on every sweep (Apify actor run FAILED / timeout) | Paying for a source that does not work. |
| Analysis speed | 290 s for 6 posts (48 s per post) | Will not scale to daily volume without batching or a cheaper gate stage. |
| Scheduling | None. Jobs on Sep 24 and Sep 28 only, all manual | "Weekly surveillance" does not exist yet. |
| Authentication | None on the dashboard or the API | Anyone with the URL can trigger paid Apify runs and analyses. Verified: an unauthenticated POST to `/api/analysis/jobs` was accepted (it created empty job #3, harmless). |
| Cost tracking | Cost notes per source, no actual spend per run | No way to answer "what did this week cost?" |

## What to keep

- The checkpointed sweep design and the source configuration UI. This is better than most first versions.
- The five-stage analysis with evidence quotes and reasoning. The transparency (score breakdown, debug view) is exactly what lets us tune it.
- Versioning of analysis and scoring. Keep bumping the version on every change so old scores can be compared.
- AAPC as a source. Free, on-topic, and already the top producer.

## Improvements, ranked

### 1. Aim the engine at the ideal customer (biggest win, mostly config and prompts)

Define the ideal customer profile once and make every stage use it: U.S. interventional pain management practice (or the physician, owner, administrator, or billing lead of one), with a prior-auth, denial, or cash-flow problem, ideally naming a payer or a pain procedure (SCS, RFA, ESI, SI joint fusion, kyphoplasty, Intracept, PNS, facet, genicular).

- Add an explicit **ICP fit** component to the score (suggest 30% of the final) built from: specialty is pain management or the text mentions a pain procedure; speaker is practice-side; role is a decision-maker; U.S. location. Today `probeps_fit` exists but is only 21 "high" out of 514, and specialty is almost never filled.
- Re-point the sources. Drop units that cannot produce pain leads: r/therapists, r/FamilyMedicine, r/MedicalAssistant, behavioural-health content. Add: AAPC forums for pain management and anesthesia (already have anesthesia), r/PainManagement, r/anesthesiology, the ASIPP and SIS community pages if they have feeds, LinkedIn query families built around the pain procedures and payer names, Facebook groups for pain practice management, YouTube channels that teach pain-practice billing.
- Make the stage-1 gate stricter: "RCM relevant" should also require "practice-side speaker" before spending the expensive stages.

### 2. Add the lead workbench (the missing screen)

Raj garu needs a queue, not a chart. Build one screen: **This week's leads**, ranked, each with who, practice, where, why (evidence quote), links, and four buttons: Contacted, Follow up, Not a fit, Note. Store status, note, owner and timestamp per lead. Add tabs for New / Follow up / Contacted / Not a fit. The Overview can stay as the analytics view, but the default landing page should be this queue.

### 3. Turn posts into people and practices

- **Entity resolution:** group posts by author (and by LinkedIn profile URL where present) into one lead. One row per person, with all their posts underneath. This alone removes the duplicate rows.
- **Enrichment:** for physicians, query the free **NPPES NPI Registry API** (`https://npiregistry.cms.hhs.gov/api/`) by name and state. It returns practice name, address, phone, and taxonomy (for example "Pain Medicine"). That converts "ArlesMD on X" into a practice with a phone number, and it also confirms specialty. For LinkedIn authors, an Apify profile fetch gives title, company and location. Store enrichment separately from the post so it can be re-run.
- Show the result on the card: name, role, practice, city/state, NPI match confidence.

### 4. Make recency count

Add a decay to the final score (for example full weight inside 14 days, half at 60 days, quarter beyond 180) and default every list to the last 30 days. Old posts can still be found with a filter, but they should not lead the queue.

### 5. Run it on a schedule and analyse automatically

- Daily sweep (Render Cron Job hitting the collection endpoint, or APScheduler inside the API) followed automatically by analysis of everything pending. Today 89 posts are waiting because nobody clicked "Run SLD Analysis".
- Render's free tier sleeps between requests; a scheduled job will wake it but analysis may exceed the request window. Either move analysis into a background worker (Render background worker, or a queue) or upgrade the instance.
- Send a **daily digest** (email or Slack) with the new leads above a fit threshold. That is how Raj garu should meet the product each morning, not by opening a dashboard.

### 6. Lock it down

- Password or Google login on the dashboard.
- API key (header) required for every POST: collection jobs, analysis jobs, source edits. Read endpoints can stay open for now if the dashboard is behind login, but they expose collected personal posts, so protect them too.
- Rotate the Apify token after doing this, since the open API could have been used to spend it.

### 7. Fix or drop X, and cut Reddit cost

- X has failed on every sweep. Either fix the actor input (per-account runs are timing out) or remove it until it is reliable. Sixteen opportunities came from X, so it is worth one focused attempt.
- Reddit is being fetched through a paid Apify actor. The Arctic Shift archive (`https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=...`) returns the same posts for free with a 30-day window and no key. Use it as the default and keep Apify as fallback.

### 8. Make analysis faster and cheaper

- 48 seconds per post is five sequential LLM calls. Run stage 1 (relevance) with a small, cheap model as a gate; only survivors go through stages 2 to 5. Batch several posts per call for the taxonomy stage. Run posts in parallel (a pool of 5 to 10).
- Log model, tokens and cost per post and per job, and show cost per source on the Data Collection page next to the credit notes.

### 9. Measure quality before tuning further

- Hand-label 200 analysed posts (is it an opportunity? is it pain management? is the speaker practice-side?). Two people label, disagreements resolved in writing.
- Report precision and recall of `is_opportunity` and `probeps_fit = high` for the current version, then for every change. The versioning already in place makes this cheap.

### 10. Small UI fixes that matter

- Opportunity cards show no person, no practice, no location. Put who and where on the first line.
- Add filters for specialty and state, and a "hide seen" toggle.
- Overview: replace "Problem category distribution" with "New leads by fit this week"; the category chart is analytics, not a decision aid.
- The Data Collection page is excellent for operators; keep it, but hide it from Raj garu's view.

## Suggested order (four weeks)

| Week | Do | Result |
|---|---|---|
| 1 | Login + API key; Apify token rotated; scheduler + auto-analysis; X fixed or removed; Reddit moved to the free archive | Runs itself, safely, cheaper |
| 2 | ICP fit score; source units re-pointed to pain; recency decay; stricter stage-1 gate; analysis parallelised | The 88 become a shorter, better list |
| 3 | Entity resolution (one lead per person); NPPES enrichment; lead status, notes, owner; the "This week's leads" screen | Raj garu can work the list |
| 4 | Daily digest email; labelled set of 200 and the first precision/recall report; cost per run on screen | Measurable, and it reaches him without opening the app |

## Questions for the interns

1. Which LLM and which model per stage? What does one full analysis cost per post?
2. Why is `specialty` empty on 80% of posts: is the stage not asked, or does it answer "unknown"?
3. What is the `step3_score` and why does it sit at 55 for most posts?
4. Where is the source code, and can Srikar and Sujith get access this week?
5. Which Apify actors are used for each source, and are any of them using a personal LinkedIn or Facebook session?
