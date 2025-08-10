import { PostStatus } from "@prisma/client";
import { z } from "zod";

const basePostSchema = {
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().optional(),
  status: z.enum(PostStatus).optional(),
  publishedAt: z.union([
    z.date(),
    z.string().transform((str) => new Date(str))
  ]).nullable().optional(),
};

export const createPostRequestSchema = z.object({
  ...basePostSchema,
  slug: z.string().min(1).optional(),
});
export const createPost  = z.object({
  ...basePostSchema,
  slug: z.string().min(1),
});

export type CreatePostFromRequestDto = z.infer<typeof createPostRequestSchema>;
export type CreatePostDto = z.infer<typeof createPost>;
