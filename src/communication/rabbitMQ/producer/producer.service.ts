import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { RMQExchangeDto, RMQMessageDto } from '../dto/message.dto';
import { AllConfigType } from '../../../config/config.type';

@Injectable()
export class ProducerService implements OnModuleInit {
  private readonly logger = new Logger(ProducerService.name);
  private readonly exchanges: string[];
  private readonly noAck: boolean;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('RABBITMQ_PRODUCER') private readonly clientProxy: ClientProxy,
  ) {
    this.exchanges =
      this.configService.get('rabbitMQ.exchanges', { infer: true }) || [];
    this.noAck =
      this.configService.get('rabbitMQ.noAck', { infer: true }) === true;
  }

  onModuleInit() {
    this.logger.log(
      `Producer Service initialized. Allowed exchanges: ${this.exchanges.join(', ')}`,
    );
  }

  getExchanges(): string[] {
    return this.exchanges;
  }

  sendMessage(paramDto: RMQExchangeDto, dto: RMQMessageDto): boolean {
    this.logger.debug(
      `Sending message to exchange [${paramDto.exchange}]: ${JSON.stringify(dto.payload)}`,
    );

    this.clientProxy.emit(paramDto.exchange, dto.payload); //TODO: Add handler for if emit failed
    return true;
  }
}
