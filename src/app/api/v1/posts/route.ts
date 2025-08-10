import { handle, successResponse, createdResponse } from "@/lib/api";
import { service, schemas } from "@/modules/posts";
import { NextRequest } from "next/server";

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
export const GET = handle(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));

    const { items, total } = await service.getPublishedPosts(page, limit);

    return successResponse(items, { meta: { page, limit, total } });
  });

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     description: Creates a draft or published post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *           examples:
 *             draft:
 *               summary: Create a draft post
 *               value:
 *                 title: My New Draft Post
 *                 content: This is the content of my draft post.
 *                 slug: my-new-draft-post
 *             published:
 *               summary: Create a published post
 *               value:
 *                 title: My New Published Post
 *                 content: This is the content of my published post.
 *                 slug: my-new-published-post
 *                 status: PUBLISHED
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already exists
 */
export const POST = handle(async (req: NextRequest) => {
  const body = await req.json();
  const data = schemas.createPostRequestSchema.parse(body);
  const post = await service.createPost(data);
  
  return createdResponse(post);
});

