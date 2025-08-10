import { z } from 'zod';

export const CreateEmailSendDto = z.object({
  postId: z.string(),
  subscriberId: z.string(),
});

export type CreateEmailSendDto = z.infer<typeof CreateEmailSendDto>;

export const ProcessEmailSendsResultDto = z.object({
  sentCount: z.number(),
});

export type ProcessEmailSendsResultDto = z.infer<typeof ProcessEmailSendsResultDto>;
