import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConsumeMessage } from 'amqplib';
import { Controller, Logger } from '@nestjs/common';
import { AllConfigType } from '../../../config/config.type';
import { RMQ_NO_ACK, RMQ_QUEUE } from '../types/rabbitmq-const.type';
import { RMQMessageEvent } from '../utils/rabbitmq.decorator';

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);
  private readonly noAck: boolean;
  private readonly queueName: string;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.noAck = this.configService.get('rabbitMQ.noAck', RMQ_NO_ACK, {
      infer: true,
    });
    this.queueName = this.configService.get('rabbitMQ.queue', RMQ_QUEUE, {
      infer: true,
    });

    this.logger.log(
      `Consumer initialized | queue: ${this.queueName} | noAck: ${this.noAck}`,
    );
  }

  @MessagePattern('default.mint')
  @RMQMessageEvent('default.mint')
  handleDefaultMint(@Payload() payload: any, @Ctx() context: RmqContext): any {
    const originalMessage = context.getMessage() as ConsumeMessage;
    const routingKey = originalMessage.fields.routingKey;

    this.logger.debug(
      `Received message on [${routingKey}] | payload: ${JSON.stringify(payload)}`,
    );

    return payload; // This result gets emitted by the decorator
  }
}
