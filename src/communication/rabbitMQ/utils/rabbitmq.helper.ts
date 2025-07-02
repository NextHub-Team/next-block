import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Channel, ConsumeMessage } from 'amqplib';

const logger = new Logger('RabbitAckHelper');

/**
 * Handles manual acknowledgment or rejection of a RabbitMQ message.
 * Only used if RABBITMQ_NO_ACK=false
 */
export async function Acknowledge(
  context: RmqContext,
  processFn: () => Promise<void>,
  noAck: boolean = false,
): Promise<void> {
  const channel = context.getChannelRef() as Channel;
  const message = context.getMessage() as ConsumeMessage;

  try {
    await processFn();

    if (!noAck) {
      if (channel && message) {
        channel.ack(message);
      }
    } else {
      logger.warn('Skipping manual ack due to RABBITMQ_NO_ACK=true');
    }
  } catch (err) {
    logger.error(`Processing error: ${err.message}`);
    rejectWithRequeue(context);
  }
}
/**
 * Rejects a message and initiates queues for retry.
 */
export function rejectWithRequeue(context: RmqContext): void {
  const channel = context.getChannelRef() as Channel;
  const message = context.getMessage() as ConsumeMessage;

  if (channel && message) {
    channel.nack(message, false, true);
  }
}

/**
 * Rejects a message and drops it (no requeue).
 */
export function rejectWithoutRequeue(context: RmqContext): void {
  const channel = context.getChannelRef() as Channel;
  const message = context.getMessage() as ConsumeMessage;

  if (channel && message) {
    channel.nack(message, false, false);
  }
}
