import { Queue, QueueEvents } from 'bullmq';
import { Observable } from 'rxjs';

export type QueueDefinition = {
  name: string;
  displayName: string;
};

export type QueueDashBullMqEnv = {
  enabled: boolean;
  redisUrl: string;
};

export type QueueEventPayload = {
  queueName: string;
  event: 'waiting' | 'active' | 'completed' | 'failed';
  jobId?: string;
  data?: unknown;
  attempt?: number;
};

export type BullMqQueueBinding = {
  definition: QueueDefinition;
  queue: Queue;
  queueEvents: QueueEvents;
  events$: Observable<QueueEventPayload>;
};

export const DEFAULT_QUEUES: QueueDefinition[] = [
  { name: 'login-tasks', displayName: 'Login Tasks' },
  {
    name: 'contract-address-tasks',
    displayName: 'Contract Address Tasks',
  },
  { name: 'account-tasks', displayName: 'Account Tasks' },
];
