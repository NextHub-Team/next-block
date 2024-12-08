// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSupportedAssetDto } from './create-supported-asset.dto';

export class UpdateSupportedAssetDto extends PartialType(
  CreateSupportedAssetDto,
) {}
