# Library Management System

## Overview
A comprehensive Spring Boot REST API for managing library operations. Supports user authentication, book issuance/return/renewal, admin management, and public book search.

**Last Updated:** 2024-10-05

## Features
- **Authentication**: JWT-based login/signup for users/admins.
- **User Functions**: Search books, issue/return/renew books, view transaction history.
- **Admin Functions**: Manage users, add/remove books, view statistics.
- **Public Search**: Search available books without login.
- **Exception Handling**: Custom exceptions for business logic (e.g., max books, not available).
- **Security**: Role-based access (USER, ADMIN).

## Tech Stack
- Java 17+ / Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- Maven
- Thymeleaf templates (for any web views)
- H2/MySQL/PostgreSQL (via application.properties)

## Quick Setup
1. Clone the repo.
2. Copy `src/main/resources/application.properties.example` to `application.properties` and configure DB:
   ```
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.jpa.hibernate.ddl-auto=create-drop
   # For production DB, update accordingly
   ```
3. Run:
   ```
   ./mvnw spring-boot:run
   ```
   or `mvn spring-boot:run`

App runs on http://localhost:8080.

## Default Admin
- On startup, default admin created via `AdminInitialization` (check logs for credentials).

## API Endpoints
- **Auth**:
  - POST `/api/auth/signup` - Signup (body: SignupRequestDTO)
  - POST `/api/auth/login` - Login (body: LoginRequestDTO) → JWT token
- **Public**:
  - GET `/api/public/search?query=bookname`
- **User** (with JWT):
  - GET `/api/user/books`
  - POST `/api/user/issue/{bookId}`
  - POST `/api/user/return/{transactionId}`
- **Admin** (ADMIN role):
  - POST `/api/admin/user`
  - POST `/api/admin/book`
  - GET `/api/admin/stats`

See controllers for full details.

## Testing
```
./mvnw test
```

## Structure
```
src/main/java/com/ashutosh/LibraryManagementSystem/
├── Controller/     # REST controllers
├── Service/        # Business logic
├── Repository/     # JPA repos
├── Entity/         # Models
├── DTO/            # Data transfer objects
├── Security/       # JWT & config
└── Exception/      # Custom exceptions
```

## Author
**Ashutosh**  
GitHub:https://github.com/Ashutosh7061   
LinkedIn: https://www.linkedin.com/in/ashutoshraj7061

For issues, create GitHub issue.

