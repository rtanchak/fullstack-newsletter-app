import { NextResponse } from 'next/server';
import { jobsService } from '@/modules/jobs/jobs.service';

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Process due jobs
 *     description: Processes all due jobs (publications and notifications) that are scheduled to run now
 *     responses:
 *       200:
 *         description: Jobs processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     publishedCount:
 *                       type: integer
 *                       description: Number of posts published
 *                     emailedCount:
 *                       type: integer
 *                       description: Number of email notifications sent
 *       500:
 *         description: Failed to process jobs
 */
export async function POST() {
  try {
    const now = new Date();
    const result = await jobsService.processDue(now);
    
    return NextResponse.json({ 
      success: true, 
      result 
    });
  } catch (error) {
    console.error('Failed to process due jobs:', error);
    return NextResponse.json(
      { error: 'Failed to process due jobs' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Process due jobs
 *     description: Processes all due jobs (publications and notifications) that are scheduled to run now
 *     responses:
 *       200:
 *         description: Jobs processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     publishedCount:
 *                       type: integer
 *                       description: Number of posts published
 *                     emailedCount:
 *                       type: integer
 *                       description: Number of email notifications sent
 *       500:
 *         description: Failed to process jobs
 */
export async function GET() {
  try {
    const now = new Date();
    const result = await jobsService.processDue(now);
    
    return NextResponse.json({ 
      success: true, 
      result 
    });
  } catch (error) {
    console.error('Failed to process due jobs:', error);
    return NextResponse.json(
      { error: 'Failed to process due jobs' },
      { status: 500 }
    );
  }
}
