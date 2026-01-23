import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import validateConfig from '../../../utils/validate-config';
import { RabbitMQConfig } from './rabbitmq-config.type';
import {
  RMQ_QUEUE_DURABLE,
  RMQ_PREFETCH_COUNT,
  RMQ_NO_ACK,
  RMQ_PERSISTENT,
  RMQ_DEFAULT_COMMUNICATION_URLS,
} from '../types/rabbitmq-const.type';
import {
  booleanValidator,
  numberValidator,
} from 'src/utils/helpers/env.helper';

// Validator class for environment variables
class EnvironmentVariablesValidator {
  /**
   * Enable or disable RabbitMQ.
   * Default: false
   */
  @IsBoolean()
  @IsOptional()
  RABBITMQ_ENABLE?: boolean;

  /**
   * RabbitMQ connection URLs (comma-separated).
   */
  @IsString()
  @IsOptional()
  RABBITMQ_URLS?: string;

  /**
   * RabbitMQ prefetch count (number of messages to fetch at a time)
   */
  @IsInt()
  @IsOptional()
  RABBITMQ_PREFETCH_COUNT?: number;

  /**
   * RabbitMQ acknowledgment mode (true = auto-ack)
   */
  @IsBoolean()
  @IsOptional()
  RABBITMQ_NO_ACK?: boolean;

  /**
   * RabbitMQ queue durability
   */
  @IsBoolean()
  @IsOptional()
  RABBITMQ_QUEUE_DURABLE?: boolean;

  /**
   * RabbitMQ message persistence (false = messages are not persisted)
   */
  @IsBoolean()
  @IsOptional()
  RABBITMQ_PERSISTENT?: boolean;
}

export default registerAs<RabbitMQConfig>('rabbitMQ', () => {
  // Validate the environment variables using the defined validator
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    enableRabbitMQ: booleanValidator(process.env.RABBITMQ_ENABLE, false),
    rabbitmqUrls: process.env.RABBITMQ_URLS
      ? process.env.RABBITMQ_URLS.split(',')
      : RMQ_DEFAULT_COMMUNICATION_URLS, // Default if not set
    rabbitmqPrefetchCount: numberValidator(
      process.env.RABBITMQ_PREFETCH_COUNT,
      RMQ_PREFETCH_COUNT,
    ),
    rabbitmqNoAck: booleanValidator(process.env.RABBITMQ_NO_ACK, RMQ_NO_ACK),
    rabbitmqQueueDurable: booleanValidator(
      process.env.RABBITMQ_QUEUE_DURABLE,
      RMQ_QUEUE_DURABLE,
    ),
    rabbitmqPersistent: booleanValidator(
      process.env.RABBITMQ_PERSISTENT,
      RMQ_PERSISTENT,
    ),
  };
});
