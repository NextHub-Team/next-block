import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

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
  exchange: string;
}
