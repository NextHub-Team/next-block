export interface InternalEventToEmit<TPayload = unknown> {
  eventType: string;
  payload: TPayload;
}

export interface InternalEventMessage<TPayload = unknown> {
  eventId: string;
  eventType: string;
  payload: TPayload;
  occurredAt: string;
}

export interface InternalEventsModuleOptions {
  serviceName: string;
  streamName: string;
  dlqStreamName?: string;
  redisUrl?: string;
  dispatchIntervalMs: number;
  dispatchBatchSize: number;
  outboxRetentionDays: number;
  consumerBlockMs: number;
  consumerCount: number;
  idempotencyTtlSeconds: number;
  maxRetries: number;
  pendingClaimAfterMs: number;
  streamTrimMaxLen?: number;
}

export const INTERNAL_EVENTS_DEFAULTS: InternalEventsModuleOptions = {
  serviceName: process.env.SERVICE_NAME ?? 'default-service',
  streamName: 'internal.events',
  dlqStreamName: 'internal.events.dlq',
  redisUrl: process.env.REDIS_URL,
  dispatchIntervalMs: 1000,
  dispatchBatchSize: 100,
  outboxRetentionDays: 30,
  consumerBlockMs: 5000,
  consumerCount: 10,
  idempotencyTtlSeconds: 60 * 60 * 24,
  maxRetries: 10,
  pendingClaimAfterMs: 60_000,
  streamTrimMaxLen: 1_000_000,
};

export function buildInternalEventsOptions(
  overrides: Partial<InternalEventsModuleOptions> = {},
): InternalEventsModuleOptions {
  return {
    ...INTERNAL_EVENTS_DEFAULTS,
    ...overrides,
  };
}
