import { Job, JobType } from '@prisma/client';
import type { JobStrategy } from './job.strategy';
import { emailService } from '@/modules/notifications/emails/email.service';
import * as emailsSendService from '@/modules/emailsSend/emailsSend.service';

export class NotificationStrategy implements JobStrategy {
  readonly type = JobType.POST_EMAIL_NOTIFICATION;

  async run(job: Job) {
    await emailService.sendPostPublishedEmails(job.postId);
    await emailsSendService.processEmailSends();
  }
}
