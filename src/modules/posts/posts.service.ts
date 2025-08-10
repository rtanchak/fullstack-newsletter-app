import { ApiError } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { CreatePostFromRequestDto } from "./posts.schemas";
import { PostStatus } from "@prisma/client";
import {
  findPublishedPosts,
  findPublishedPostBySlug,
  createPost as createPostRepo,
  findPostBySlug
} from "./posts.repository";

const DEFAULT_AUTHOR = "newsletter-app-editor";

export async function createPost(input: CreatePostFromRequestDto) {
  const slug = input.slug ?? slugify(input.title);
  const author = input.author ?? DEFAULT_AUTHOR;

  const exists = await findPostBySlug(slug);
  if (exists) throw new ApiError("Slug already exists", 409, "SLUG_EXISTS");

  const now = new Date();
  let publishedAt: Date | null = null;

  if (input.status === PostStatus.PUBLISHED) {
    publishedAt = now;
  }

  const status = input.status ?? PostStatus.DRAFT;

  return createPostRepo({
    title: input.title,
    content: input.content,
    slug,
    author,
    status,
    publishedAt,
  });
}

export async function getPublishedPosts(page: number, limit: number) {
  return findPublishedPosts(page, limit);
}

export async function getPublishedPost(slug: string) {
  return findPublishedPostBySlug(slug);
}
