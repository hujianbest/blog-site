# Deployment Guide

## Prerequisites

- **Java**: 17 or higher (running on Java 21)
- **Maven**: 3.8.7 or higher
- **Node.js**: 18 or higher
- **PostgreSQL**: 13 or higher (for production)
- **Docker & Docker Compose** (optional, for containerized deployment)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hujianbest.github.io
```

### 2. Backend Setup

#### Development (H2 Database)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Production (PostgreSQL)
```bash
cd backend

# Update application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/writingplatform
# spring.datasource.username=your_username
# spring.datasource.password=your_password

mvn clean package -DskipTests
java -jar target/writing-platform-0.0.1-SNAPSHOT.jar
```

### 3. Frontend Setup

#### Development
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Production Build
```bash
cd frontend
npm install
npm run build
```

The build output will be in `frontend/dist/`

### 4. Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

```properties
# Server
server.port=8080

# Database (H2 - Development)
spring.datasource.url=jdbc:h2:mem:writingplatform
spring.h2.console.enabled=true

# Database (PostgreSQL - Production)
# spring.datasource.url=jdbc:postgresql://localhost:5432/writingplatform
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Logging
logging.level.com.example.writingplatform=INFO
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=My Blog
```

## Production Deployment

### Backend (Spring Boot)

#### Create Executable JAR
```bash
cd backend
mvn clean package -DskipTests
```

#### Run JAR
```bash
java -jar target/writing-platform-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --server.port=8080
```

#### Using Systemd (Linux)
Create `/etc/systemd/system/writing-platform.service`:

```ini
[Unit]
Description=Writing Platform Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/writing-platform
ExecStart=/usr/bin/java -jar /opt/writing-platform/writing-platform-0.0.1-SNAPSHOT.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable writing-platform
sudo systemctl start writing-platform
```

### Frontend (Vue.js + Vite)

#### Build for Production
```bash
cd frontend
npm run build
```

#### Serve with Nginx
Create `/etc/nginx/sites-available/writing-platform`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/writing-platform;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/writing-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Deploy Static Files
```bash
# Copy build output
sudo cp -r frontend/dist/* /var/www/writing-platform/

# Set permissions
sudo chown -R www-data:www-data /var/www/writing-platform
```

## Database Setup

### PostgreSQL

#### Create Database
```sql
CREATE DATABASE writingplatform;
CREATE USER writingplatform WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE writingplatform TO writingplatform;
```

#### Run Migrations
Spring Boot will automatically create tables on startup with `ddl-auto=update`.

For production, consider using Flyway or Liquibase for version control.

## Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:8080/v1/health

# Get metrics
curl http://localhost:8080/v1/health/metrics
```

### Logs

#### Backend Logs
```bash
# Using systemd
sudo journalctl -u writing-platform -f

# Direct logs
tail -f /opt/writing-platform/logs/application.log
```

#### Frontend Logs
Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup

#### Database Backup
```bash
pg_dump -U writingplatform writingplatform > backup_$(date +%Y%m%d).sql
```

#### File Backup
```bash
tar -czf backup_$(date +%Y%m%d).tar.gz /var/www/writing-platform
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
```bash
# Check logs
tail -f logs/writing-platform.log

# Verify Java version
java -version

# Check port availability
netstat -tuln | grep 8080
```

**Problem**: Database connection errors
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U writingplatform -d writingplatform -h localhost
```

### Frontend Issues

**Problem**: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version
npm --version
```

**Problem**: API calls fail in production
- Check CORS configuration in backend
- Verify nginx proxy settings
- Check browser console for errors

## Performance Tuning

### Backend

1. **Increase JVM heap size**
```bash
java -Xmx2G -Xms1G -jar writing-platform.jar
```

2. **Enable production profile**
```bash
java -jar writing-platform.jar --spring.profiles.active=prod
```

3. **Configure connection pool**
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

### Frontend

1. **Enable gzip compression** (in nginx)
2. **Set browser caching headers**
3. **Use CDN for static assets**
4. **Enable HTTP/2**

## Security Best Practices

1. **Change default passwords** in production
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** with valid SSL certificates
4. **Keep dependencies updated**
5. **Set up firewall rules**
6. **Regular security audits**
7. **Monitor logs for suspicious activity**
8. **Implement rate limiting**
9. **Use CSRF protection**
10. **Enable security headers**

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple backend instances
- Shared database with connection pooling
- Session state in Redis or JWT tokens

### Caching Strategy
- Enable Redis for distributed caching
- Cache frequently accessed articles
- Use CDN for static content
- Implement browser caching headers

### Database Optimization
- Add indexes for common queries
- Use read replicas for heavy read loads
- Implement connection pooling
- Regular database maintenance

## Support

For issues and questions:
- Check logs: `tail -f logs/*.log`
- Review documentation: `/docs`
- GitHub issues: `<repository-url>/issues`
