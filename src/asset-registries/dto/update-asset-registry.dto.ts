// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAssetRegistryDto } from './create-asset-registry.dto';

export class UpdateAssetRegistryDto extends PartialType(
  CreateAssetRegistryDto,
) {}
