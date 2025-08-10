import { MailProvider } from './mail.provider';

export class ResendMailProvider implements MailProvider {
  async send(to: string, subject: string, templateId: string) {
    console.log("Sending email to", to, "with subject", subject, "and templateId", templateId);
    return Promise.resolve();
  }
}
