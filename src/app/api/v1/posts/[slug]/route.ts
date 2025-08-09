import { handle, successResponse, errorResponse } from "@/lib/api"
import { findPublishedPostBySlug } from "@/modules/posts/posts.repository"

export const GET = (req: Request, { params }: { params: { slug: string } }) =>
  handle(async () => {
    const post = await findPublishedPostBySlug(params.slug)
    if (!post) return errorResponse("Post not found", 404, "NOT_FOUND")
    return successResponse({ ...post, publishedAt: post.publishedAt?.toISOString() ?? null })
  })
