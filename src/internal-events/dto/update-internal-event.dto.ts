// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateInternalEventDto } from './create-internal-event.dto';

export class UpdateInternalEventDto extends PartialType(
  CreateInternalEventDto,
) {}
