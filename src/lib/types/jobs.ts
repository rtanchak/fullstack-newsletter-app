import { JobType } from '@prisma/client';
import { JobStrategy } from '@/modules/jobs/strategies/job.strategy';

export type StrategyMap = {
  [K in JobType]: JobStrategy;
};
