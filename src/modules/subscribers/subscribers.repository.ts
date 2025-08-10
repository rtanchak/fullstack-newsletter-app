import { prisma } from "@/lib/utils/prisma";

export async function upsertActiveSubscriber(email: string) {
  return prisma.subscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email, active: true },
    select: { id: true, email: true, active: true },
  });
}

export async function findActiveSubscribers() {
  return prisma.subscriber.findMany({
    where: { active: true },
    select: { id: true, email: true },
  });
}

export async function findSubscribersByIds(ids: string[]) {
  return prisma.subscriber.findMany({
    where: { id: { in: ids } },
    select: { id: true, email: true },
  });
}
