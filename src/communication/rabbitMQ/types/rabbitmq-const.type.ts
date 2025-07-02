// RabbitMQ Default Settings

/**
 * Default RabbitMQ username.
 */
export const RMQ_USERNAME: string = 'guest';

/**
 * Default RabbitMQ password.
 */
export const RMQ_PASSWORD: string = 'guest';

/**
 * Default RabbitMQ virtual host.
 */
export const RMQ_VHOST: string = '/';

/**
 * Default state for RabbitMQ service enablement.
 */
export const RMQ_ENABLE: boolean = false;

/**
 * Default queue name.
 */
export const RMQ_QUEUE: string = 'default';

/**
 * Default exchange name.
 */
export const RMQ_EXCHANGE: string = 'default-exchange';

/**
 * Whether the service should attempt automatic reconnect by default.
 */
export const RMQ_RECONNECT: boolean = true;

/**
 * Default RabbitMQ connection URLs.
 */
export const RMQ_DEFAULT_COMMUNICATION_URLS: string[] = [
  'amqp://localhost:5672',
];

/**
 * Default durability setting for the queue.
 */
export const RMQ_QUEUE_DURABLE: boolean = true;

/**
 * Default prefetch count for message consumption.
 */
export const RMQ_PREFETCH_COUNT: number = 10;

/**
 * Default acknowledgment mode (false = manual acknowledgment, recommended).
 */
export const RMQ_NO_ACK: boolean = false;

/**
 * Default message persistence (true = messages stored on disk).
 */
export const RMQ_PERSISTENT: boolean = true;

/**
 * Default state for partition log visibility (typically false for production).
 */
export const RMQ_ENABLE_PARTITION_LOG: boolean = false;
