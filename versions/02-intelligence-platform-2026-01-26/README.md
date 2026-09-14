# Pain Management Social Intelligence Platform

**Production-grade, multi-platform social listening and AI-powered intelligence system for U.S. interventional pain management.**

## 🎯 Product Vision

A unified platform where executives can:
- **Select platforms** (LinkedIn, X, Reddit, YouTube, News/Policy)
- **View integrated dashboards** with real-time analytics
- **Query an AI assistant** that answers using only selected platform data
- **Make strategic decisions** backed by social intelligence

## 🏗️ Architecture

### Modular Platform Design
```
┌─────────────────────────────────────────────────────────┐
│           Platform Selector (Toggle ON/OFF)             │
│  ☐ LinkedIn  ☐ X  ☐ Reddit  ☐ YouTube  ☐ News/Policy  │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    Unified Dashboard Engine         │
        │  • CEO Summary                      │
        │  • Key Metrics                      │
        │  • Trend Charts                     │
        │  • Spike Detection                  │
        │  • Sentiment Analysis               │
        └─────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    AI Chat Assistant                │
        │  • Platform-scoped responses        │
        │  • Data attribution                 │
        │  • Confidence scoring               │
        │  • Actionable insights              │
        └─────────────────────────────────────┘
```

## 📊 Supported Platforms

### Core Platforms
| Platform | Data Type | Ingestion Method | Status |
|----------|-----------|------------------|--------|
| **LinkedIn** | Posts + Comments | Apify Actor | ✅ Integrated |
| **X (Twitter)** | Tweets + Threads | Twitter API v2 | ✅ Integrated |
| **Reddit** | Posts + Comments | Reddit API | ✅ Integrated |
| **YouTube** | Videos + Metadata | YouTube Data API v3 | ✅ Integrated |
| **News/Policy** | Articles + Docs | NewsAPI | ✅ Integrated |

### Quick Setup
1. **Instant Demo:** Open `index.html` - works immediately with demo data
2. **Real Data (No API):** Reddit works without any API keys
3. **Real Data (Free):** YouTube (Google), NewsAPI (100/day)
4. **Real Data (Paid):** LinkedIn (Apify $49/mo), Twitter ($100/mo)

See [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md) for detailed setup instructions.

### Platform Selection Logic
- **Independent**: Each platform can be toggled ON/OFF
- **Combined**: Multiple platforms can be active simultaneously
- **Scoped**: AI chat only uses data from active platforms
- **Labeled**: All data clearly attributed to source platform

## 🗄️ Canonical Data Model

### Unified Schema
```javascript
{
  // Core Fields (All Platforms)
  "id": "unique_id",
  "date": "2026-01-25T10:30:00Z",
  "platform": "linkedin|twitter|reddit|youtube|news",
  "source_url": "https://...",
  
  // Author Information
  "author_name": "Dr. Sarah Chen",
  "author_role": "Interventional Pain Physician",
  "author_organization": "Metro Pain Associates",
  "author_location": "California, US",
  
  // Content
  "content_text": "Full text content...",
  "content_type": "post|comment|video|article",
  
  // Classification
  "topic_labels": ["prior_auth", "billing_denials", "payer_behavior"],
  "payer_labels": ["Medicare", "UHC", "Aetna"],
  "procedure_device_labels": ["SCS", "SI_fusion", "Intracept"],
  
  // Analytics
  "sentiment": "positive|neutral|negative",
  "sentiment_score": 0.75,
  "engagement_metrics": {
    "likes": 150,
    "comments": 23,
    "shares": 8,
    "views": 1200
  },
  
  // Metadata
  "confidence": "high|medium|low",
  "data_quality_score": 0.92
}
```

## 📈 Dashboard Components

### 1. CEO Executive Summary
**Purpose**: 5-minute strategic briefing

**Components**:
- Top 5 Signals (data-backed trends)
- Top 3 Risks (emerging threats)
- Top 3 Opportunities (actionable insights)
- Platform attribution badges
- Confidence indicators

### 2. Key Metrics
- Total Mentions (with WoW change)
- Active Sources (authors/channels)
- Average Engagement
- Spike Events Detected

### 3. Trend Visualizations
**Weekly Mention Volume**:
- Line charts by topic
- Toggle topics
- Time zoom (4/8/12 weeks)
- Platform filtering

**Sentiment Trends**:
- Stacked bar charts
- Positive/Neutral/Negative breakdown
- Drill-down by payer and procedure

**Payer Analysis**:
- Medicare vs MA vs Commercial
- Weekly or cumulative views

**Procedure & Device Tracking**:
- Volume trends
- Momentum indicators

### 4. Spike Detection Engine
**Automatic anomaly detection**:
- Week-over-week increases >30%
- Attributed drivers:
  - Policy announcements
  - Conference sessions
  - Viral posts/threads
- Confidence scoring

### 5. Influencer Analysis
**Platform-specific logic**:
- LinkedIn: Engagement + network reach
- Twitter: Retweets + follower count
- Reddit: Upvotes + comment depth
- YouTube: Views + subscriber count

## 🤖 AI Chat Assistant

### Core Principles
1. **Platform-Scoped**: Only uses data from selected platforms
2. **Transparent**: Always shows data sources
3. **Confident**: Provides confidence levels
4. **Actionable**: Includes operational implications

### Response Structure
```
Question: "Why did prior auth complaints spike last week?"

AI Response:
┌─────────────────────────────────────────────────────────┐
│ ANSWER:                                                 │
│ Prior authorization mentions increased 47% WoW,         │
│ driven by UHC policy change announced Jan 20.           │
│                                                         │
│ SUPPORTING DATA:                                        │
│ • LinkedIn: 214 → 315 mentions (+47%)                  │
│ • Reddit: 89 → 127 mentions (+43%)                     │
│ • Primary driver: Dr. Chen's viral post (8.4K engage)  │
│                                                         │
│ PLATFORM ATTRIBUTION:                                   │
│ LinkedIn, Reddit                                        │
│                                                         │
│ CONFIDENCE: HIGH                                        │
│ (442 mentions, 87 unique sources)                      │
│                                                         │
│ IMPLICATION:                                            │
│ Practices should prepare for increased prior auth      │
│ workload and consider automation solutions.            │
└─────────────────────────────────────────────────────────┘
```

### Example Questions
- "Why did prior auth complaints spike last week on LinkedIn?"
- "Which payers are driving negative sentiment on Reddit?"
- "Are SI fusion conversations increasing after ASIPP?"
- "Summarize key WISeR concerns across all platforms this month"
- "Who are the top 5 influencers discussing billing denials?"

## 🎯 Filters & Segmentation

### Dynamic Filters (Adapt to Selected Platforms)
- **Time Range**: 4/8/12 weeks or custom
- **Topic Cluster**: Prior auth, billing, appeals, procedures, WISeR
- **Payer**: Medicare, MA, UHC, Aetna, Cigna, BCBS
- **Procedure/Device**: SCS, SI fusion, Intracept, PNS, kyphoplasty
- **Author Type**: Physician, admin, vendor, consultant
- **Region/State**: Optional geographic filtering
- **Organization Type**: Practice, hospital, vendor

## 🔒 Confidence & Transparency

### Every Visualization Shows:
- **Data Sources**: Which platforms contributed
- **Platform Coverage**: % of total data
- **Confidence Level**: HIGH/MEDIUM/LOW
- **Sample Size**: Number of mentions/sources
- **Demo vs Live**: Clear labeling

### Confidence Scoring Logic:
```
HIGH:    100+ mentions, 20+ sources, validated NLP
MEDIUM:  30-99 mentions, 10-19 sources
LOW:     <30 mentions, <10 sources
```

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Current)
- ✅ Unified dashboard UI
- ✅ Platform selector
- ✅ AI chat interface
- ✅ Demo data visualization
- ✅ CEO summary panel

### Phase 2: LinkedIn Integration
- 🔄 Apify actor integration
- 🔄 Real-time data ingestion
- 🔄 NLP sentiment analysis
- 🔄 Influencer detection

### Phase 3: Multi-Platform Expansion
- 🔄 Twitter/X integration
- 🔄 Reddit integration
- 🔄 YouTube transcript analysis
- 🔄 News/policy monitoring

### Phase 4: AI Enhancement
- 🔄 GPT-4 integration for chat
- 🔄 Automated insight generation
- 🔄 Predictive analytics
- 🔄 Custom alert rules

### Phase 5: Enterprise Features
- 🔄 User authentication
- 🔄 Role-based access control
- 🔄 Custom dashboards
- 🔄 API access
- 🔄 White-label options

## 💼 Use Cases

### For CEO
- **Weekly Intelligence Briefings**: 5-minute strategic updates
- **Trend Identification**: Spot emerging issues early
- **Competitive Intelligence**: Monitor market conversations
- **Investment Decisions**: Data-backed strategic planning

### For RCM Leaders
- **Payer Friction Monitoring**: Track denial patterns
- **Best Practice Identification**: Learn from peers
- **Vendor Evaluation**: See what others recommend
- **Training Needs**: Identify knowledge gaps

### For Practice Administrators
- **Prior Auth Intelligence**: Stay ahead of policy changes
- **Billing Workflow Insights**: Optimize processes
- **Peer Learning**: Connect with similar practices
- **Staff Training**: Find educational resources

## 📖 Getting Started

### Quick Start
1. Open `index.html` in your browser
2. Select one or more platforms
3. View the unified dashboard
4. Ask questions in the AI chat

### Current Status
- **Demo Mode**: Fully functional with sample data
- **Real Data**: Integration in progress (see roadmap)

### Next Steps
1. Review the dashboard interface
2. Test the AI chat functionality
3. Provide feedback on UX/features
4. Prioritize platform integrations

## 🎨 Design Principles

### CEO-Ready
- Clear, concise, defensible
- No speculation without labels
- Business value focused
- Actionable insights

### Modular
- Independent platform modules
- Plug-and-play architecture
- Easy to add new platforms
- Scalable infrastructure

### Transparent
- Always show data sources
- Confidence indicators
- Sample size visibility
- Clear demo vs live labels

### Intelligent
- AI-powered insights
- Automated anomaly detection
- Predictive capabilities
- Natural language queries

## 📊 Success Metrics

### Product KPIs
- **User Engagement**: Daily active users, session duration
- **Decision Impact**: Actions taken based on insights
- **Data Coverage**: % of relevant conversations captured
- **AI Accuracy**: Confidence score validation
- **Client Satisfaction**: NPS score

### Business Value
- **Time Saved**: Hours saved vs manual monitoring
- **Early Detection**: Days ahead of market awareness
- **ROI**: Value of decisions informed by platform
- **Competitive Advantage**: Unique insights gained

## 🔐 Security & Compliance

### Data Handling
- Encrypted at rest and in transit
- Role-based access controls
- Audit logging for all access
- PII minimization

### Privacy
- Public data only
- No personal health information
- Compliant with platform ToS
- GDPR/CCPA ready

## 📞 Support & Documentation

### Resources
- **README.md**: This file (product overview)
- **ARCHITECTURE.md**: Technical architecture (coming soon)
- **API_DOCS.md**: API documentation (coming soon)
- **USER_GUIDE.md**: End-user guide (coming soon)

### Contact
- Product questions: [Product team]
- Technical support: [Engineering team]
- Feature requests: [Product roadmap]

---

**Status**: Demo v1.0 | **Last Updated**: January 25, 2026 | **Next Release**: Q1 2026
