import { handle, successResponse, createdResponse } from "@/lib/api";
import { service, schemas } from "@/modules/posts";
import { NextRequest } from "next/server";

export const GET = handle(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));

    const { items, total } = await service.getPublishedPosts(page, limit);

    return successResponse(items, { meta: { page, limit, total } });
  });

export const POST = handle(async (req: NextRequest) => {
  const body = await req.json();
  const data = schemas.createPostRequestSchema.parse(body);
  const post = await service.createPost(data);
  
  return createdResponse(post);
});

