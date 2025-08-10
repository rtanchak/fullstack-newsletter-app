export type EmailTemplate = string;

export interface EmailRecipient {
  email: string;
  id?: string;
}

export interface EmailTemplateData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface SendEmailOptions {
  recipients: EmailRecipient[];
  subject: string;
  templateId: string;
  campaignId?: string;
  templateData?: EmailTemplateData;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ProcessResult {
  sentCount: number;
  campaignId?: string;
  messageId?: string;
}
