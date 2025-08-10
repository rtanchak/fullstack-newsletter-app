import type { Job } from '@prisma/client';

// Define a generic return type for job strategies
export interface JobResult {
  [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
}

export interface JobStrategy {
  readonly type: Job['jobType'];
  run(job: Job): Promise<void | JobResult>;
}
