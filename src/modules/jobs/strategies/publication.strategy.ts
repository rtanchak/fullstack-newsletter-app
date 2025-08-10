import { Job, JobType } from '@prisma/client';
import type { JobStrategy } from './job.strategy';
import { jobsService } from '../jobs.service';
import * as postsService from '@/modules/posts/posts.service';

export class PublicationStrategy implements JobStrategy {
  readonly type = JobType.POST_PUBLICATION

  async run(job: Job) {
    await postsService.publishPost(job.postId);
    await jobsService.enqueueEmailNotifications(job.postId, new Date());
  }
}
