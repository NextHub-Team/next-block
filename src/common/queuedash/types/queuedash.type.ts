export type QueueDashQueueType = 'bull' | 'bullmq';

export type QueueDashQueueRegistration = {
  queue: unknown;
  displayName: string;
  type: QueueDashQueueType;
};
