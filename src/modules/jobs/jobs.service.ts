import { Job, JobType } from '@prisma/client';
import * as jobsRepository from './jobs.repository';
import { PublicationStrategy } from './strategies/publication.strategy';
import { NotificationStrategy } from './strategies/notification.strategy';
import type { JobStrategy } from './strategies/job.strategy';
import { ProcessResult } from './jobs.schemas';

const DEFAULT_CONCURRENCY = 3;
const DEFAULT_CHUNK_SIZE = 10;

const strategies: Record<JobType, JobStrategy> = {
  [JobType.POST_PUBLICATION]: new PublicationStrategy(),
  [JobType.POST_EMAIL_NOTIFICATION]: new NotificationStrategy(),
};

export const jobsService = {
  enqueuePublication(postId: string, when: Date) {
    return jobsRepository.createIfNotExists({
      postId,
      jobType: JobType.POST_PUBLICATION,
      scheduledAt: when,
    });
  },

  enqueueEmailNotifications(postId: string, when: Date) {
    return jobsRepository.createIfNotExists({
      postId,
      jobType: JobType.POST_EMAIL_NOTIFICATION,
      scheduledAt: when,
    });
  },

  async processDue(now = new Date(), chunkSize = DEFAULT_CHUNK_SIZE, concurrency = DEFAULT_CONCURRENCY) {
    const due = await jobsRepository.getDuePending(now);
    let publishedCount = 0;
    let emailedCount = 0;
    
    for (let i = 0; i < due.length; i += chunkSize) {
      const chunk = due.slice(i, i + chunkSize);
      
      for (let j = 0; j < chunk.length; j += concurrency) {
        const concurrentJobs = chunk.slice(j, j + concurrency);
        const results = await Promise.allSettled(
          concurrentJobs.map((job: Job) => this.processJob(job))
        );
        
        results.forEach((result: PromiseSettledResult<boolean>, index: number) => {
          if (result.status === 'fulfilled' && result.value) {
            const job = concurrentJobs[index];
            if (job.jobType === JobType.POST_PUBLICATION) publishedCount++;
            if (job.jobType === JobType.POST_EMAIL_NOTIFICATION) emailedCount++;
          }
        });
      }
    }

    const result = { publishedCount, emailedCount };
    return ProcessResult.parse(result);
  },
  
  async processJob(job: Job) {
    const strategy = strategies[job.jobType];
    if (!strategy) {
      await jobsRepository.markFailed(job.id);
      return false;
    }

    try {
      await strategy.run(job);
      await jobsRepository.markCompleted(job.id);
      return true;
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await jobsRepository.markFailed(job.id);
      return false;
    }
  },
}
