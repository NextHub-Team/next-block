import {
  // decorators here
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { InternalEventPayload } from '../../common/internal-events/types/internal-events.type';

export class CreateInternalEventDto {
  @ApiPropertyOptional({
    required: false,
    type: Object,
    description: 'Serialized event payload.',
  })
  @IsOptional()
  @IsObject()
  payload?: InternalEventPayload;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  eventType: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
