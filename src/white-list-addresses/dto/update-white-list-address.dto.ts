// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateWhiteListAddressDto } from './create-white-list-address.dto';

export class UpdateWhiteListAddressDto extends PartialType(
  CreateWhiteListAddressDto,
) {}
