// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateUserLogDto } from './create-user-log.dto';

export class UpdateUserLogDto extends PartialType(CreateUserLogDto) {}