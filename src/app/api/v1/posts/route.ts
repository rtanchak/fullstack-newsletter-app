import { handle, successResponse } from "@/lib/api"
import { getPublishedPosts } from "@/modules/posts/posts.service"

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: List published posts
 *     description: Returns a paginated list of published posts, sorted by publish date (desc).
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: OK — returns posts and pagination meta.
 *       500:
 *         description: Server error.
 */
export const GET = (req: Request) =>
  handle(async () => {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")))

    const { items, total } = await getPublishedPosts(page, limit)

    return successResponse(items, { meta: { page, limit, total } })
  })
