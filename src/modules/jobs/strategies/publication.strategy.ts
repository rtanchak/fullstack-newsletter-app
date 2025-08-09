import { Job, JobType, PostStatus } from '@prisma/client';
import type { JobStrategy } from './job.strategy';
import { prisma } from '@/lib/prisma';
import { jobsService } from '../jobs.service';

export class PublicationStrategy implements JobStrategy {
  readonly type = JobType.POST_PUBLICATION

  async run(job: Job) {
    await prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({ where: { id: job.postId } })
      if (!post) throw new Error('Post not found')

      if (post.status !== PostStatus.PUBLISHED) {
        await tx.post.update({
          where: { id: job.postId },
          data: { status: PostStatus.PUBLISHED, publishedAt: new Date() },
        })
      }
    });
    await jobsService.enqueueEmailNotifications(job.postId, new Date());
  }
}
