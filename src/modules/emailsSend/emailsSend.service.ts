import * as emailsSendRepository from './emailsSend.repository';
import { prisma } from '@/lib/prisma';

const DEFAULT_CONCURRENCY = 5;

export const emailsSendService = {
  /**
   * Creates an email send record for a subscriber
   */
  async createEmailSend(postId: string, subscriberId: string) {
    return emailsSendRepository.createIfNotExists({ postId, subscriberId });
  },

  /**
   * Creates email send records for multiple subscribers
   */
  async createEmailSendBatch(postId: string, subscriberIds: string[]) {
    const data = subscriberIds.map(subscriberId => ({ postId, subscriberId }));
    return emailsSendRepository.createMany(data);
  },

  /**
   * Processes email sends that haven't been sent yet
   * In a real application, this would connect to an email service
   */
  async processEmailSends(concurrency = DEFAULT_CONCURRENCY) {
    // In a real app, we would query for unsent emails
    // For now, we'll simulate by getting recent email sends
    const emailSends = await prisma.emailSend.findMany({
      take: 100,
      orderBy: { sentAt: 'desc' }
    });

    // Get related posts and subscribers in separate queries
    const postIds = [...new Set(emailSends.map(e => e.postId))];
    const subscriberIds = [...new Set(emailSends.map(e => e.subscriberId))];
    
    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: { id: true, title: true, content: true, slug: true }
    });
    
    const subscribers = await prisma.subscriber.findMany({
      where: { id: { in: subscriberIds } },
      select: { id: true, email: true }
    });
    
    // Create lookup maps for efficient access
    const postsMap = new Map(posts.map(p => [p.id, p]));
    const subscribersMap = new Map(subscribers.map(s => [s.id, s]));

    let sentCount = 0;
    
    // Process in batches with controlled concurrency
    for (let i = 0; i < emailSends.length; i += concurrency) {
      const batch = emailSends.slice(i, i + concurrency);
      
      // In a real app, we would use Promise.all to send emails in parallel
      await Promise.all(batch.map(async (emailSend) => {
        try {
          const post = postsMap.get(emailSend.postId);
          const subscriber = subscribersMap.get(emailSend.subscriberId);
          
          if (!post || !subscriber) {
            console.error(`Missing data for email send ${emailSend.id}`);
            return false;
          }
          
          // Simulate sending an email
          console.log(`Sending email to ${subscriber.email} about "${post.title}"`);
          
          // In a real app, we would update the emailSend record with sent status
          // await prisma.emailSend.update({
          //   where: { id: emailSend.id },
          //   data: { status: 'SENT' }
          // });
          
          sentCount++;
          return true;
        } catch (error) {
          console.error(`Failed to send email ${emailSend.id}:`, error);
          
          // In a real app, we would update the emailSend record with error status
          // await prisma.emailSend.update({
          //   where: { id: emailSend.id },
          //   data: { status: 'FAILED', error: String(error) }
          // });
          
          return false;
        }
      }));
    }

    return { sentCount };
  },

  /**
   * Gets all email sends for a post
   */
  async getEmailSendsByPost(postId: string) {
    return emailsSendRepository.getByPostId(postId);
  },

  /**
   * Gets all email sends for a subscriber
   */
  async getEmailSendsBySubscriber(subscriberId: string) {
    return emailsSendRepository.getBySubscriberId(subscriberId);
  }
};

// Export a default instance for convenience
export default emailsSendService;
