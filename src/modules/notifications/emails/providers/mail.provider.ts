export interface MailProvider {
  send(to: string, subject: string, templateId: string): Promise<void>;
}
