import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { updateRabbitMQUrls } from '../utils/rabbitmq-config.helper';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_PRODUCER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rabbitConfig = configService.get('rabbitMQ', { infer: true });

          const urls = updateRabbitMQUrls(
            rabbitConfig.urls,
            rabbitConfig.username,
            rabbitConfig.password,
            rabbitConfig.vhost,
          );

          return {
            transport: Transport.RMQ,
            options: {
              urls,
              queue: rabbitConfig.queue,
              exchangeType: 'topic',
              queueOptions: {
                durable: rabbitConfig.queueDurable,
              },
              prefetchCount: rabbitConfig.prefetchCount,
            },
          };
        },
      },
    ]),
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
  exports: [ClientsModule],
})
export class RabbitMQProducerModule {}
