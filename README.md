
# Finance Dashboard Backend

A robust Node.js + Express backend for a Finance Dashboard system, featuring JWT authentication, PostgreSQL with Prisma ORM, role-based access, and comprehensive API documentation via Swagger.

## Tech Stack
- Node.js 18+
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs, express-validator
- Swagger (OpenAPI)

## Prerequisites
- Node.js v18 or higher
- PostgreSQL database

## Setup Instructions
1. Clone the repository and navigate to the project folder.
2. Copy `.env.example` to `.env` and fill in your database credentials and JWT secret.
3. Install dependencies:
	```bash
	npm install
	```
4. Run database migrations:
	```bash
	npx prisma migrate dev
	```
5. Seed the database with sample users and records:
	```bash
	npm run seed
	```
6. Start the development server:
	```bash
	npm run dev
	```
7. Access Swagger API docs at [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## .env Variables
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `PORT` — Server port (default: 3000)

## API Endpoints
| Method | Path                        | Roles           | Description                                 |
|--------|-----------------------------|-----------------|---------------------------------------------|
| POST   | /api/auth/register          | ALL             | Register a new user                         |
| POST   | /api/auth/login             | ALL             | Login and receive JWT token                 |
| GET    | /api/records                | ALL             | List financial records (filters, paging)    |
| POST   | /api/records                | ADMIN, ANALYST  | Create a financial record                   |
| PUT    | /api/records/:id            | ADMIN           | Update a financial record                   |
| DELETE | /api/records/:id            | ADMIN           | Soft delete a financial record              |
| GET    | /api/dashboard/summary      | ALL             | Dashboard summary (income, expenses, etc.)  |
| GET    | /api/dashboard/by-category  | ALL             | Summary grouped by category                 |
| GET    | /api/dashboard/trends       | ALL             | Monthly trends for a given year             |
| GET    | /api/dashboard/recent       | ALL             | Last 10 financial records                   |
| GET    | /api/users                  | ADMIN           | List all users (filter by role)             |
| POST   | /api/users                  | ADMIN           | Create a new user                           |
| PATCH  | /api/users/:id/status       | ADMIN           | Toggle user active status                   |
| PATCH  | /api/users/:id/role         | ADMIN           | Change user role                            |

## Sample Login Credentials
| Role    | Email                | Password     |
|---------|----------------------|--------------|
| ADMIN   | admin@finance.com    | Admin@123    |
| ANALYST | analyst@finance.com  | Analyst@123  |
| VIEWER  | viewer@finance.com   | Viewer@123   |

## Assumptions
- Only ADMINs can manage users and perform destructive actions.
- Passwords are always hashed with bcryptjs.
- JWT tokens are required for all endpoints except register/login.
- Soft deletes are used for financial records.
- All endpoints return consistent JSON: `{ success, data, message }`

## Improvements with More Time
- Add automated tests (Jest/Supertest)
- Implement refresh tokens and password reset
- Add user profile and audit logging
- Rate limiting and security hardening
- More granular permissions and activity logs
- Dockerize for easier deployment
- CI/CD pipeline integration

---

For full API details and request/response schemas, see [Swagger UI](http://localhost:3000/api/docs).
