import { ApiError } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { CreatePostFromRequestDto } from "./posts.schemas";
import { Post, PostStatus } from '@prisma/client';
import { PublishedPost, PostSummary } from '@/lib/types';
import { prisma } from "@/lib/prisma";
import { jobsService } from "@/modules/jobs/jobs.service";

const DEFAULT_AUTHOR = "newsletter-app-editor";

export async function createPost(input: CreatePostFromRequestDto): Promise<Post> {
  const slug = input.slug ?? slugify(input.title);
  const author = input.author ?? DEFAULT_AUTHOR;

  const exists = await prisma.post.findUnique({ where: { slug } });
  if (exists) throw new ApiError("Slug already exists", 409, "SLUG_EXISTS");

  const now = new Date();
  let publishedAt: Date | null = null;

  if (input.status === PostStatus.PUBLISHED) {
    publishedAt = now;
  }

  const status = input.status ?? PostStatus.DRAFT;

  const post = await prisma.post.create({
    data: {
      title: input.title,
      content: input.content,
      slug,
      author,
      status,
      publishedAt,
    },
  });

  if (status === PostStatus.PUBLISHED) {
    await jobsService.enqueueEmailNotifications(post.id, now);
  } else if (status === PostStatus.SCHEDULED && input.publishedAt) {
    const scheduledDate = new Date(input.publishedAt);
    await jobsService.enqueuePublication(post.id, scheduledDate);
  }

  return post;
}

export async function getPublishedPosts(page: number, limit: number): Promise<{
  items: Array<PostSummary>;
  total: number;
}> {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED, publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      author: true
    }
  });
  
  const formattedPosts = posts.map(post => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null
  }));
  
  const total = await prisma.post.count({
    where: { status: PostStatus.PUBLISHED, publishedAt: { not: null } }
  });
  
  return { items: formattedPosts, total };
}


export async function getPublishedPost(slug: string): Promise<PublishedPost | null> {
  return prisma.post.findFirst({
    where: {
      slug,
      status: PostStatus.PUBLISHED,
      publishedAt: { not: null }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function publishPost(postId: string): Promise<Post> {
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

export async function getPostsByIds(postIds: string[]): Promise<Array<{
  id: string;
  title: string;
  content: string;
  slug: string;
}>> {
  return prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, title: true, content: true, slug: true }
  });
}
