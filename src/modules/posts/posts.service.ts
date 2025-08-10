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
import { prisma } from "@/lib/prisma";
import { jobsService } from "@/modules/jobs/jobs.service";

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

  const post = await createPostRepo({
    title: input.title,
    content: input.content,
    slug,
    author,
    status,
    publishedAt,
  });

  if (status === PostStatus.PUBLISHED) {
    await jobsService.enqueueEmailNotifications(post.id, now);
  } else if (status === PostStatus.SCHEDULED && input.publishedAt) {
    const scheduledDate = new Date(input.publishedAt);
    await jobsService.enqueuePublication(post.id, scheduledDate);
  }

  return post;
}

export async function getPublishedPosts(page: number, limit: number) {
  return findPublishedPosts(page, limit);
}

export async function getPublishedPost(slug: string) {
  return findPublishedPostBySlug(slug);
}

export async function publishPost(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new ApiError("Post not found", 404, "POST_NOT_FOUND");

  if (post.status !== PostStatus.PUBLISHED) {
    const publishedAt = new Date();
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: PostStatus.PUBLISHED, publishedAt: publishedAt },
    });
    await jobsService.enqueueEmailNotifications(postId, publishedAt);

    return updatedPost;
  }
  
  return post;
}

export async function getPostsByIds(postIds: string[]) {
  return prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, title: true, content: true, slug: true }
  });
}
