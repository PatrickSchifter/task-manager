# Task Manager API

A NestJS-based task management application with user authentication, project collaboration, and asynchronous email processing.

## Features

- **User Authentication**: JWT-based auth with role-based access (USER/ADMIN)
- **Project Management**: Create projects, assign collaborators with different roles (VIEWER/EDITOR/OWNER)
- **Task Management**: Create, assign, and track tasks with status (TODO/IN_PROGRESS/DONE) and priority (LOW/MEDIUM/HIGH)
- **Collaboration**: Comment system on tasks
- **File Uploads**: Cloudinary integration for avatar uploads
- **Email Notifications**: Asynchronous email processing via RabbitMQ (forgot password, etc.)
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Class-validator and class-transformer for DTO validation
- **Testing**: Jest unit tests configured

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── consts.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── projects/
│   ├── tasks/
│   ├── collaborators/
│   ├── comments/
│   └── mail/
├── generated/           # Prisma client output
└── ...
```

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL
- RabbitMQ
- Cloudinary account (for file uploads)
- PNPM package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   pnpm prisma:generate
   pnpm migrate:dev
   ```

5. Start the application:
   ```bash
   pnpm start:dev
   ```

## Environment Variables

Create a `.env` file based on the provided `.env.example` file. The example file contains:

```env
#Database
DATABASE_URL="url"

#JWT
JWT_SECRET=***

#Mail
SMTP_HOST=host
SMTP_PORT=465
SMTP_USER=user
SMTP_PASS=pass

#RMQ
RABBITMQ_URL=url

#Cloudnary
CLOUDNARY_CLOUD_NAME=name
CLOUDNARY_API_KEY=***
CLOUDNARY_API_SECRET=***

#App
PORT=some_number
URL_BASE=urlbase
NODE_ENV=development
```

For a more detailed configuration with example values, you can use:

```env
# App
APP_PORT=3000

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:***@localhost:5432/taskmanager?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Mail (RabbitMQ)
RMQ_URL=amqp://guest:guest@localhost:5672
EMAIL_QUEUE=email_queue

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***

# SMTP (for email service - used by MailConsumer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=no-reply@example.com

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

## Available Scripts

- `pnpm start` - Start production server
- `pnpm start:dev` - Start development server with hot reload
- `pnpm start:debug` - Start in debug mode
- `pnpm start:prod` - Start compiled production server
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm format` - Format code with Prettier
- `pnpm lint` - Run Biome linter
- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Run tests with coverage
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm migrate:dev` - Run Prisma migrations in development mode
- `pnpm migrate:deploy` - Run Prisma migrations in production mode

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:${APP_PORT}/api`
- OpenAPI JSON: `http://localhost:${APP_PORT}/api-json`

## Authentication

The API uses JWT Bearer tokens. To authenticate:

1. Register a user: `POST /auth/register`
2. Login: `POST /auth/login` (returns access_token)
3. Include the token in the Authorization header: `Bearer <access_token>`

## Modules Overview

### Auth
- User registration and login
- Password reset functionality
- JWT token management

### Users
- User profile management
- Avatar uploads (via Cloudinary)

### Projects
- CRUD operations for projects
- Project collaboration management

### Tasks
- Task creation, assignment, and tracking
- Task commenting system

### Collaborators
- Manage project collaborators with role-based permissions

### Mail
- Asynchronous email processing via RabbitMQ
- Email templates (Handlebars)
- Forgot password notifications

## Development Guidelines

### Code Style
- Uses Biome for linting and formatting
- Run `pnpm lint` to check for issues
- Run `pnpm format` to automatically fix formatting

### Testing
- Unit tests are colocated with implementation files (`*.spec.ts`)
- End-to-end tests in `/test` directory
- Run tests with `pnpm test`

### Database
- Prisma ORM for database interactions
- Migrations managed through Prisma CLI
- Generate client after schema changes: `pnpm prisma:generate`

## TODO / Future Improvements

- [x] **PrismaService global**: Created a PrismaModule with `@Global()` and registered it in AppModule to share a single instance throughout the application.
- [ ] **Separate RabbitMQ consumer**: The MailConsumer currently runs in the same process as the API (`@Controller()`). In production, separate the consumer into its own process to avoid resource contention and prevent mail failures from affecting API routes.
- [ ] **Health checks**: Add `@nestjs/terminus` with health checks for PostgreSQL, RabbitMQ, and SMTP. Useful for monitoring and readiness/liveness probes in deployment.
- [ ] **Rate limiting on forgot-password route**: Despite RabbitMQ making responses fast, there's no abuse protection. Add `@nestjs/throttler` to the `forgotPassword` route to prevent email spam.
- [ ] **Reset token with TTL**: The JWT for `password-reset` lacks explicit expiration (`expiresIn`). Add `expiresIn: '1h'` when signing the token.
- [ ] **Remove console.log and console.error**: Replace `auth.service.ts:67` and `validate-resources-ids.interceptor.ts:40` with NestJS Logger using appropriate levels.
- [ ] **Role-based access validation**: The `ProjectCollaborator` has roles (VIEWER/EDITOR/OWNER) but lacks guards that restrict operations by collaborator role (e.g., VIEWER shouldn't be able to edit tasks).
- [ ] **Decouple CloudinaryService**: Move CloudinaryService to its own UploadsModule/SharedModule (currently in AppModule). Also fix the typo: `cloudnary` → `cloudinary`.
- [ ] **Request ID / Correlation ID**: Propagate a correlation ID via middleware/interceptor to trace requests between the API and RabbitMQ consumer.
- [ ] **RabbitMQ failure handling**: If the consumer fails to send an email, there's no dead-letter queue or retry configuration. Configure `prefetchCount`, DLQ, and retry with backoff.
- [ ] **Seeding and fixtures**: Add a seed script with fake data to facilitate development and manual testing.
- [ ] **.DS_Store in gitignore**: Already present in `.gitignore` and removed from commits.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/your-username/task-manager](https://github.com/your-username/task-manager)