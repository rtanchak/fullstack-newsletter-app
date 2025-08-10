import { JobStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { EnqueueJobDTO } from './jobs.schemas';

export async function create(data: EnqueueJobDTO) {
  return prisma.job.create({ data });
}

export async function createIfNotExists(data: EnqueueJobDTO) {
  const existing = await prisma.job.findFirst({
    where: {
      postId: data.postId,
      jobType: data.jobType,
      scheduledAt: data.scheduledAt,
      status: JobStatus.PENDING,
    },
  });
  
  if (existing) {
    return existing;
  }
  
  return prisma.job.create({ data });
}

export async function getDuePending(now = new Date(), take = 100) {
  return prisma.job.findMany({
    where: {
      status: JobStatus.PENDING,
      scheduledAt: { lte: now },
    },
    orderBy: { scheduledAt: 'asc' },
    take,
  });
}

export async function markCompleted(id: string) {
  return prisma.job.update({ 
    where: { id }, 
    data: { status: JobStatus.COMPLETED } 
  });
}

export async function markFailed(id: string) {
  return prisma.job.update({ 
    where: { id }, 
    data: { status: JobStatus.FAILED } 
  });
}
