# Fullstack Newsletter Application

A modern, full-stack newsletter application built with Next.js, Material UI, Prisma, and PostgreSQL. This application allows you to create, manage, and publish newsletter posts, handle subscriber management, and schedule automated email notifications.

![Newsletter App](https://via.placeholder.com/800x400?text=Newsletter+App)

## Features

- **Content Management**
  - Create, edit, and publish newsletter posts
  - Schedule posts for future publication
  - Rich text editing capabilities

- **Subscriber Management**
  - User-friendly subscription form
  - Subscriber database with active/inactive status
  - Email validation

- **Automated Jobs**
  - Scheduled post publication
  - Automated email notifications
  - Background job processing

- **API Documentation**
  - Comprehensive OpenAPI/Swagger documentation
  - Self-documenting API endpoints
  - Interactive API explorer

- **Modern UI**
  - Responsive Material UI components
  - Custom theming
  - Mobile-friendly design

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

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fullstack-newsletter-app.git
   cd fullstack-newsletter-app
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database connection details
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

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Setup

1. Build and start the containers
   ```bash
   docker-compose up -d
   ```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

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
- Database seeding (optional)

### Production Deployment

```bash
# Build and deploy the application
docker-compose -f docker-compose.yml up -d
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project has no license.
