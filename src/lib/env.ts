import { z } from "zod";

const EnvSchema = z.object({
  VERCEL_OIDC_TOKEN: z.string().optional(),
  POSTGRES_PRISMA_URL: z.string().min(1, "POSTGRES_PRISMA_URL is required"),
  POSTGRES_URL_NON_POOLING: z.string().min(1, "POSTGRES_URL_NON_POOLING is required"),
  NODE_ENV: z.string().optional().default("development"),
});

export const env = EnvSchema.parse({
  VERCEL_OIDC_TOKEN: process.env.VERCEL_OIDC_TOKEN,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  NODE_ENV: process.env.NODE_ENV,
});
