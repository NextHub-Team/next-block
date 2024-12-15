import {
  // decorators here

  IsString,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateStatusDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
