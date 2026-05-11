# Development Guide

## Project Structure

\`\`\`
.
├── frontend/          # Vue 3 frontend
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   └── utils/
│   └── package.json
├── backend/          # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/writingplatform/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       └── entity/
│   └── pom.xml
└── docker-compose.yml
\`\`\`

## Frontend Development

\`\`\`bash
cd frontend
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm test             # Run tests
\`\`\`

## Backend Development

\`\`\`bash
cd backend
mvn spring-boot:run  # Start server (http://localhost:8080)
mvn test             # Run tests
mvn clean package    # Build JAR
\`\`\`

## API Documentation

- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`

## Database

- H2 Console: `http://localhost:8080/api/h2-console` (dev only)
- JDBC URL: `jdbc:h2:mem:writingplatform`
- Username: `sa`
- Password: (empty)

## Testing

### Frontend Tests

\`\`\`bash
cd frontend
npm test -- --ui          # Vitest UI
npm test -- --coverage    # Coverage report
\`\`\`

### Backend Tests

\`\`\`bash
cd backend
mvn test                   # Unit tests
mvn integration-test       # Integration tests
\`\`\`

## Code Style

- Frontend: ESLint + Prettier
- Backend: Checkstyle (TODO)
\`\`\`

## Troubleshooting

### Frontend

**Problem**: Port 5173 already in use
**Solution**: \`kill $(lsof -ti:5173)\`

**Problem**: Module not found
**Solution**: \`rm -rf node_modules package-lock.json && npm install\`

### Backend

**Problem**: Connection refused
**Solution**: Check if PostgreSQL is running

**Problem**: Out of memory
**Solution**: Increase JVM heap: \`export JAVA_OPTS="-Xmx2g"\`
