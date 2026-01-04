import {
  // decorators here

  IsString,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateSleevesDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  tag?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  chainName: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  contractAddress: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  sleeveId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
