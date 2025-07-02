import { RmqContext } from '@nestjs/microservices';

/**
 * Standard structure for emitted RabbitMQ events.
 */
export interface RmqEventPayload<T = any> {
  payload: T;
  context: RmqContext;
}