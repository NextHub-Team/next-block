// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateEventLogDto } from './create-event-log.dto';

export class UpdateEventLogDto extends PartialType(CreateEventLogDto) {}
