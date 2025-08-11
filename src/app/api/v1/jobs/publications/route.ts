import { NextResponse } from 'next/server';
import { jobsService } from '@/modules/jobs/jobs.service';
import { EnqueuePublicationBody } from '@/modules/jobs/jobs.schemas';
import { ApiError } from '@/lib/api/api';

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
    
    try {
      const job = await jobsService.enqueuePublication(postId, new Date(when));
      return NextResponse.json({ success: true, job });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to enqueue publication job:', error);
    return NextResponse.json(
      { error: 'Failed to enqueue publication job' },
      { status: 500 }
    );
  }
}
