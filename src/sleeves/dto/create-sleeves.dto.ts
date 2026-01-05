import { IsEnum, IsOptional, IsString } from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { SleevesEnvType } from '../types/sleeves-enum.type';

export class CreateSleevesDto {
  @ApiProperty({
    required: true,
    enum: SleevesEnvType,
  })
  @IsEnum(SleevesEnvType)
  envType: SleevesEnvType;

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
