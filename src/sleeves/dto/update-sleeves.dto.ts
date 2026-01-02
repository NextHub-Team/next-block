// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSleevesDto } from './create-sleeves.dto';

export class UpdateSleevesDto extends PartialType(CreateSleevesDto) {}
