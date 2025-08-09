import { handle, successResponse } from "@/lib/api"
import { findPublishedPosts } from "@/modules/posts/posts.repository"

export const GET = (req: Request) =>
  handle(async () => {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")))

    const { items, total } = await findPublishedPosts(page, limit)

    return successResponse(items, { meta: { page, limit, total } })
  })
