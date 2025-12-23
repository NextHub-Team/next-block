import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { createToggleableConfig } from '../../../config/config.helper';
import {
  INTERNAL_EVENTS_DEFAULT_CONSUMER_BLOCK_MS,
  INTERNAL_EVENTS_DEFAULT_CONSUMER_COUNT,
  INTERNAL_EVENTS_DEFAULT_DISPATCH_BATCH_SIZE,
  INTERNAL_EVENTS_DEFAULT_DISPATCH_INTERVAL_MS,
  INTERNAL_EVENTS_DEFAULT_DLQ_STREAM_NAME,
  INTERNAL_EVENTS_DEFAULT_ENABLE,
  INTERNAL_EVENTS_DEFAULT_IDEMPOTENCY_TTL_SECONDS,
  INTERNAL_EVENTS_DEFAULT_MAX_RETRIES,
  INTERNAL_EVENTS_DEFAULT_OUTBOX_RETENTION_DAYS,
  INTERNAL_EVENTS_DEFAULT_PENDING_CLAIM_AFTER_MS,
  INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_MAX_MS,
  INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_STEP_MS,
  INTERNAL_EVENTS_DEFAULT_REDIS_URL,
  INTERNAL_EVENTS_DEFAULT_SERVICE_NAME,
  INTERNAL_EVENTS_DEFAULT_STREAM_NAME,
  INTERNAL_EVENTS_DEFAULT_STREAM_TRIM_MAX_LEN,
} from '../types/internal-events-const.type';
import {
  InternalEventsConfig,
  InternalEventsOptions,
  buildInternalEventsOptions,
} from './internal-events-config.type';

class InternalEventsEnvValidator {
  @IsBoolean()
  @IsOptional()
  INTERNAL_EVENTS_ENABLE?: boolean;

  @IsString()
  @IsOptional()
  INTERNAL_EVENTS_SERVICE_NAME?: string;

  @IsString()
  @IsOptional()
  INTERNAL_EVENTS_STREAM_NAME?: string;

  @IsString()
  @IsOptional()
  INTERNAL_EVENTS_DLQ_STREAM_NAME?: string;

  @IsString()
  @IsOptional()
  INTERNAL_EVENTS_REDIS_URL?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_DISPATCH_INTERVAL_MS?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  INTERNAL_EVENTS_DISPATCH_BATCH_SIZE?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  INTERNAL_EVENTS_OUTBOX_RETENTION_DAYS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_CONSUMER_BLOCK_MS?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  INTERNAL_EVENTS_CONSUMER_COUNT?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  INTERNAL_EVENTS_IDEMPOTENCY_TTL_SECONDS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_MAX_RETRIES?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_PENDING_CLAIM_AFTER_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_STREAM_TRIM_MAX_LEN?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_REDIS_RETRY_STEP_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  INTERNAL_EVENTS_REDIS_RETRY_MAX_MS?: number;
}

const toNumber = (value: number | string | undefined, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildDefaults = (): InternalEventsConfig => ({
  enable: INTERNAL_EVENTS_DEFAULT_ENABLE,
  serviceName: INTERNAL_EVENTS_DEFAULT_SERVICE_NAME,
  streamName: INTERNAL_EVENTS_DEFAULT_STREAM_NAME,
  dlqStreamName: INTERNAL_EVENTS_DEFAULT_DLQ_STREAM_NAME,
  redisUrl: INTERNAL_EVENTS_DEFAULT_REDIS_URL,
  dispatchIntervalMs: INTERNAL_EVENTS_DEFAULT_DISPATCH_INTERVAL_MS,
  dispatchBatchSize: INTERNAL_EVENTS_DEFAULT_DISPATCH_BATCH_SIZE,
  outboxRetentionDays: INTERNAL_EVENTS_DEFAULT_OUTBOX_RETENTION_DAYS,
  consumerBlockMs: INTERNAL_EVENTS_DEFAULT_CONSUMER_BLOCK_MS,
  consumerCount: INTERNAL_EVENTS_DEFAULT_CONSUMER_COUNT,
  idempotencyTtlSeconds: INTERNAL_EVENTS_DEFAULT_IDEMPOTENCY_TTL_SECONDS,
  maxRetries: INTERNAL_EVENTS_DEFAULT_MAX_RETRIES,
  pendingClaimAfterMs: INTERNAL_EVENTS_DEFAULT_PENDING_CLAIM_AFTER_MS,
  streamTrimMaxLen: INTERNAL_EVENTS_DEFAULT_STREAM_TRIM_MAX_LEN,
  redisRetryStepMs: INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_STEP_MS,
  redisRetryMaxMs: INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_MAX_MS,
});

export default createToggleableConfig<
  InternalEventsConfig,
  InternalEventsEnvValidator
>('internalEvents', InternalEventsEnvValidator, buildDefaults(), {
  enableKey: 'enable',
  enableEnvKey: 'INTERNAL_EVENTS_ENABLE',
  mapEnabledConfig: (env) => {
    const serviceName =
      env.INTERNAL_EVENTS_SERVICE_NAME ?? INTERNAL_EVENTS_DEFAULT_SERVICE_NAME;
    const streamName =
      env.INTERNAL_EVENTS_STREAM_NAME ?? INTERNAL_EVENTS_DEFAULT_STREAM_NAME;
    const dlqStreamName =
      env.INTERNAL_EVENTS_DLQ_STREAM_NAME ??
      INTERNAL_EVENTS_DEFAULT_DLQ_STREAM_NAME;
    const redisUrl =
      env.INTERNAL_EVENTS_REDIS_URL ?? INTERNAL_EVENTS_DEFAULT_REDIS_URL;

    const dispatchIntervalMs = toNumber(
      env.INTERNAL_EVENTS_DISPATCH_INTERVAL_MS,
      INTERNAL_EVENTS_DEFAULT_DISPATCH_INTERVAL_MS,
    );
    const dispatchBatchSize = toNumber(
      env.INTERNAL_EVENTS_DISPATCH_BATCH_SIZE,
      INTERNAL_EVENTS_DEFAULT_DISPATCH_BATCH_SIZE,
    );
    const outboxRetentionDays = toNumber(
      env.INTERNAL_EVENTS_OUTBOX_RETENTION_DAYS,
      INTERNAL_EVENTS_DEFAULT_OUTBOX_RETENTION_DAYS,
    );
    const consumerBlockMs = toNumber(
      env.INTERNAL_EVENTS_CONSUMER_BLOCK_MS,
      INTERNAL_EVENTS_DEFAULT_CONSUMER_BLOCK_MS,
    );
    const consumerCount = toNumber(
      env.INTERNAL_EVENTS_CONSUMER_COUNT,
      INTERNAL_EVENTS_DEFAULT_CONSUMER_COUNT,
    );
    const idempotencyTtlSeconds = toNumber(
      env.INTERNAL_EVENTS_IDEMPOTENCY_TTL_SECONDS,
      INTERNAL_EVENTS_DEFAULT_IDEMPOTENCY_TTL_SECONDS,
    );
    const maxRetries = toNumber(
      env.INTERNAL_EVENTS_MAX_RETRIES,
      INTERNAL_EVENTS_DEFAULT_MAX_RETRIES,
    );
    const pendingClaimAfterMs = toNumber(
      env.INTERNAL_EVENTS_PENDING_CLAIM_AFTER_MS,
      INTERNAL_EVENTS_DEFAULT_PENDING_CLAIM_AFTER_MS,
    );
    const streamTrimMaxLen = toNumber(
      env.INTERNAL_EVENTS_STREAM_TRIM_MAX_LEN,
      INTERNAL_EVENTS_DEFAULT_STREAM_TRIM_MAX_LEN,
    );
    const redisRetryStepMs = toNumber(
      env.INTERNAL_EVENTS_REDIS_RETRY_STEP_MS,
      INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_STEP_MS,
    );
    const redisRetryMaxMs = toNumber(
      env.INTERNAL_EVENTS_REDIS_RETRY_MAX_MS,
      INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_MAX_MS,
    );

    return {
      serviceName,
      streamName,
      dlqStreamName,
      redisUrl,
      dispatchIntervalMs,
      dispatchBatchSize,
      outboxRetentionDays,
      consumerBlockMs,
      consumerCount,
      idempotencyTtlSeconds,
      maxRetries,
      pendingClaimAfterMs,
      streamTrimMaxLen,
      redisRetryStepMs,
      redisRetryMaxMs,
    } satisfies Partial<InternalEventsConfig>;
  },
  mapDisabledConfig: () => ({
    dispatchIntervalMs: 0,
    dispatchBatchSize: 0,
    consumerBlockMs: 0,
    consumerCount: 0,
  }),
});

export const buildInternalEventsOptionsFromConfig = (
  overrides: Partial<InternalEventsOptions> = {},
): InternalEventsOptions =>
  buildInternalEventsOptions({
    ...buildDefaults(),
    ...overrides,
  });
