import { PostStatus } from "@prisma/client";
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().optional(),
  slug: z.string().min(1),
  status: z.enum(PostStatus).optional(),
  publishedAt: z.date().nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
