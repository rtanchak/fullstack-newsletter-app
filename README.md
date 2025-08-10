# Fullstack Newsletter Application

A modern, full-stack newsletter application built with Next.js, Material UI, Prisma, and PostgreSQL. This application allows you to create, manage, and publish newsletter posts, handle subscriber management, and schedule automated email notifications.

## Features

- **Content Management**
  - Author new posts with a user-friendly interface
  - View published posts in read-only mode
  - Schedule posts to be published at a later date

- **Subscriber Management**
  - Sign up for the newsletter with email validation
  - Manage subscriber database with active/inactive status

- **API Integration**
  - Retrieve blog posts from API including content
  - Comprehensive OpenAPI/Swagger documentation
  - Interactive API explorer

- **Notification System**
  - Send emails to subscribers upon publishing a post
  - Background job processing for scheduled tasks

- **Modern UI**
  - Responsive Material UI components

## Tech Stack

- **Frontend**
  - Next.js 15 (App Router)
  - React 19
  - Material UI 7
  - Axios for API requests
  - React Query for data fetching

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL database
  - Zod for validation

- **DevOps**
  - Docker & Docker Compose
  - Multi-stage Docker builds
  - Database migrations

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM package manager
- Docker & Docker Compose (for containerized setup)
- PostgreSQL (if running locally)

### Local Development

#### Quick Start (Recommended)

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fullstack-newsletter-app.git
   cd fullstack-newsletter-app
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up database, run migrations, and seed data (all-in-one command)
   ```bash
   pnpm db:local:seed
   ```
   This command:
   - Starts a PostgreSQL container using Docker Compose
   - Runs all database migrations
   - Seeds the database with sample data

4. Start the development server
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Manual Setup

1. Clone and install dependencies as above (steps 1-2)

2. Start the PostgreSQL database only
   ```bash
   pnpm db:local
   ```

3. Set up environment variables (if not already created)
   ```bash
   # Create .env.local file
   echo "POSTGRES_PRISMA_URL=postgresql://postgres:postgres@localhost:5432/newsletter" > .env.local
   echo "POSTGRES_URL_NON_POOLING=postgresql://postgres:postgres@localhost:5432/newsletter" >> .env.local
   ```

4. Run database migrations
   ```bash
   pnpm prisma migrate dev
   ```

5. Seed the database (optional)
   ```bash
   pnpm seed
   ```

6. Start the development server
   ```bash
   pnpm dev
   ```

### Docker Setup (Full Application)

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fullstack-newsletter-app.git
   cd fullstack-newsletter-app
   ```

2. Build and start all containers
   ```bash
   docker-compose up -d
   ```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

4. To seed the database (optional)
   ```bash
   docker-compose exec app pnpm seed
   ```

## Project Structure

```
/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (author)/     # Author-specific routes
│   │   ├── (public)/     # Public-facing routes
│   │   └── api/          # API endpoints
│   │       ├── docs/     # API documentation
│   │       └── v1/       # API version 1 routes
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── api/          # API client utilities
│   │   ├── types/        # TypeScript type definitions
│   │   └── ui/           # UI utilities
│   │   └── utils/        # Utility functions
│   ├── modules/          # Business logic modules
│   │   ├── jobs/         # Job scheduling and processing
│   │   ├── notifications/# Email notification system
│   │   ├── posts/        # Post management
│   │   └── subscribers/  # Subscriber management
│   └── styles/           # Global styles
└── docker-compose.yml    # Docker configuration
```

## API Documentation

The API documentation is available at `/api/docs` when the application is running. It provides a comprehensive overview of all available endpoints, request/response schemas, and authentication requirements.

### Key Endpoints

- **Posts**
  - `GET /api/v1/posts` - List published posts (paginated)
  - `GET /api/v1/posts/{slug}` - Get post by slug
  - `POST /api/v1/posts` - Create a new post

- **Subscriptions**
  - `POST /api/v1/subscriptions` - Subscribe to the newsletter

- **Jobs**
  - `POST /api/v1/jobs` - Process due jobs
  - `POST /api/v1/jobs/publications` - Schedule post publication
  - `POST /api/v1/jobs/notifications` - Schedule email notifications

## Deployment

The application is containerized and can be deployed to any environment that supports Docker. The included Docker configuration provides:

- Multi-stage builds for optimized container size
- Automatic database migrations
- Production-ready Node.js configuration

### Production Deployment
TODO

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project has no license.
