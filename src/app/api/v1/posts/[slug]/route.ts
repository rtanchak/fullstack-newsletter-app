import { handle, successResponse, errorResponse } from "@/lib/api"
import { findPublishedPostBySlug } from "@/modules/posts/posts.repository"

/**
 * @swagger
 * /api/v1/posts/{slug}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get one published post by slug
 *     description: Returns a single published post by its slug if it is published and not in the future.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the post.
 *     responses:
 *       200:
 *         description: OK — returns the post.
 *       404:
 *         description: Post not found.
 */

export const GET = (req: Request, { params }: { params: { slug: string } }) =>
  handle(async () => {
    const post = await findPublishedPostBySlug(params.slug)
    if (!post) return errorResponse("Post not found", 404, "NOT_FOUND")
    return successResponse({ ...post, publishedAt: post.publishedAt?.toISOString() ?? null })
  })
