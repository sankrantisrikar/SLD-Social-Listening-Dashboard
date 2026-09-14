# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Platform    │  │  Dashboard   │  │  AI Chat     │         │
│  │  Selector    │  │  Engine      │  │  Assistant   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PROCESSING LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Aggregation │  │  NLP Engine  │  │  Analytics   │         │
│  │  Service     │  │  (Sentiment) │  │  Engine      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ LinkedIn │  │ Twitter  │  │  Reddit  │  │ YouTube  │       │
│  │ Connector│  │Connector │  │Connector │  │Connector │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Raw Data    │  │  Processed   │  │  Analytics   │         │
│  │  Store       │  │  Data Store  │  │  Cache       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Platform Connectors

#### LinkedIn Connector
```javascript
class LinkedInConnector {
  constructor(apifyToken, linkedInCookie) {
    this.apifyToken = apifyToken;
    this.cookie = linkedInCookie;
    this.actorId = 'kfiWbq3boy3dWKbiL';
  }
  
  async ingest(keywords, maxPosts) {
    // Start Apify actor
    const run = await this.startActor(keywords, maxPosts);
    
    // Wait for completion
    await this.waitForCompletion(run.id);
    
    // Fetch results
    const data = await this.fetchDataset(run.defaultDatasetId);
    
    // Normalize to canonical schema
    return this.normalize(data);
  }
  
  normalize(rawData) {
    return rawData.map(item => ({
      id: generateId('linkedin', item.url),
      date: item.publishedAt,
      platform: 'linkedin',
      source_url: item.url,
      author_name: item.author,
      author_role: item.authorRole || null,
      content_text: item.text,
      sentiment: analyzeSentiment(item.text),
      engagement_metrics: {
        likes: item.likes,
        comments: item.comments,
        shares: item.shares
      },
      topic_labels: classifyTopics(item.text),
      payer_labels: extractPayers(item.text),
      procedure_device_labels: extractProcedures(item.text)
    }));
  }
}
```

#### YouTube Connector
```javascript
class YouTubeConnector {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiBase = 'https://www.googleapis.com/youtube/v3';
  }
  
  async ingest(keywords, maxVideos) {
    const videos = [];
    
    // Search for each keyword
    for (const keyword of keywords) {
      const results = await this.searchVideos(keyword, maxVideos);
      videos.push(...results);
    }
    
    // Get video details
    const videoIds = videos.map(v => v.id.videoId);
    const details = await this.getVideoDetails(videoIds);
    
    // Get transcripts
    const withTranscripts = await this.getTranscripts(details);
    
    // Normalize
    return this.normalize(withTranscripts);
  }
  
  normalize(rawData) {
    return rawData.map(video => ({
      id: generateId('youtube', video.id),
      date: video.snippet.publishedAt,
      platform: 'youtube',
      source_url: `https://youtube.com/watch?v=${video.id}`,
      author_name: video.snippet.channelTitle,
      author_role: 'Content Creator',
      content_text: video.transcript,
      sentiment: analyzeSentiment(video.transcript),
      engagement_metrics: {
        views: video.statistics.viewCount,
        likes: video.statistics.likeCount,
        comments: video.statistics.commentCount
      },
      topic_labels: classifyTopics(video.transcript),
      payer_labels: extractPayers(video.transcript),
      procedure_device_labels: extractProcedures(video.transcript)
    }));
  }
}
```

### 2. Data Processing Pipeline

```javascript
class DataProcessor {
  constructor() {
    this.nlpEngine = new NLPEngine();
    this.classifiers = {
      topics: new TopicClassifier(),
      payers: new PayerExtractor(),
      procedures: new ProcedureExtractor(),
      sentiment: new SentimentAnalyzer()
    };
  }
  
  async process(rawData) {
    // Normalize all data to canonical schema
    const normalized = await this.normalize(rawData);
    
    // Enrich with NLP
    const enriched = await this.enrich(normalized);
    
    // Detect anomalies
    const withAnomalies = await this.detectAnomalies(enriched);
    
    // Calculate metrics
    const withMetrics = await this.calculateMetrics(withAnomalies);
    
    return withMetrics;
  }
  
  async enrich(data) {
    return Promise.all(data.map(async item => ({
      ...item,
      topic_labels: await this.classifiers.topics.classify(item.content_text),
      payer_labels: await this.classifiers.payers.extract(item.content_text),
      procedure_device_labels: await this.classifiers.procedures.extract(item.content_text),
      sentiment: await this.classifiers.sentiment.analyze(item.content_text),
      confidence: this.calculateConfidence(item)
    })));
  }
  
  calculateConfidence(item) {
    const factors = {
      textLength: item.content_text.length > 100 ? 1 : 0.5,
      engagement: item.engagement_metrics.total > 50 ? 1 : 0.7,
      authorKnown: item.author_role ? 1 : 0.8
    };
    
    const score = Object.values(factors).reduce((a, b) => a * b, 1);
    
    if (score > 0.8) return 'high';
    if (score > 0.5) return 'medium';
    return 'low';
  }
}
```

### 3. Analytics Engine

```javascript
class AnalyticsEngine {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }
  
  async generateDashboard(platforms, timeRange) {
    // Filter data by platforms and time
    const data = await this.dataStore.query({
      platforms: platforms,
      dateRange: timeRange
    });
    
    // Calculate metrics
    const metrics = {
      totalMentions: data.length,
      activeSources: new Set(data.map(d => d.author_name)).size,
      avgEngagement: this.calculateAvgEngagement(data),
      spikeEvents: await this.detectSpikes(data)
    };
    
    // Generate trends
    const trends = {
      weeklyVolume: this.calculateWeeklyVolume(data),
      sentiment: this.calculateSentimentTrends(data),
      payerMentions: this.calculatePayerMentions(data),
      procedureMentions: this.calculateProcedureMentions(data)
    };
    
    // Identify influencers
    const influencers = this.identifyInfluencers(data);
    
    // Generate CEO summary
    const ceoSummary = this.generateCEOSummary(data, metrics, trends);
    
    return {
      metrics,
      trends,
      influencers,
      ceoSummary,
      confidence: this.calculateOverallConfidence(data)
    };
  }
  
  async detectSpikes(data) {
    const weeklyData = this.groupByWeek(data);
    const spikes = [];
    
    for (let i = 1; i < weeklyData.length; i++) {
      const current = weeklyData[i];
      const previous = weeklyData[i - 1];
      
      for (const topic of Object.keys(current.topics)) {
        const currentCount = current.topics[topic] || 0;
        const previousCount = previous.topics[topic] || 0;
        
        if (previousCount > 0) {
          const change = (currentCount - previousCount) / previousCount;
          
          if (change > 0.3) { // 30% increase
            spikes.push({
              topic: topic,
              week: i,
              change: change,
              currentCount: currentCount,
              previousCount: previousCount,
              driver: await this.identifySpikeDriver(data, topic, i),
              confidence: currentCount > 20 ? 'high' : 'medium'
            });
          }
        }
      }
    }
    
    return spikes;
  }
}
```

### 4. AI Chat Assistant

```javascript
class AIChatAssistant {
  constructor(dataStore, llmProvider) {
    this.dataStore = dataStore;
    this.llm = llmProvider; // GPT-4, Claude, etc.
  }
  
  async answer(question, activePlatforms, timeRange) {
    // Retrieve relevant data
    const context = await this.dataStore.query({
      platforms: activePlatforms,
      dateRange: timeRange,
      relevantTo: question
    });
    
    // Build prompt
    const prompt = this.buildPrompt(question, context, activePlatforms);
    
    // Get LLM response
    const response = await this.llm.complete(prompt);
    
    // Structure response
    return {
      answer: response.answer,
      supportingData: this.extractSupportingData(context, response),
      platformAttribution: activePlatforms,
      confidence: this.calculateConfidence(context, response),
      timeRange: timeRange,
      implication: response.implication
    };
  }
  
  buildPrompt(question, context, platforms) {
    return `
You are an AI assistant for a pain management social intelligence platform.

STRICT RULES:
1. Answer ONLY using data from: ${platforms.join(', ')}
2. Do NOT use external knowledge
3. Always cite specific data points
4. Provide confidence level
5. Include actionable implications

AVAILABLE DATA:
${JSON.stringify(context, null, 2)}

USER QUESTION:
${question}

RESPONSE FORMAT:
{
  "answer": "Direct answer to the question",
  "supportingData": ["Data point 1", "Data point 2"],
  "confidence": "high|medium|low",
  "reasoning": "Why this confidence level",
  "implication": "What this means for practices/RCM"
}
    `;
  }
  
  calculateConfidence(context, response) {
    const factors = {
      dataPoints: context.length > 50 ? 1 : 0.7,
      sources: new Set(context.map(d => d.author_name)).size > 10 ? 1 : 0.8,
      recency: context.every(d => isRecent(d.date, 7)) ? 1 : 0.9
    };
    
    const score = Object.values(factors).reduce((a, b) => a * b, 1);
    
    if (score > 0.85) return 'high';
    if (score > 0.65) return 'medium';
    return 'low';
  }
}
```

## Data Flow

### Ingestion Flow
```
1. User selects platforms
2. System triggers connectors for selected platforms
3. Each connector:
   a. Fetches raw data from platform API
   b. Normalizes to canonical schema
   c. Stores in raw data store
4. Data processor:
   a. Enriches with NLP (sentiment, topics, entities)
   b. Calculates confidence scores
   c. Stores in processed data store
5. Analytics engine:
   a. Calculates metrics
   b. Detects anomalies
   c. Generates insights
   d. Caches results
```

### Query Flow
```
1. User views dashboard or asks AI question
2. System queries processed data store
3. Filters by:
   - Selected platforms
   - Time range
   - Topic/payer/procedure filters
4. Analytics engine generates visualizations
5. AI assistant generates natural language insights
6. Results displayed with:
   - Platform attribution
   - Confidence indicators
   - Supporting data
```

## Scalability Considerations

### Horizontal Scaling
- **Connectors**: Independent microservices, scale per platform
- **Processing**: Queue-based, parallel processing
- **Storage**: Sharded by platform and time
- **API**: Load-balanced, stateless

### Performance Optimization
- **Caching**: Redis for frequently accessed analytics
- **Indexing**: Elasticsearch for full-text search
- **Aggregation**: Pre-computed metrics for common queries
- **CDN**: Static assets and dashboard UI

### Data Volume Estimates
```
Platform    | Posts/Day | Storage/Day | Processing Time
------------|-----------|-------------|----------------
LinkedIn    | 1,000     | 50 MB       | 5 min
Twitter     | 5,000     | 100 MB      | 10 min
Reddit      | 2,000     | 75 MB       | 7 min
YouTube     | 100       | 500 MB      | 30 min (transcripts)
News        | 200       | 25 MB       | 3 min
------------|-----------|-------------|----------------
TOTAL       | 8,300     | 750 MB      | 55 min
```

## Technology Stack

### Frontend
- **Framework**: Vanilla JS (current), React (future)
- **Charts**: Chart.js
- **State Management**: Local state (current), Redux (future)
- **Build**: Webpack/Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: REST + GraphQL
- **Authentication**: JWT

### Data Layer
- **Primary DB**: PostgreSQL (structured data)
- **Document Store**: MongoDB (raw data)
- **Search**: Elasticsearch (full-text)
- **Cache**: Redis (analytics)
- **Queue**: RabbitMQ (ingestion)

### AI/ML
- **LLM**: OpenAI GPT-4 / Anthropic Claude
- **NLP**: spaCy, Hugging Face Transformers
- **Sentiment**: VADER, TextBlob
- **Classification**: Custom fine-tuned models

### Infrastructure
- **Cloud**: AWS / GCP
- **Containers**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog, Sentry

## Security Architecture

### Authentication & Authorization
```
User → Auth Service → JWT Token → API Gateway → Services
                                        ↓
                                  Role-Based Access Control
                                        ↓
                              ┌─────────┴─────────┐
                              ↓                   ↓
                         CEO View          Admin View
                    (Aggregated Only)   (Full Access)
```

### Data Protection
- **Encryption at Rest**: AES-256
- **Encryption in Transit**: TLS 1.3
- **PII Handling**: Separate encrypted store
- **Access Logging**: All data access audited
- **Data Retention**: Configurable per platform

## Deployment Architecture

### Production Environment
```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
┌───────────────┐                  ┌───────────────┐
│  Web Servers  │                  │  API Servers  │
│  (3 instances)│                  │  (5 instances)│
└───────────────┘                  └───────────────┘
                                           ↓
                          ┌────────────────┴────────────────┐
                          ↓                                 ↓
                  ┌───────────────┐              ┌───────────────┐
                  │  Worker Pool  │              │  Data Stores  │
                  │  (10 workers) │              │  (Replicated) │
                  └───────────────┘              └───────────────┘
```

### Monitoring & Alerting
- **Uptime**: 99.9% SLA
- **Response Time**: <500ms p95
- **Error Rate**: <0.1%
- **Data Freshness**: <15 min lag

---

**Version**: 1.0 | **Last Updated**: January 25, 2026
