import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { IsAllowedExchange } from '../utils/rabbitmq-exchange.validator';

export class RMQMessageDto {
  /**
   * Optional message ID or label.
   */
  @IsString()
  @IsOptional()
  messageId?: string;

  /**
   * Payload to send to RabbitMQ.
   * Can be any JSON object.
   */
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;
}

export class RMQExchangeDto {
  /**
   * Name of the exchange to send the message to.
   */
  @IsString()
  @IsNotEmpty()
  // @IsAllowedExchange({ message: 'Exchange is not registered or allowed.' })
  exchange: string;
}