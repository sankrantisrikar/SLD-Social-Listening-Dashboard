# Deployment Guide

## Local Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, etc.)
- No server required for demo mode

### Quick Start
```bash
# Clone or download the repository
cd pain-management-intelligence

# Open in browser
open index.html

# Or use a local server (optional)
python -m http.server 8000
# Then visit: http://localhost:8000
```

### File Structure
```
pain-management-intelligence/
├── index.html              # Main application
├── README.md               # Product overview
├── ARCHITECTURE.md         # Technical architecture
├── QUICKSTART.md          # Quick start guide
├── PRODUCT_BRIEF.md       # Executive brief
└── DEPLOYMENT.md          # This file
```

## Production Deployment

### Option 1: Static Hosting (Simplest)

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### AWS S3 + CloudFront
```bash
# Create S3 bucket
aws s3 mb s3://pain-mgmt-intelligence

# Upload files
aws s3 sync . s3://pain-mgmt-intelligence --exclude ".git/*"

# Configure CloudFront distribution
# (See AWS documentation)
```

### Option 2: Full Stack Deployment

#### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

#### Backend Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npm run migrate

# Start server
npm run start
```

#### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/painmgmt

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
APIFY_TOKEN=your_apify_token
YOUTUBE_API_KEY=your_youtube_key
TWITTER_BEARER_TOKEN=your_twitter_token
REDDIT_CLIENT_ID=your_reddit_id
REDDIT_CLIENT_SECRET=your_reddit_secret

# OpenAI (for AI chat)
OPENAI_API_KEY=your_openai_key

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# App Config
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
```

### Option 3: Docker Deployment

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/painmgmt
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=painmgmt
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

#### Deploy
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 4: Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS)
- kubectl configured
- Helm 3+

#### Deploy with Helm
```bash
# Add Helm repo
helm repo add painmgmt https://charts.painmgmt.io

# Install
helm install painmgmt painmgmt/intelligence-platform \
  --set database.url=$DATABASE_URL \
  --set redis.url=$REDIS_URL \
  --set apiKeys.apify=$APIFY_TOKEN \
  --set apiKeys.openai=$OPENAI_API_KEY

# Upgrade
helm upgrade painmgmt painmgmt/intelligence-platform

# Uninstall
helm uninstall painmgmt
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to production
        run: |
          # Your deployment script
          ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

## Monitoring & Observability

### Application Monitoring
```javascript
// Datadog
const tracer = require('dd-trace').init({
  service: 'pain-mgmt-intelligence',
  env: process.env.NODE_ENV
});

// Sentry
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Health Checks
```javascript
// /health endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      apis: await checkExternalAPIs()
    }
  };
  
  const allHealthy = Object.values(health.checks).every(c => c.status === 'ok');
  res.status(allHealthy ? 200 : 503).json(health);
});
```

### Logging
```javascript
// Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Security Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Secrets stored securely (not in code)
- [ ] HTTPS/TLS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Security headers configured

### Post-Deployment
- [ ] SSL certificate valid
- [ ] Firewall rules configured
- [ ] Database backups automated
- [ ] Monitoring alerts configured
- [ ] Incident response plan documented
- [ ] Security audit completed
- [ ] Penetration testing performed
- [ ] Compliance review passed

## Backup & Recovery

### Database Backups
```bash
# Automated daily backups
0 2 * * * pg_dump painmgmt | gzip > /backups/painmgmt-$(date +\%Y\%m\%d).sql.gz

# Retention: Keep 30 days
find /backups -name "painmgmt-*.sql.gz" -mtime +30 -delete
```

### Disaster Recovery
```bash
# Restore from backup
gunzip < /backups/painmgmt-20260125.sql.gz | psql painmgmt

# Verify restoration
psql painmgmt -c "SELECT COUNT(*) FROM posts;"
```

## Performance Optimization

### Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache dashboard data (5 min TTL)
app.get('/api/dashboard', async (req, res) => {
  const cacheKey = `dashboard:${req.user.id}:${req.query.platforms}`;
  
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const data = await generateDashboard(req.query);
  await client.setex(cacheKey, 300, JSON.stringify(data));
  
  res.json(data);
});
```

### CDN Configuration
```nginx
# nginx.conf
location /static/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location /api/ {
  proxy_pass http://backend;
  proxy_cache api_cache;
  proxy_cache_valid 200 5m;
}
```

## Scaling Guidelines

### Horizontal Scaling
```bash
# Add more app instances
kubectl scale deployment painmgmt-app --replicas=5

# Add more workers
kubectl scale deployment painmgmt-worker --replicas=10
```

### Database Scaling
```sql
-- Read replicas
CREATE SUBSCRIPTION painmgmt_replica
  CONNECTION 'host=primary port=5432 dbname=painmgmt'
  PUBLICATION painmgmt_pub;

-- Partitioning
CREATE TABLE posts_2026_01 PARTITION OF posts
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

## Troubleshooting

### Common Issues

**Issue**: Dashboard not loading
```bash
# Check logs
docker-compose logs app

# Verify database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Redis
redis-cli ping
```

**Issue**: Slow API responses
```bash
# Check database queries
psql painmgmt -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# Check Redis memory
redis-cli info memory

# Check app metrics
curl http://localhost:3000/metrics
```

**Issue**: AI chat not responding
```bash
# Verify OpenAI API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check rate limits
# Review error logs
```

## Support

### Documentation
- **README.md**: Product overview
- **ARCHITECTURE.md**: Technical details
- **QUICKSTART.md**: Getting started
- **PRODUCT_BRIEF.md**: Executive summary

### Contact
- **Technical Support**: engineering@painmgmt.io
- **Product Questions**: product@painmgmt.io
- **Security Issues**: security@painmgmt.io

---

**Version**: 1.0 | **Last Updated**: January 25, 2026
