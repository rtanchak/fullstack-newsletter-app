import { NextResponse } from 'next/server';
import { jobsService } from '@/modules/jobs/jobs.service';
import { EnqueueNotificationBody } from '@/modules/jobs/jobs.schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = EnqueueNotificationBody.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { postId, when } = result.data;
    const job = await jobsService.enqueueEmailNotifications(postId, new Date(when));
    
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Failed to enqueue email notification job:', error);
    return NextResponse.json(
      { error: 'Failed to enqueue email notification job' },
      { status: 500 }
    );
  }
}
