import * as postsService from '@/modules/posts/posts.service';
import * as subscribersService from '@/modules/subscribers/subscribers.service';
import { ApiError } from '@/lib/api';
import { ResendMailProvider } from '@/modules/notifications/emails/providers/3rd-party.provider';
import { SendEmailOptions, SendEmailResponse, EmailTemplateData, ProcessResult } from '@/lib/types/emails';

const emailProvider = new ResendMailProvider();

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
  return emailProvider.send(options);
}

export async function sendPostPublishedEmails(postId: string): Promise<ProcessResult> {
  const post = await postsService.getPublishedPost(postId);
  if (!post) throw new ApiError('Post not found or not published', 404, 'POST_NOT_FOUND');
  
  const subscribers = await subscribersService.getActiveSubscribers();
  if (subscribers.length === 0) {
    return { sentCount: 0 };
  }
  
  const templateData: EmailTemplateData = {
    postTitle: post.title,
    postContent: post.content,
    postSlug: post.slug,
    publishedAt: post.publishedAt?.toISOString() || new Date().toISOString()
  };
  
  const campaignId = `post-${post.id}-${Date.now()}`;
  
  const recipients = subscribers.map(sub => ({
    email: sub.email,
    id: sub.id
  }));
  
  const response = await sendEmail({
    recipients,
    subject: `New Post: ${post.title}`,
    templateId: 'post_published',
    campaignId,
    templateData
  });
  
  return {
    sentCount: recipients.length,
    campaignId,
    messageId: response.messageId
  };
} 

export const emailService = {
  sendEmail,
  sendPostPublishedEmails
};
