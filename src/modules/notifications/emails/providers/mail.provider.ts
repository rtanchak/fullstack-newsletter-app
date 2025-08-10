import { SendEmailOptions, SendEmailResponse } from '@/lib/types/emails';

export interface MailProvider {
  send(options: SendEmailOptions): Promise<SendEmailResponse>;
}
