// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateNftDto } from './create-nft.dto';

export class UpdateNftDto extends PartialType(CreateNftDto) {}
