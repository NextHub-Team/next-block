import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { updateRabbitMQUrls } from './utils/rabbitmq-config.helper';

export class RabbitMQRegister {
  static init(app: INestApplication) {
    const configService = app.get(ConfigService);
    const rabbitConfig = configService.get('rabbitMQ', { infer: true });

    const urls = updateRabbitMQUrls(
      rabbitConfig.urls,
      rabbitConfig.username,
      rabbitConfig.password,
      rabbitConfig.vhost,
    );
    //  Register more consumers for other exchanges
    if (rabbitConfig.exchanges?.length) {
      for (const exchange of rabbitConfig.exchanges) {
        app.connectMicroservice<MicroserviceOptions>({
          transport: Transport.RMQ,
          options: {
            urls,
            queue: rabbitConfig.queue,
            exchange,
            exchangeType: 'topic',
            queueOptions: {
              durable: rabbitConfig.queueDurable,
            },
            prefetchCount: rabbitConfig.prefetchCount,
            noAck: rabbitConfig.noAck,
          },
        });
      }
    }
  }
}
