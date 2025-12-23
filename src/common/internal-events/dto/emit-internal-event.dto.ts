import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { InternalEventPayload } from '../types/internal-events.type';

export class EmitInternalEventDto {
  @ApiProperty({
    description: 'Event discriminator used for routing to handlers.',
    example: 'wallet.created',
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiPropertyOptional({
    description: 'Arbitrary payload data persisted in the outbox.',
    type: Object,
    example: { walletId: 'b67b7c40-6cf5-4b1b-bad2-f117722a905f' },
  })
  @IsOptional()
  @IsObject()
  payload?: InternalEventPayload;
}
