import { prisma } from '@/lib/prisma';

export async function createIfNotExists(data: { postId: string; subscriberId: string }) {
  const existing = await prisma.emailSend.findUnique({
    where: {
      postId_subscriberId: {
        postId: data.postId,
        subscriberId: data.subscriberId,
      },
    },
  });
  
  if (existing) {
    return existing;
  }
  
  return prisma.emailSend.create({ data });
}

export async function createMany(data: { postId: string; subscriberId: string }[]) {
  return prisma.emailSend.createMany({
    data,
    skipDuplicates: true
  });
}

export async function getByPostId(postId: string) {
  return prisma.emailSend.findMany({
    where: { postId },
    include: { subscriber: true },
    orderBy: { sentAt: 'desc' },
  });
}

export async function getUnsentEmailSends() {
  return prisma.emailSend.findMany({
    where: { sentAt: undefined },
    take: 100,
    orderBy: { id: 'asc' }
  });
}

export async function updateMany(params: { where: any; data: any }) {
  return prisma.emailSend.updateMany(params);
}

export async function getBySubscriberId(subscriberId: string) {
  return prisma.emailSend.findMany({
    where: { subscriberId },
  });
}
