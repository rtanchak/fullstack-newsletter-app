import { prisma } from "@/lib/prisma";

export async function upsertActiveSubscriber(email: string) {
  return prisma.subscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email, active: true },
    select: { id: true, email: true, active: true },
  });
}
