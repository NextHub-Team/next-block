export type RabbitMQConfig = {
  /**
   * RabbitMQ username for authentication.
   */
  username: string;

  /**
   * RabbitMQ password for authentication.
   */
  password: string;

  /**
   * RabbitMQ virtual host.
   */
  vhost: string;

  /**
   * Whether RabbitMQ is enabled.
   * Default: false
   */
  enable: boolean;

  /**
   * Name of the queue to consume from or publish to.
   */
  queue: string;

  /**
   * List of exchanges to bind the queue to.
   * Example: ["exchange-a", "exchange-b"]
   */
  exchanges: string[];
  /**
   * Whether the service should automatically reconnect if the connection is lost.
   */
  reconnect: boolean;

  /**
   * List of RabbitMQ connection URLs.
   * Example: ["amqp://user:password@rabbitmq-host:5672", "amqp://user:password@backup-host:5672"]
   */
  urls: string[];

  /**
   * Whether the queue should be durable (survive broker restarts).
   * Default: true
   */
  queueDurable: boolean;

  /**
   * Prefetch count for message consumption (limits how many messages are fetched at once).
   * Default: 10
   */
  prefetchCount: number;

  /**
   * Whether auto acknowledgment mode is enabled.
   * If true, messages are acknowledged automatically.
   * Default: false
   */
  noAck: boolean;

  /**
   * Whether messages are persisted to disk.
   * Default: false
   */
  persistent: boolean;

  /**
   * Whether partition logs are enabled (useful for debugging partition behavior).
   */
  enablePartitionLog: boolean;
};
