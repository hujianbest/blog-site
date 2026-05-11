# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- JDK 17
- Node.js 18+
- PostgreSQL 15+ (for production)

## Development Setup

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd hujianbest.github.io

# Frontend
cd frontend
npm install

# Backend
cd ../backend
# Configure application.yml
\`\`\`

### 2. Configure Environment

Create `backend/src/main/resources/application-local.yml`:

\`\`\`yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/writing_platform
    username: your_username
    password: your_password

jwt:
  secret: your-secret-key
\`\`\`

### 3. Run Services

\`\`\`bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or run individually
cd backend && mvn spring-boot:run
cd frontend && npm run dev
\`\`\`

## Production Deployment

### Docker Deployment

\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Environment Variables

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

## Monitoring

- Health check: `http://localhost:8080/api/actuator/health`
- Metrics: `http://localhost:8080/api/actuator/metrics`
- Logs: `backend/logs/application.log`
