import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { updateRabbitMQUrls } from '../utils/rabbitmq-config.helper';
import { AllConfigType } from '../../../config/config.type';

@Controller()
export class ConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ConsumerService.name);
  private readonly noAck: boolean;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.noAck =
      this.configService.get('rabbitMQ.noAck', { infer: true }) === true;
  }

  onModuleInit() {
    const urls = this.configService.getOrThrow('rabbitMQ.urls', {
      infer: true,
    });
    const username = this.configService.getOrThrow('rabbitMQ.username', {
      infer: true,
    });
    const password = this.configService.getOrThrow('rabbitMQ.password', {
      infer: true,
    });
    const vhost = this.configService.getOrThrow('rabbitMQ.vhost', {
      infer: true,
    });

    const preparedUrls = updateRabbitMQUrls(urls, username, password, vhost);
    this.logger.debug(
      `Consumer initialized with URLs: ${preparedUrls.join(', ')}`,
    );
  }
}
