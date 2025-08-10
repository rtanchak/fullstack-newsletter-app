import * as postsService from '@/modules/posts/posts.service';
import { ApiError } from '@/lib/api';
import { ResendMailProvider } from '@/modules/notifications/emails/providers/3rd-party.provider';
import { queueEmailsForPost, processEmailSends } from '@/modules/emailsSend/emailsSend.service';

const emailProvider = new ResendMailProvider();

export async function sendEmail(email: string, subject: string, templateId: string) {
  return emailProvider.send(email, subject, templateId);
}

export async function sendPostPublishedEmails(postId: string) {
  const post = await postsService.getPublishedPost(postId);
  if (!post) throw new ApiError('Post not found or not published', 404, 'POST_NOT_FOUND');
  
  await queueEmailsForPost(postId);
  return processEmailSends();
} 

export const emailService = {
  sendEmail,
  sendPostPublishedEmails
};
