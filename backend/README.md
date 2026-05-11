# Writing Platform Backend

Spring Boot backend for the Personal Writing Platform.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** - ORM
- **H2 Database** - In-memory database (development)
- **PostgreSQL** - Production database
- **Spring Security** - Authentication and authorization
- **JWT** - Token-based authentication
- **SpringDoc OpenAPI** - API documentation (Swagger)
- **Maven** - Build tool

## Getting Started

### Prerequisites

- JDK 17 or higher
- Maven 3.6+

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

### Accessing Resources

- **API Endpoints**: http://localhost:8080/api/v1/
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **H2 Console**: http://localhost:8080/api/h2-console
  - JDBC URL: `jdbc:h2:mem:writingplatform`
  - Username: `sa`
  - Password: (leave empty)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Articles
- `GET /api/v1/articles` - Get all published articles
- `GET /api/v1/articles/{id}` - Get article by ID
- `POST /api/v1/articles` - Create new article
- `PUT /api/v1/articles/{id}` - Update article
- `DELETE /api/v1/articles/{id}` - Delete article

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/{id}` - Get category by ID
- `POST /api/v1/categories` - Create new category

### Tags
- `GET /api/v1/tags` - Get all tags
- `GET /api/v1/tags/{id}` - Get tag by ID
- `POST /api/v1/tags` - Create new tag

## Running Tests

```bash
mvn test
```

## Building for Production

```bash
mvn clean package
```

The JAR file will be created in `target/writing-platform-0.0.1-SNAPSHOT.jar`

## Configuration

Application configuration is in `src/main/resources/application.yml`

Key configuration properties:
- Database: H2 (development) / PostgreSQL (production)
- JWT: Token expiration and secret
- File upload: Max file size
- CORS: Allowed origins

## Project Structure

```
src/main/java/com/example/writingplatform/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data transfer objects
├── entity/         # JPA entities
├── exception/      # Custom exceptions
├── repository/     # JPA repositories
├── security/       # Security configuration
└── service/        # Business logic
```

## Development Notes

- H2 database is used for development with in-memory storage
- Data is reset on application restart
- H2 Console is available for database inspection
- Swagger UI is available for API testing
- All endpoints return JSON responses

## Next Steps

1. Implement remaining controllers (Comments, Publications, Platforms)
2. Add input validation and error handling
3. Implement file upload functionality
4. Add caching layer (Redis)
5. Configure PostgreSQL for production
6. Add integration tests
7. Set up CI/CD pipeline
