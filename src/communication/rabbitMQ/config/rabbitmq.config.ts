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
  RMQ_USERNAME,
  RMQ_PASSWORD,
  RMQ_VHOST,
  RMQ_QUEUE,
  RMQ_EXCHANGE,
  RMQ_RECONNECT,
  RMQ_ENABLE_PARTITION_LOG,
  RMQ_ENABLE,
} from '../types/rabbitmq-const.type';
import { parseBoolean } from '../../../utils/helpers/parser.helper';

// Validator class for environment variables
class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_USERNAME?: string;

  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PASSWORD?: string;

  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_VHOST?: string;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_ENABLE_RABBITMQ?: boolean;

  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_QUEUE?: string;

  @IsString()
  @IsOptional()
  /**
   * Comma-separated list of exchanges.
   */
  COMMUNICATION_RABBITMQ_EXCHANGES?: string[];

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_RECONNECT?: boolean;

  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_URLS?: string;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_QUEUE_DURABLE?: boolean;

  @IsInt()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PREFETCH_COUNT?: number;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_NO_ACK?: boolean;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PERSISTENT?: boolean;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_ENABLE_PARTITION_LOG?: boolean;
}

export default registerAs<RabbitMQConfig>('rabbitMQ', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    username: process.env.COMMUNICATION_RABBITMQ_USERNAME || RMQ_USERNAME,
    password: process.env.COMMUNICATION_RABBITMQ_PASSWORD || RMQ_PASSWORD,
    vhost: process.env.COMMUNICATION_RABBITMQ_VHOST || RMQ_VHOST,

    enable: parseBoolean(process.env.COMMUNICATION_ENABLE_RABBITMQ, RMQ_ENABLE),

    queue: process.env.COMMUNICATION_RABBITMQ_QUEUE || RMQ_QUEUE,
    exchanges: process.env.COMMUNICATION_RABBITMQ_EXCHANGES
      ? process.env.COMMUNICATION_RABBITMQ_EXCHANGES.split(',').map((e) =>
          e.trim(),
        )
      : [RMQ_EXCHANGE],

    reconnect: parseBoolean(
      process.env.COMMUNICATION_RABBITMQ_RECONNECT,
      RMQ_RECONNECT,
    ),

    urls: process.env.COMMUNICATION_RABBITMQ_URLS
      ? process.env.COMMUNICATION_RABBITMQ_URLS.split(',').map((url) =>
          url.trim(),
        )
      : RMQ_DEFAULT_COMMUNICATION_URLS,

    queueDurable: parseBoolean(
      process.env.COMMUNICATION_RABBITMQ_QUEUE_DURABLE,
      RMQ_QUEUE_DURABLE,
    ),

    prefetchCount: process.env.COMMUNICATION_RABBITMQ_PREFETCH_COUNT
      ? Number(process.env.COMMUNICATION_RABBITMQ_PREFETCH_COUNT)
      : RMQ_PREFETCH_COUNT,

    noAck: parseBoolean(process.env.COMMUNICATION_RABBITMQ_NO_ACK, RMQ_NO_ACK),

    persistent: parseBoolean(
      process.env.COMMUNICATION_RABBITMQ_PERSISTENT,
      RMQ_PERSISTENT,
    ),

    enablePartitionLog: parseBoolean(
      process.env.COMMUNICATION_RABBITMQ_ENABLE_PARTITION_LOG,
      RMQ_ENABLE_PARTITION_LOG,
    ),
  };
});
