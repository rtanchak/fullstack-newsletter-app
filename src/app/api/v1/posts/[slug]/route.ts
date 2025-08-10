import { handle, successResponse, errorResponse } from "@/lib/api/api";
import { NextRequest } from "next/server";
import { service } from "@/modules/posts";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  return handle(async () => {
    const resolvedParams = await params;
    const post = await service.getPublishedPost(resolvedParams.slug);
    if (!post) return errorResponse("Post not found", 404, "NOT_FOUND");
    return successResponse({ ...post, publishedAt: post.publishedAt?.toISOString() ?? null });
  })(req);
}
