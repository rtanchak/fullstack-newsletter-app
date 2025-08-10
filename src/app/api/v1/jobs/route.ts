import { NextResponse } from 'next/server';
import { jobsService } from '@/modules/jobs/jobs.service';

export async function POST() {
  try {
    const now = new Date();
    const result = await jobsService.processDue(now);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to process due jobs:', error);
    return NextResponse.json(
      { error: 'Failed to process due jobs' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const now = new Date();
    const result = await jobsService.processDue(now);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to process due jobs:', error);
    return NextResponse.json(
      { error: 'Failed to process due jobs' },
      { status: 500 }
    );
  }
}
