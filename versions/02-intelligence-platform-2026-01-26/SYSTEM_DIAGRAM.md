# System Architecture Diagram

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        PAIN MANAGEMENT INTELLIGENCE                         │
│                         Social Listening Platform                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                               │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Platform Selector                               │  │
│  │  ☐ LinkedIn  ☐ X/Twitter  ☐ Reddit  ☐ YouTube  ☐ News/Policy      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                    ┌─────────────────┴─────────────────┐                   │
│                    ▼                                   ▼                    │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │      Unified Dashboard          │  │      AI Chat Assistant          │ │
│  │  • CEO Summary                  │  │  • Natural Language Q&A         │ │
│  │  • Key Metrics                  │  │  • Platform-Scoped Responses    │ │
│  │  • Trend Charts                 │  │  • Confidence Scoring           │ │
│  │  • Spike Detection              │  │  • Actionable Insights          │ │
│  │  • Sentiment Analysis           │  │  • Data Attribution             │ │
│  └─────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA PROCESSING LAYER                                │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Aggregation  │  │  NLP Engine  │  │  Analytics   │  │  AI Engine   │  │
│  │   Service    │  │  (Sentiment) │  │    Engine    │  │   (GPT-4)    │  │
│  │              │  │              │  │              │  │              │  │
│  │ • Normalize  │  │ • Sentiment  │  │ • Metrics    │  │ • Q&A        │  │
│  │ • Dedupe     │  │ • Topics     │  │ • Trends     │  │ • Insights   │  │
│  │ • Enrich     │  │ • Entities   │  │ • Spikes     │  │ • Summary    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION LAYER                                 │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │LinkedIn  │  │ Twitter  │  │  Reddit  │  │ YouTube  │  │   News   │   │
│  │Connector │  │Connector │  │Connector │  │Connector │  │Connector │   │
│  │          │  │          │  │          │  │          │  │          │   │
│  │ Apify    │  │Twitter   │  │ Reddit   │  │ YouTube  │  │   RSS    │   │
│  │ Actor    │  │   API    │  │   API    │  │   API    │  │  Scraper │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA STORAGE LAYER                                  │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Raw Data   │  │  Processed   │  │  Analytics   │  │     Cache    │  │
│  │    Store     │  │  Data Store  │  │    Store     │  │    (Redis)   │  │
│  │              │  │              │  │              │  │              │  │
│  │  MongoDB     │  │ PostgreSQL   │  │Elasticsearch │  │  • Metrics   │  │
│  │  • Posts     │  │ • Normalized │  │ • Full-text  │  │  • Trends    │  │
│  │  • Comments  │  │ • Enriched   │  │ • Aggregated │  │  • Queries   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   USER      │
│  Selects    │
│ Platforms   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    INGESTION TRIGGER                        │
│  For each selected platform:                                │
│  1. Fetch data from API/Scraper                            │
│  2. Store in Raw Data Store                                │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA PROCESSING                           │
│  1. Normalize to canonical schema                          │
│  2. NLP enrichment (sentiment, topics, entities)           │
│  3. Quality scoring                                        │
│  4. Store in Processed Data Store                          │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   ANALYTICS ENGINE                          │
│  1. Calculate metrics (volume, engagement, etc.)           │
│  2. Detect anomalies (spikes)                              │
│  3. Generate trends                                        │
│  4. Identify influencers                                   │
│  5. Cache results                                          │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│  1. Render dashboard with visualizations                   │
│  2. Enable AI chat queries                                 │
│  3. Apply filters                                          │
│  4. Show platform attribution                              │
└─────────────────────────────────────────────────────────────┘
```

## AI Chat Flow

```
┌─────────────┐
│    USER     │
│   Asks      │
│  Question   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   QUERY PROCESSOR                           │
│  1. Parse question                                         │
│  2. Identify intent                                        │
│  3. Extract entities (topics, payers, procedures)          │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA RETRIEVAL                            │
│  1. Query processed data store                             │
│  2. Filter by active platforms                             │
│  3. Filter by time range                                   │
│  4. Filter by entities                                     │
│  5. Rank by relevance                                      │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI GENERATION                             │
│  1. Build context from retrieved data                      │
│  2. Generate prompt for LLM                                │
│  3. Call GPT-4/Claude API                                  │
│  4. Parse response                                         │
│  5. Calculate confidence                                   │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESPONSE FORMATTING                       │
│  1. Structure response                                     │
│  2. Add supporting data                                    │
│  3. Add platform attribution                               │
│  4. Add confidence level                                   │
│  5. Add actionable implications                            │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    USER     │
│  Receives   │
│   Answer    │
└─────────────┘
```

## Platform Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLATFORM CONNECTORS                          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   LinkedIn   │      │   Twitter    │      │    Reddit    │
│   Connector  │      │   Connector  │      │   Connector  │
├──────────────┤      ├──────────────┤      ├──────────────┤
│              │      │              │      │              │
│ • Apify API  │      │ • Twitter    │      │ • Reddit     │
│ • Cookie     │      │   API v2     │      │   API        │
│   Auth       │      │ • Bearer     │      │ • OAuth 2.0  │
│ • Posts      │      │   Token      │      │ • Posts      │
│ • Comments   │      │ • Tweets     │      │ • Comments   │
│ • Profiles   │      │ • Threads    │      │ • Subreddits │
│              │      │ • Replies    │      │ • Votes      │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                             ▼
                  ┌──────────────────┐
                  │   Normalization  │
                  │     Service      │
                  └──────────────────┘
                             │
                             ▼
                  ┌──────────────────┐
                  │  Canonical Data  │
                  │     Schema       │
                  └──────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION ENVIRONMENT                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Load Balancer   │
                    │   (AWS ALB)      │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │  Web Servers │          │  API Servers │
        │  (3 nodes)   │          │  (5 nodes)   │
        │              │          │              │
        │ • Static UI  │          │ • REST API   │
        │ • CDN Cache  │          │ • GraphQL    │
        └──────────────┘          └──────┬───────┘
                                         │
                        ┌────────────────┴────────────────┐
                        │                                 │
                        ▼                                 ▼
                ┌──────────────┐                  ┌──────────────┐
                │ Worker Pool  │                  │ Data Stores  │
                │ (10 workers) │                  │              │
                │              │                  │ • PostgreSQL │
                │ • Ingestion  │                  │ • MongoDB    │
                │ • Processing │                  │ • Redis      │
                │ • Analytics  │                  │ • ES         │
                └──────────────┘                  └──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Network      │      │ Application  │      │ Data         │
│ Security     │      │ Security     │      │ Security     │
├──────────────┤      ├──────────────┤      ├──────────────┤
│              │      │              │      │              │
│ • Firewall   │      │ • Auth       │      │ • Encryption │
│ • WAF        │      │   (JWT)      │      │   at Rest    │
│ • DDoS       │      │ • RBAC       │      │ • Encryption │
│   Protection │      │ • Rate       │      │   in Transit │
│ • VPC        │      │   Limiting   │      │ • PII        │
│ • Security   │      │ • Input      │      │   Isolation  │
│   Groups     │      │   Validation │      │ • Audit      │
│              │      │ • CORS       │      │   Logging    │
└──────────────┘      └──────────────┘      └──────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING STACK                             │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Metrics      │      │ Logs         │      │ Traces       │
├──────────────┤      ├──────────────┤      ├──────────────┤
│              │      │              │      │              │
│ • Datadog    │      │ • CloudWatch │      │ • Datadog    │
│ • Prometheus │      │ • ELK Stack  │      │   APM        │
│ • Grafana    │      │ • Splunk     │      │ • Jaeger     │
│              │      │              │      │              │
│ • CPU/Memory │      │ • App Logs   │      │ • Request    │
│ • API        │      │ • Error Logs │      │   Tracing    │
│   Latency    │      │ • Audit Logs │      │ • Dependency │
│ • DB Queries │      │ • Access     │      │   Mapping    │
│ • Queue      │      │   Logs       │      │              │
│   Depth      │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Alert Manager   │
                    │                  │
                    │ • PagerDuty      │
                    │ • Slack          │
                    │ • Email          │
                    └──────────────────┘
```

## Scalability Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCALING STRATEGY                             │
└─────────────────────────────────────────────────────────────────┘

HORIZONTAL SCALING (Add More Nodes)
────────────────────────────────────
Web Servers:     3 → 10 nodes (auto-scaling)
API Servers:     5 → 20 nodes (auto-scaling)
Workers:        10 → 50 nodes (queue-based)

VERTICAL SCALING (Bigger Nodes)
────────────────────────────────
Database:       t3.large → r5.2xlarge
Redis:          t3.medium → r5.xlarge
Elasticsearch:  t3.medium → r5.xlarge

DATA PARTITIONING
─────────────────
By Platform:    Separate tables per platform
By Time:        Monthly partitions
By Region:      Geographic sharding (future)

CACHING STRATEGY
────────────────
L1 Cache:       In-memory (Node.js)
L2 Cache:       Redis (5 min TTL)
L3 Cache:       CDN (static assets)

LOAD DISTRIBUTION
─────────────────
Read Replicas:  3 PostgreSQL read replicas
Write Master:   1 PostgreSQL write master
Queue:          RabbitMQ cluster (3 nodes)
```

---

**Legend**:
- `│` = Data flow
- `▼` = Direction of flow
- `┌─┐` = Component boundary
- `├─┤` = Sub-component

**Version**: 1.0 | **Last Updated**: January 25, 2026
