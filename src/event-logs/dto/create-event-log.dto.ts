import { UserLogDto } from '../../user-logs/dto/user-log.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here
  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateEventLogDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  processed?: boolean;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  newValue: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  oldValue: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  property: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  entity: string;

  @ApiProperty({
    required: true,
    type: () => UserLogDto,
  })
  @ValidateNested()
  @Type(() => UserLogDto)
  @IsNotEmptyObject()
  userLog: UserLogDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
