import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InternalEventDeliveryStatus } from '../types/internal-events-enum.type';
import { InternalEventPayload } from '../types/internal-events.type';

export class InternalEventOutboxDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Event discriminator used for routing to handlers.',
  })
  eventType: string;

  @ApiProperty({
    type: Object,
    description: 'Serialized event payload ready for dispatch.',
  })
  payload: InternalEventPayload;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiPropertyOptional({
    type: Date,
  })
  publishedAt: Date | null;

  @ApiProperty({
    enum: InternalEventDeliveryStatus,
  })
  status: InternalEventDeliveryStatus;
}
