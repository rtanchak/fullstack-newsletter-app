import { Job, JobType } from '@prisma/client';
import type { JobStrategy, JobResult } from './job.strategy';
import { emailService } from '@/modules/notifications/emails/email.service';

export class NotificationStrategy implements JobStrategy {
  readonly type = JobType.POST_EMAIL_NOTIFICATION;

  async run(job: Job): Promise<JobResult> {
    const result = await emailService.sendPostPublishedEmails(job.postId);
    console.log(`Email notification job completed: ${result.sentCount} emails sent`);
    
    if (result.campaignId) {
      console.log(`Campaign ID: ${result.campaignId}`);
    }
    
    if (result.messageId) {
      console.log(`Message ID: ${result.messageId}`);
    }
    
    return {
      sentCount: result.sentCount,
      campaignId: result.campaignId || '',
      messageId: result.messageId || '',
      postId: job.postId
    };
  }
}
