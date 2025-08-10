import { NextResponse } from 'next/server';
import { jobsService } from '@/modules/jobs/jobs.service';
import { EnqueuePublicationBody } from '@/modules/jobs/jobs.schemas';

/**
 * @swagger
 * /api/v1/jobs/publication:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Enqueue post publication job
 *     description: Schedules a post to be published at a specific time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - when
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to be published
 *               when:
 *                 type: string
 *                 format: date-time
 *                 description: When to publish the post
 *     responses:
 *       200:
 *         description: Job successfully enqueued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     data:
 *                       type: object
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Failed to enqueue job
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = EnqueuePublicationBody.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { postId, when } = result.data;
    const job = await jobsService.enqueuePublication(postId, new Date(when));
    
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Failed to enqueue publication job:', error);
    return NextResponse.json(
      { error: 'Failed to enqueue publication job' },
      { status: 500 }
    );
  }
}
