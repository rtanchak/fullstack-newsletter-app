import { findPublishedPosts, findPublishedPostBySlug } from "./posts.repository";

export async function getPublishedPosts(page: number, limit: number) {
  return findPublishedPosts(page, limit);
}

export async function getPublishedPost(slug: string) {
  return findPublishedPostBySlug(slug);
}
