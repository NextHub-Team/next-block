import { ApiProperty } from '@nestjs/swagger';
import { InternalEventPayload } from '../../common/internal-events/types/internal-events.type';

export class InternalEvent {
  @ApiProperty({
    type: Object,
    required: false,
    description: 'Serialized event payload.',
  })
  payload: InternalEventPayload;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Unique event identifier (mirrors the outbox row id).',
  })
  eventId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  eventType: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    required: false,
  })
  publishedAt?: Date | null;

  @ApiProperty({
    type: () => Date,
    description: 'When the event was created in the outbox.',
  })
  occurredAt?: Date;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
