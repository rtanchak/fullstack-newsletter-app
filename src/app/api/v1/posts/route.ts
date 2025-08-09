import { handle, successResponse } from "@/lib/api";
import { service, schemas } from "@/modules/posts";

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
export async function POST(req: NextRequest) {
  if (!isAuthor(req)) {
    return NextResponse.json({ data: null, error: { message: 'Unauthorized' } }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = CreatePostDto.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: { message: 'Validation error' } }, { status: 400 });
  }

  const { title, content, status, publishAt, slug } = parsed.data;
  const finalSlug = slug ?? slugify(title);

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        status,
        slug: finalSlug,
        publishAt: publishAt ? new Date(publishAt) : null,
      },
    });
    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (e: any) {
    // Prisma unique constraint on slug → conflict
    if (e?.code === 'P2002') {
      return NextResponse.json({ data: null, error: { message: 'Slug already exists' } }, { status: 409 });
    }
    return NextResponse.json({ data: null, error: { message: 'Server error' } }, { status: 500 });
  }
}

