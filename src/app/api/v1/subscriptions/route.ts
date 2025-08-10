import {service, schemas} from "@/modules/subscribers";
import { handle, successResponse, errorResponse } from "@/lib/api";

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     tags:
 *       - Subscriptions
 *     summary: Subscribe to newsletter
 *     description: Creates a new subscriber entry for the newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to subscribe
 *               name:
 *                 type: string
 *                 description: Subscriber's name (optional)
 *     responses:
 *       200:
 *         description: Successfully subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const POST = handle(async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = schemas.subscribeSchema.parse(body);
    const data = await service.subscribe(parsed);

    return successResponse(data);
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ??
      err?.message ??
      "Validation or server error;";
    const status = err?.name === "ZodError" ? 400 : 500;

    return errorResponse(message, status);
  }
});
