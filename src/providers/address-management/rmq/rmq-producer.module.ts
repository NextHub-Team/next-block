import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqPublisherService } from './rmq-publisher.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'SLEEVES_PUBLISHER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService
              .get<string>('communication.rabbitmqUrls')!
              .split(','),
            queue:
              configService.get<string>('communication.rabbitmqQueue') ??
              'sleeves-data',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [RmqPublisherService],
  exports: [RmqPublisherService],
})
export class RmqProducerModule {}
