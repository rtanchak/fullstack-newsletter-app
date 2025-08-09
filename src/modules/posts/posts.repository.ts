// src/modules/posts/repo.ts
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export async function findPublishedPosts(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const where = { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: { id: true, title: true, slug: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items: items.map((p) => ({ ...p, publishedAt: p.publishedAt?.toISOString() ?? null })),
    total,
  };
}

export async function findPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    select: { id: true, title: true, slug: true, content: true, publishedAt: true, createdAt: true, updatedAt: true },
  });
}

export async function createPost(data: {
  title: string;
  content: string;
  slug: string;
  status: PostStatus;
  publishedAt: Date | null;
}) {
  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      slug: data.slug,
      status: data.status,
      publishedAt: data.publishedAt,
    },
  });
}

export async function findPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
  });
}
