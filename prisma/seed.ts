import { PrismaClient, PostStatus, JobType, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const ITEMS_LENGTH = 250;
async function main() {
  console.log('Starting seed...');

  await prisma.emailSend.deleteMany();
  await prisma.job.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscriber.deleteMany();

  console.log('Creating subscribers...');
  const subscribers = await Promise.all(
    Array.from({ length: ITEMS_LENGTH }).map(async (_, i) => {
      return prisma.subscriber.create({
        data: { 
          email: faker.internet.email(),
          active: true,
        },
      });
    })
  );
  console.log(`Created ${subscribers.length} subscribers`);

  console.log('Creating posts...');
  const posts = await Promise.all(
    Array.from({ length: ITEMS_LENGTH }).map(async (_, i) => {
      let status: PostStatus;
      let publishedAt: Date | null = null;
      
      if (i < 5) {
        status = PostStatus.PUBLISHED;
        publishedAt = faker.date.past({ years: 0.5 });
      } else if (i < 8) {
        status = PostStatus.SCHEDULED;
        publishedAt = faker.date.future({ years: 0.2 });
      } else {
        status = PostStatus.DRAFT;
      }

      const title = faker.lorem.sentence({ min: 3, max: 8 });
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      return prisma.post.create({
        data: {
          title,
          slug,
          content: faker.lorem.paragraphs({ min: 3, max: 7 }),
          status,
          publishedAt,
        },
      });
    })
  );
  console.log(`Created ${posts.length} posts`);

  console.log('Creating jobs...');
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        postId: posts[7].id,
        jobType: JobType.POST_PUBLICATION,
        scheduledAt: faker.date.future({ years: 0.1 }),
        status: JobStatus.PENDING,
      },
    }),
    prisma.job.create({
      data: {
        postId: posts[5].id,
        jobType: JobType.POST_EMAIL_NOTIFICATION,
        scheduledAt: faker.date.future({ years: 0.1 }),
        status: JobStatus.PENDING,
      },
    }),
    prisma.job.create({
      data: {
        postId: posts[0].id,
        jobType: JobType.POST_EMAIL_NOTIFICATION,
        scheduledAt: faker.date.past({ years: 0.1 }),
        status: JobStatus.COMPLETED,
      },
    }),
  ]);
  console.log(`Created ${jobs.length} jobs`);

  console.log('Creating email sends...');
  const emailSends = [];
  for (let i = 0; i < ITEMS_LENGTH; i++) {
    const post = posts[i];
    
    for (const subscriber of subscribers) {
      const sentAt = i < 3 ? faker.date.past({ years: 0.1 }) : undefined;
      
      emailSends.push(
        await prisma.emailSend.create({
          data: {
            postId: post.id,
            subscriberId: subscriber.id,
            sentAt,
          },
        })
      );
    }
  }
  console.log(`Created ${emailSends.length} email sends`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
