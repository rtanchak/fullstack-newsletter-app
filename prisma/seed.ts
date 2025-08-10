import { PrismaClient, PostStatus, JobType, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const ITEMS_LENGTH = 250;
async function main() {
  console.log('Starting seed...');

  await prisma.job.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscriber.deleteMany();

  console.log('Creating subscribers...');
  const subscribers = await Promise.all(
    Array.from({ length: ITEMS_LENGTH }).map(async () => {
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
      
      if (i < 200) {
        status = PostStatus.PUBLISHED;
        publishedAt = faker.date.past({ years: 0.5 });
      } else if (i < 250) {
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
          createdBy: 'seed-script',
          updatedBy: 'seed-script',
        },
      });
    })
  );
  console.log(`Created ${posts.length} posts`);

  console.log('Creating jobs...');
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        postId: posts[249].id,
        jobType: JobType.POST_PUBLICATION,
        scheduledAt: faker.date.future({ years: 0.1 }),
        status: JobStatus.PENDING,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    }),
    prisma.job.create({
      data: {
        postId: posts[249].id,
        jobType: JobType.POST_EMAIL_NOTIFICATION,
        scheduledAt: faker.date.future({ years: 0.1 }),
        status: JobStatus.PENDING,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    }),
    prisma.job.create({
      data: {
        postId: posts[249].id,
        jobType: JobType.POST_EMAIL_NOTIFICATION,
        scheduledAt: faker.date.past({ years: 0.1 }),
        status: JobStatus.COMPLETED,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    }),
  ]);
  console.log(`Created ${jobs.length} jobs`);

}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
