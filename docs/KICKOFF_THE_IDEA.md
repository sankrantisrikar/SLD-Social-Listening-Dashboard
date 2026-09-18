# SLD Kickoff: The Idea

**Project:** Social Listening Dashboard (SLD)
**Purpose:** find new clients for PainMed-PA
**User:** Raj garu, and only Raj garu
**Team:** PainMed-PA interns, with Sujith
**From:** Srikar
**This week's job:** design the dashboard, find the sources, work out how to get the data. No dashboard code.

---

## The idea in one paragraph

PainMed-PA sells prior-authorization and billing services to U.S. interventional pain management practices. The practices that need us most are the ones drowning in prior auth denials, payer paperwork and unpaid claims. Many of them say so in public: a physician venting on LinkedIn about UnitedHealthcare denying spinal cord stimulator cases, a practice manager on Reddit asking how others handle Aetna prior auths, a billing lead complaining about Medicare rule changes. **Every one of those posts is a potential client telling us they have the problem we solve. We want a dashboard that finds those people, tells Raj garu who they are and why they are a fit, and gives him a short, ranked list of whom to reach out to each week.**

## Who the user is

**Raj garu.** He is the only user. He will not run scripts or configure anything. He wants to open the dashboard and see: who should I contact this week, why, and how do I reach them.

Everything you design should be judged by one question: does this help Raj garu pick up the phone or send a message to the right person?

## What a lead looks like

We think a good lead is a **person or practice** where we can see:

- **Who:** name, role (physician, practice owner, administrator, billing manager), practice name, location.
- **What they said:** the post, with a link to the original.
- **Why they are a fit:** a prior auth or billing pain point, ideally naming a payer or a procedure we handle (spinal cord stimulators, SI joint fusion, kyphoplasty, Intracept, radiofrequency ablation, epidurals, and so on).
- **How warm:** how recent, how strongly worded, how much engagement, whether they are a decision-maker.
- **How to reach them:** profile link, practice website, whatever is public.

This is our first guess at a lead. You should refine it.

## Where these people talk (starting list, not the answer)

LinkedIn (posts, comments, groups) · Reddit (r/medicalbilling, r/CodingandBilling, r/ChronicPain, r/medicine, others) · X · YouTube comments · practice-management and pain-society forums · trade press comment sections · conference hashtags.

LinkedIn is probably the richest, because people post under their real name, role and practice. Our plan is to use **Apify** actors with a company API key to collect from LinkedIn and possibly other platforms. We expect you to find sources we have not thought of.

## Your task this week

Three things, and they feed each other. Come back on **Friday** with your own answers.

### 1. Design the dashboard for Raj garu

You decide what it looks like. Bring **two or three concepts** as sketches, wireframes or slides, genuinely different from each other. For each concept, answer:

- What does Raj garu see first when he opens it?
- How is a lead shown? What makes one lead rank above another?
- How does he mark a lead as contacted, not a fit, or follow up later?
- What does "this week" look like versus "everything we have found"?

### 2. Find the sources

Start from our list, then go beyond it. Where do pain physicians, practice owners, administrators and billing managers actually talk about prior auth, denials and payers? For every candidate, show **real examples** of posts by people who look like leads, and say honestly whether the volume is worth the effort.

### 3. Work out how to get the data from each source

We already plan to use Apify. Learn it: which actors exist for LinkedIn post search, profile scraping, Reddit, X and so on, what each one needs as input, what it returns, and what it costs. Then fill in a source sheet for every source that makes your list:

| Question | What we need to know |
|---|---|
| Access path | Apify actor (which one), official API, RSS feed, or nothing usable |
| Authentication | Apify key only, or does the actor also need platform credentials? If so, which, and is that acceptable? |
| What you can ask for | Search by keyword? By community? By person? Historical or only recent? |
| What comes back | Fields: text, author name, role, company, location, date, engagement, link |
| Limits | Rate limits, quotas, maximum history |
| Cost | Price at roughly 1,000 to 5,000 posts a month |
| Terms of use | What the platform allows you to collect and store. Quote the relevant clause |
| Reliability | How likely is this to still work in three months? |
| Sample pull | A small script that fetched real data, and a few rows of what it returned |
| Verdict | Green (use it), yellow (usable with caveats), red (do not use), and why |

Srikar will provide the Apify API key from the company account. Never register apps or run actors under a personal account, and never use anyone's personal login or browser cookie.

### Bring to Friday

A presentation of roughly 20 minutes, then discussion: the dashboard concepts, your definition of a lead and how to rank one, the source list with real examples, the source sheets with verdicts, and your open questions. Slides, a Figma board, a spreadsheet, a whiteboard photo, all fine.

## Ground rules

- **No dashboard code this week.** Small scripts to test Apify or an API are fine, and encouraged.
- **Public data only.** Nothing behind a login, nothing patient-related.
- **Never use personal accounts, passwords or browser cookies for data collection**, now or later.
- **Ask questions.** Srikar and Sujith are available all week.

## Questions to think with

- If you were Raj garu, what would make you trust a lead enough to contact them?
- What would a bad lead cost him? What would a missed great lead cost?
- How do we tell a decision-maker from someone just complaining?
- How do we avoid showing him the same person twice?
- If a source has no API, is it worth a workaround, or should we drop it?

## What happens after Friday

Once you have presented, we will show you the work that already exists on this problem, compare it with your ideas, and agree the direction together. You have 13 weeks. This week is about making sure we build the right thing for Raj garu.
