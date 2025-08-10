import { handle, successResponse, errorResponse } from "@/lib/api";
import { NextRequest } from "next/server";
import { service } from "@/modules/posts";

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  return handle(async () => {
    const resolvedParams = await params;
    const post = await service.getPublishedPost(resolvedParams.slug);
    if (!post) return errorResponse("Post not found", 404, "NOT_FOUND");
    return successResponse({ ...post, publishedAt: post.publishedAt?.toISOString() ?? null });
  })(req);
}
