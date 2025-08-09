import { prisma } from '@/lib/prisma';

/**
 * Creates a new email send record
 */
export async function create(data: { postId: string; subscriberId: string }) {
  return prisma.emailSend.create({ data });
}

/**
 * Creates an email send record if it doesn't already exist
 */
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

/**
 * Creates multiple email send records at once
 */
export async function createMany(data: { postId: string; subscriberId: string }[]) {
  return prisma.emailSend.createMany({
    data,
    skipDuplicates: true,
  });
}

/**
 * Gets all email sends for a specific post
 */
export async function getByPostId(postId: string) {
  return prisma.emailSend.findMany({
    where: { postId },
  });
}

/**
 * Gets all email sends for a specific subscriber
 */
export async function getBySubscriberId(subscriberId: string) {
  return prisma.emailSend.findMany({
    where: { subscriberId },
  });
}
