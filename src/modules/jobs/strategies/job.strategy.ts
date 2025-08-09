import type { Job } from '@prisma/client';

export interface JobStrategy {
  readonly type: Job['jobType'];
  run(job: Job): Promise<void>;
}
