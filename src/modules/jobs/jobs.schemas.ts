import { z } from 'zod';
import { JobType } from '@prisma/client';

export const cuid = z.string();

export const isoDate = z.union([
  z.string().datetime({ offset: true }),
  z.string().refine((s) => !Number.isNaN(new Date(s).getTime()), 'Invalid date'),
]);

export const EnqueuePublicationBody = z.object({
  postId: cuid,
  when: isoDate.or(z.date()).default(new Date().toISOString()),
});
export type EnqueuePublicationBody = z.infer<typeof EnqueuePublicationBody>;

export const EnqueueNotificationBody = z.object({
  postId: cuid,
  when: isoDate.or(z.date()).default(new Date().toISOString()),
});
export type EnqueueNotificationBody = z.infer<typeof EnqueueNotificationBody>;

export const EnqueueJobDTO = z.object({
  postId: cuid,
  jobType: z.nativeEnum(JobType),
  scheduledAt: z.date(),
});
export type EnqueueJobDTO = z.infer<typeof EnqueueJobDTO>;

export const ProcessResult = z.object({
  publishedCount: z.number().int().nonnegative(),
  emailedCount: z.number().int().nonnegative(),
});
export type ProcessResult = z.infer<typeof ProcessResult>;
