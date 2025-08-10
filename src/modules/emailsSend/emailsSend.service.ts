import * as emailsSendRepository from './emailsSend.repository';
import { ResendMailProvider } from '@/modules/notifications/emails/providers/3rd-party.provider';
import { ProcessEmailSendsResultDto } from './emailsSend.schemas';
import * as postsService from '@/modules/posts/posts.service';
import * as subscribersService from '@/modules/subscribers/subscribers.service';

const DEFAULT_CONCURRENCY = 5;
const EMAIL_TEMPLATE_ID = 'post_published';
const EMAIL_SUBJECT = 'New post published';

const emailProvider = new ResendMailProvider();

export async function createEmailSend(postId: string, subscriberId: string) {
  return emailsSendRepository.createIfNotExists({ postId, subscriberId });
}

export async function queueEmailsForPost(postId: string) {
  const subscribers = await subscribersService.getActiveSubscribers();
  
  if (subscribers.length === 0) {
    return { queuedCount: 0 };
  }
  
  await emailsSendRepository.createMany(
    subscribers.map((sub: { id: string }) => ({
      postId,
      subscriberId: sub.id
    }))
  );
  
  return { queuedCount: subscribers.length };
}

export async function processEmailSends(concurrency = DEFAULT_CONCURRENCY) {
    const emailSends = await emailsSendRepository.getUnsentEmailSends();

    if (emailSends.length === 0) {
      return ProcessEmailSendsResultDto.parse({ sentCount: 0 });
    }

    const postIds = [...new Set(emailSends.map((e: { postId: string }) => e.postId))];
    const subscriberIds = [...new Set(emailSends.map((e: { subscriberId: string }) => e.subscriberId))];
    const posts = await postsService.getPostsByIds(postIds);
    const subscribers = await subscribersService.getSubscribersByIds(subscriberIds);
    
    const postsMap = new Map(posts.map((p: { id: string }) => [p.id, p]));
    const subscribersMap = new Map(subscribers.map((s: { id: string; email: string }) => [s.id, s]));

    let sentCount = 0;
    const emailSendIds: string[] = [];
    
    for (let i = 0; i < emailSends.length; i += concurrency) {
      const batch = emailSends.slice(i, i + concurrency);
      
      await Promise.allSettled(batch.map(async (emailSend) => {
        try {
          const post = postsMap.get(emailSend.postId);
          const subscriber = subscribersMap.get(emailSend.subscriberId);
          
          if (!post || !subscriber) {
            console.error(`Missing data for email send ${emailSend.id}`);
            return { success: false, id: emailSend.id };
          }
          
          await emailProvider.send(
            subscriber.email,
            EMAIL_SUBJECT,
            EMAIL_TEMPLATE_ID
          );
          emailSendIds.push(emailSend.id);
          sentCount++;
          return { success: true, id: emailSend.id };
        } catch (error) {
          console.error(`Failed to send email ${emailSend.id}:`, error);
          return { success: false, id: emailSend.id };
        }
      }));
    }

    if (emailSendIds.length > 0) {
      await emailsSendRepository.updateMany({
        where: { id: { in: emailSendIds } },
        data: { sentAt: new Date() }
      });
    }

    const result = { sentCount };
    return ProcessEmailSendsResultDto.parse(result);
}

export async function getEmailSendsByPost(postId: string) {
  return emailsSendRepository.getByPostId(postId);
}

export async function getEmailSendsBySubscriber(subscriberId: string) {
  return emailsSendRepository.getBySubscriberId(subscriberId);
}
