/**
 * Injection token for AWS SNS consumer options.
 */
export const AWS_SNS_CONSUMER_OPTIONS = Symbol('AWS_SNS_CONSUMER_OPTIONS');

/**
 * Injection token for AWS SNS custom transport strategy.
 */
export const AWS_SNS_STRATEGY = 'AWS_SNS_STRATEGY';

/**
 * Optional: default values for AWS SNS consumer configuration.
 * These can be overridden via environment variables or ConfigService.
 */
export const AWS_SNS_DEFAULTS = {
  /**
   * Enable or disable AWS SNS consumer.
   */
  ENABLE: false,

  /**
   * Default AWS region.
   */
  REGION: 'us-east-1',

  /**
   * Default polling interval (ms).
   */
  POLL_INTERVAL: 3000,

  /**
   * Default max number of messages per poll.
   */
  MAX_MESSAGES: 10,

  /**
   * Default SQS visibility timeout (seconds).
   */
  VISIBILITY_TIMEOUT: 30,

  /**
   * Default SQS wait time (seconds).
   */
  WAIT_TIME_SECONDS: 10,
} as const;
