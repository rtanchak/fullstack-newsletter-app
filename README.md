# Fullstack Newsletter Application

A modern, full-stack newsletter application built with Next.js, Material UI, Prisma, and PostgreSQL. This application allows you to create, manage, and publish newsletter posts, handle subscriber management, and schedule automated email notifications.

## Tech Stack
- **Frontend**
  Next.js(App Router), React, Material UI, Axios, React Query

- **Backend**
  Next.js API Routes, Prisma ORM, PostgreSQL database, Zod for validation

- **General**
  TypeScript, Swagger, PNPM, Docker, Docker Compose

## Questions
### Why This Tech Stack?
- *TypeScript*: Provides strong typing that catches errors during development rather than runtime.eEnsure consistency in data structures and better understanding of code

- *Next.js*: preformance, server-side rendering(SSR), static content generation(SCG), clear structure, intuitive way to organize routes and enables easy implementation of layouts and nested routes

- *pnpm*: fast package manager, avoid duplications

- *Material UI*: speeds up UI development significaly: awesome ready styles, capability to set up themes, accessible components

- *React Query*:  efficient data fetching, caching, and state management specifically for server state, reducing unnecessary network requests

- *Vercel*: a lot of features, used for speeding up development with creating database and cron. Initially considered for future deployment

- *Prisma ORM*: Selected for its type-safe database access, automatic migrations, schema approach. Prisma is easy to use with a lot if features included, like prisma studio for database management or prisma client generation

- *PostgreSQL*: best releational database. Works perfectly at handling structured data. It has connection pull and a lot of extensions. Here it was used PrismaPostgreSQL created from Vercel to speed up development and then local setup was done with docker-compose and PostgresSQL created from scratch 

- *Swagger*: docs for API

- *Docker*: Ensures consistent development and production environments, simplifying deployment and scaling

### What were some of the trade-offs you made when building this application? Why were these acceptable trade-offs?
- *Frontend*: use material ui to speed up the development, and it costs runtime performance since the styles are generated on runtime plus it's heavy. 

- *Backend*: Use jobs table for publishing and email notifications. It creates unnecessary complexity, mix things up a bit. I added it as sending emails with api call directly after publishing within the same request is not a proper way(single responsibility, latency). Much better would be to have some message-broker for notifications. Another thing is that we delegate idempotency management of sending emails to 3rd-party vendor. Not sure if that is a terrible thing as we have isolated *emails* module so we do not maitain what was sent. In future may need to think about having a separate table to store some email campaigns. For strategies I used classes although we use functions across project. I'd like to have consistentcy everywhere, 

### Given more time, what improvements or optimizations would you want to add? When would you add them?
- *Frontend*: add tests, login (we have a placeholder for author scope), rich text editor for posts, filtering, sorting edit + delete posts, draft posts, subscription management
- *Backend*: add tests(unit, integrations, end-to-end), oauth2.0, add redis for jobs and session management, refactor notifications to use event-drive approach, subscription manegement, performance optimization(query caching, etc)

### How would you deploy the application in a production-ready way?

App is hosted on Vercel with GitHuband CircleCI. Every pull request to the repository triggers a CircleCI pipeline that installs dependencies with pnpm, performs type-checking, linting, and automated tests, builds the application, and applies Prisma migrations to a staging database using prisma migrate deploy. Use snyk to prevent secrets being exposed in the repo. Vercel’s GitHub integration automatically crate a Preview Deployment that we use to test. 

When a pull request is approved and merged into main, the staging deployment process begins automatically. CircleCI runs the same migration process against the staging database and deploys the build to the Vercel staging environment. Promotion to production is gated through a manual approval process: the pipeline pauses until  reviewer approve the production job. Only after approval does CircleCI run prisma migrate deploy against the production database, followed by a production deployment to Vercel. This ensures database schema and application code remain in lockstep, with changes promoted deliberately rather than automatically.

Scheduled work is handled by Vercel Cron. It calls jobs endpoint to publish due posts and send notifications.
Email notifications are sent using 3rd-party vendor.

## Getting Started

### Prerequisites
- Node.js 18+
- PNPM package manager
- Docker & Docker Compose (for containerized setup)

### Local Development

#### Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/rtanchak/fullstack-newsletter-app.git
   cd fullstack-newsletter-app
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables (if not already created)
   ```bash
   # Create .env.local file
   echo "POSTGRES_PRISMA_URL=postgresql://postgres:postgres@localhost:5432/newsletter" > .env.local
   echo "POSTGRES_URL_NON_POOLING=postgresql://postgres:postgres@localhost:5432/newsletter" >> .env.local
   ```

4. Set up database, run migrations, and seed data (all-in-one comman)
   ```bash
   pnpm db:local:seed
   ```
   This command:
   - Starts a PostgreSQL container using Docker Compose
   - Runs all database migrations
   - Seeds the database with sample data

5. Start the development server
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Setup (Full Application)

1. Clone the repository
   ```bash
   git clone https://github.com/rtanchak/fullstack-newsletter-app.git
   cd fullstack-newsletter-app
   ```

2. Build and start all containers
   ```bash
   docker-compose up --profile default -d
   ```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

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

The API documentation is available at `/api/docs` when the application is running.

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

The application is containerized and can be deployed to any environment that supports Docker. The included Docker configuration provides


## License
This project has no license.
