import { SendEmailOptions, SendEmailResponse } from '@/lib/types/emails';
import { MailProvider } from './mail.provider';

export class ResendMailProvider implements MailProvider {
  async send(options: SendEmailOptions): Promise<SendEmailResponse> {
    const { recipients, subject, templateId, campaignId, templateData } = options;
    
    console.log(`Sending email campaign ${campaignId || 'unknown'} with template ${templateId}`);
    console.log(`Subject: ${subject}`);
    console.log(`Recipients: ${recipients.length} contacts`);
    console.log(`Template data:`, templateData || {});
    
    return Promise.resolve({
      success: true,
      messageId: `mock-message-${Date.now()}`
    });
  }
}
