// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAccessControlDto } from './create-access-control.dto';

export class UpdateAccessControlDto extends PartialType(
  CreateAccessControlDto,
) {}
