  FROM node:18-alpine AS base
  WORKDIR /app
  RUN corepack enable && corepack prepare pnpm@latest --activate
  
  FROM base AS deps
  COPY package.json pnpm-lock.yaml* ./
  RUN pnpm install --frozen-lockfile
  
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN npx prisma generate
  RUN pnpm build
  
  FROM base AS migrate
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY prisma ./prisma
  COPY package.json pnpm-lock.yaml* ./
  RUN pnpm seed
  CMD ["npx", "prisma", "migrate", "deploy"]
  
  FROM node:18-alpine AS runner
  WORKDIR /app
  
  ENV NODE_ENV=production
  ENV PORT=3000
  
  RUN addgroup --system --gid 1001 nodejs \
   && adduser --system --uid 1001 nextjs
  USER nextjs
  
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  COPY --from=builder /app/prisma ./prisma
  
  EXPOSE 3000
  CMD ["node", "server.js"]
  