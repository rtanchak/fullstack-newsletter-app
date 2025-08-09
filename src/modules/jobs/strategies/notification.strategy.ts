import { Job, JobType, PostStatus } from '@prisma/client';
import type { JobStrategy } from './job.strategy';
import { prisma } from '@/lib/prisma';

export class NotificationStrategy implements JobStrategy {
  readonly type = JobType.POST_EMAIL_NOTIFICATION;

  async run(job: Job) {
    await prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({ where: { id: job.postId } });
      if (!post) throw new Error('Post not found');

      if (post.status !== PostStatus.PUBLISHED) {
        await tx.post.update({
          where: { id: job.postId },
          data: { status: PostStatus.PUBLISHED, publishedAt: new Date() },
        });
      }
      
      const subscribers = await tx.subscriber.findMany({
        where: { active: true },
        select: { id: true, email: true }
      });
      
      console.log(`Would send emails to ${subscribers.length} subscribers for post ${post.title}`);
      
      if (subscribers.length > 0) {
        await tx.emailSend.createMany({
          data: subscribers.map(sub => ({
            postId: post.id,
            subscriberId: sub.id
          })),
          skipDuplicates: true
        });
      }
    });
  }
}
