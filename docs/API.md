# API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Currently using mock JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Articles

### Get All Articles
```http
GET /articles?status=PUBLISHED&limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "content": "Article content...",
      "excerpt": "Brief excerpt",
      "status": "PUBLISHED",
      "authorId": 1,
      "createdAt": "2026-05-12T00:00:00",
      "updatedAt": "2026-05-12T00:00:00"
    }
  ]
}
```

### Get Article by ID
```http
GET /articles/{id}
```

### Create Article
```http
POST /articles
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content...",
  "excerpt": "Brief excerpt",
  "categoryId": 1,
  "tagIds": [1, 2]
}
```

### Update Article
```http
PUT /articles/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### Delete Article
```http
DELETE /articles/{id}
```

## Comments

### Get Comments for Article
```http
GET /articles/{articleId}/comments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "articleId": 1,
      "authorName": "John Doe",
      "authorEmail": "john@example.com",
      "content": "Great article!",
      "status": "APPROVED",
      "createdAt": "2026-05-12T00:00:00"
    }
  ]
}
```

### Create Comment
```http
POST /articles/{articleId}/comments
Content-Type: application/json

{
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "content": "Great article!"
}
```

### Approve Comment
```http
PUT /comments/{commentId}/approve
```

### Delete Comment
```http
DELETE /comments/{commentId}
```

## Categories & Tags

### Get All Categories
```http
GET /categories
```

### Get Category by ID
```http
GET /categories/{id}
```

### Get Articles by Category
```http
GET /categories/{id}/articles
```

### Get All Tags
```http
GET /tags
```

### Get Articles by Tag
```http
GET /tags/{name}/articles
```

## Multi-Platform Publishing

### Get OAuth Authorization URL
```http
GET /oauth/{platform}/authorize
```

**Platforms:** `zhihu`, `twitter`

**Response:**
```json
{
  "success": true,
  "data": {
    "authorizationUrl": "https://www.zhihu.com/oauth2/authorize?...",
    "state": "state_123456"
  }
}
```

### OAuth Callback
```http
POST /oauth/{platform}/callback?code=xxx&state=xxx
```

### Check Connection Status
```http
GET /oauth/{platform}/status
```

### Publish Article to Platforms
```http
POST /publications/articles/{articleId}
Content-Type: application/json

{
  "platforms": ["zhihu", "twitter"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "zhihu": "success: https://zhihu.com/p/12345",
    "twitter": "success: https://twitter.com/user/status/12345"
  }
}
```

### Get Publication Status
```http
GET /publications/articles/{articleId}/status
```

## Health & Monitoring

### Health Check
```http
GET /v1/health
```

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2026-05-12T00:00:00",
  "uptime": 3600
}
```

### Get Metrics
```http
GET /v1/health/metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalArticles": 100,
    "totalComments": 50,
    "jvm": {
      "totalMemory": 123456789,
      "freeMemory": 45678901,
      "usedMemory": 77777888,
      "maxMemory": 2147483648,
      "availableProcessors": 4
    },
    "application": {
      "name": "writing-platform",
      "version": "0.0.1-SNAPSHOT",
      "uptime": 3600
    }
  }
}
```

### Ping
```http
GET /v1/health/ping
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "pong",
    "timestamp": "2026-05-12T00:00:00"
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
