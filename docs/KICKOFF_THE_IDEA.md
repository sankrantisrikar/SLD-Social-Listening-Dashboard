# SLD Kickoff — The Idea

**Project:** Social Listening Dashboard (SLD) for pain management practices
**Team:** PainMed-PA interns, with Sujith
**From:** Srikar
**This week's job:** design the dashboard, find the sources, work out how to get the data. No dashboard code.

---

## The idea in one paragraph

PainMed-PA helps U.S. interventional pain management practices get paid: prior authorizations, claims, denials, appeals. The people running those practices are constantly surprised. An insurer quietly tightens the rules for a procedure, denials climb for six weeks, and only then does anyone notice. But the early warning is already out there, in public: doctors and billers complaining on LinkedIn, patients and staff asking questions on Reddit, industry news, YouTube explainers, posts on X. **We want to build a system that listens to those public conversations, understands what they are about, and turns them into a dashboard and alerts that a practice can act on before the problem shows up in their own numbers.**

## Why it matters

Three things a practice cannot see well today:

1. **Payer behaviour.** UnitedHealthcare, Aetna, Cigna, Blue Cross plans, Humana, Medicare. When one of them changes coverage or prior-auth rules for a procedure, who is talking about it, and how early?
2. **Procedure and device trends.** Spinal cord stimulators, SI joint fusion, kyphoplasty, Intracept, peripheral nerve stimulation, radiofrequency ablation, epidurals. Which ones are getting harder to get paid for?
3. **Policy shifts.** CMS programs, Local Coverage Determinations, payer clinical policy bulletins. What changed this week?

## Who would use it

- A **practice owner or CEO** who wants a five-minute weekly read.
- A **billing / revenue-cycle manager** who wants to see trends by payer and procedure and click through to the actual posts.
- **PainMed-PA's own account team**, who want evidence for client conversations.

These are guesses. Part of your research is to challenge them.

## Where the conversations happen (starting list, not the answer)

LinkedIn · Reddit (r/ChronicPain, r/medicalbilling, r/CodingandBilling, others) · X · YouTube · industry news and trade press · payer and CMS policy pages.

This list is where we started. We expect you to find sources we have not thought of.

## Your task this week

Three things, and they feed each other. Come back on **Friday** with your own answers.

### 1. Design the dashboard

You decide what it is. Who is it for, what is on the screen, and what decision does it help them make? Bring **two or three concepts** as sketches, wireframes or slides. Make them genuinely different, not one layout in three colours. For each concept, say what a "signal" is: the event the dashboard surfaces, defined concretely enough that we could compute it.

### 2. Find the sources

Start from our list, then go beyond it. Where do pain physicians, billers, practice managers and patients actually talk about payers, denials and procedures? Forums, newsletters, podcasts, trade press comment sections, professional communities, government feeds, payer bulletin pages. For every candidate, show **real examples** of relevant posts or articles you found, and say honestly whether the volume is worth the effort.

### 3. Work out how to get the data from each source

For every source that makes your list, fill in a source sheet:

| Question | What we need to know |
|---|---|
| Access path | Official API, RSS feed, third-party service (for example Apify), or nothing usable |
| Authentication | API key, OAuth app, developer account approval, none |
| What you can ask for | Search by keyword? By community? Historical or only recent? |
| What comes back | Fields: text, author, date, engagement, link |
| Limits | Rate limits, quotas, maximum history |
| Cost | Free tier, and the price at roughly 1,000 to 5,000 posts a month |
| Terms of use | What the platform allows you to collect and store. Quote the relevant clause |
| Reliability | How likely is this to still work in three months? |
| Sample pull | A small script that fetched real data, and a few rows of what it returned |
| Verdict | Green (use it), yellow (usable with caveats), red (do not use), and why |

Register any developer apps under a PainMed-PA account or a fresh account made for this project, never a personal one.

### Bring to Friday

A presentation of roughly 20 minutes, then discussion: the dashboard concepts and signal definitions, the source list with examples, the source sheets with verdicts, and your open questions. Slides, a Figma board, a spreadsheet, a whiteboard photo, all fine.

## Ground rules

- **No dashboard code this week.** Small scripts to test an API are fine, and encouraged.
- **Public data only.** Nothing behind a login, nothing personal, nothing patient-related.
- **Never use personal accounts, passwords or browser cookies for data collection**, now or later. Official APIs and developer apps only.
- **Ask questions.** Srikar and Sujith are available all week.

## Guiding questions

- If you were a billing manager at a pain practice, what would make you open this dashboard every Monday?
- What would a false alarm cost, and what would a missed signal cost?
- What can we know from public posts that a practice cannot already see in its own claims data?
- What would make this useful in week one, before there is much history?
- If a source has no API, is it worth a workaround, or should we drop it?

## What happens after Friday

Once you have presented, we will show you the work that already exists on this problem, compare it with your ideas, and agree the direction together. You have 13 weeks. This week is about making sure we build the right thing.
